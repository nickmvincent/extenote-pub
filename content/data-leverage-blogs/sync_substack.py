#!/usr/bin/env python3
"""Sync Data Leverage Substack posts into this folder.

Why this script exists:
- Substack's JSON-LD dateModified can lag or stay unchanged.
- The more reliable field for post edits is `post.updated_at` in page preloads.
- We persist sync state so we only refresh posts that changed since the last sync.

Usage examples:
  python3 sync_substack.py --dry-run
  python3 sync_substack.py
  python3 sync_substack.py --url https://dataleverage.substack.com/p/almost-everybody-including-both-data
  python3 sync_substack.py --force-overwrite
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36"
)
SUBSTACK_HOST = "https://dataleverage.substack.com"
STATE_VERSION = 1
DEFAULT_STATE_FILE = ".substack-sync.json"


def eprint(*args: object) -> None:
    print(*args, file=sys.stderr)


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def now_utc_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def parse_iso(ts: str | None) -> datetime | None:
    if not ts:
        return None
    try:
        return datetime.fromisoformat(ts.replace("Z", "+00:00"))
    except ValueError:
        return None


def fetch_text(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": UA,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Cache-Control": "no-cache",
        },
    )
    with urllib.request.urlopen(req, timeout=40) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def fetch_json(url: str) -> Any:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": UA,
            "Accept": "application/json,*/*;q=0.8",
            "Cache-Control": "no-cache",
        },
    )
    with urllib.request.urlopen(req, timeout=40) as resp:
        return json.loads(resp.read().decode("utf-8", errors="ignore"))


def extract_preloads(html: str) -> dict[str, Any]:
    m = re.search(
        r'window\._preloads\s*=\s*JSON\.parse\("(.*?)"\)\s*</script>',
        html,
        flags=re.S,
    )
    if not m:
        raise ValueError("Could not find window._preloads JSON")
    json_escaped = m.group(1)
    unescaped = json.loads('"' + json_escaped + '"')
    return json.loads(unescaped)


def clean_body_html(body_html: str) -> str:
    """Reduce Substack UI artifacts before pandoc conversion."""

    def replace_image_block(match: re.Match[str]) -> str:
        block = match.group(0)
        src_match = re.search(r'<img[^>]*\ssrc="([^"]+)"', block)
        src = src_match.group(1) if src_match else ""
        cap_match = re.search(r"<figcaption[^>]*>([\s\S]*?)</figcaption>", block)
        caption = cap_match.group(1).strip() if cap_match else ""

        out: list[str] = []
        if src:
            out.append(f'<p><img src="{src}" /></p>')
        if caption:
            out.append(f"<p><em>{caption}</em></p>")
        return "".join(out)

    html = body_html
    html = re.sub(r'<div class="captioned-image-container">[\s\S]*?</div>', replace_image_block, html)
    html = re.sub(r'<div class="image-link-expand">[\s\S]*?</div>', "", html)
    html = re.sub(r"<button\b[\s\S]*?</button>", "", html)
    return html


def html_to_markdown(html: str) -> str:
    proc = subprocess.run(
        ["pandoc", "-f", "html", "-t", "gfm", "--wrap=none"],
        input=html,
        text=True,
        capture_output=True,
        check=True,
    )
    return proc.stdout.strip() + "\n"


def extract_original_url(md_text: str) -> str | None:
    m = re.search(r'^original_url:\s*[\'"]?([^\'"\n]+)', md_text, flags=re.M)
    return m.group(1).strip() if m else None


def split_frontmatter(md_text: str) -> tuple[str, str]:
    if not md_text.startswith("---\n"):
        return "", md_text
    end_idx = md_text.find("\n---\n", 4)
    if end_idx == -1:
        return "", md_text
    front = md_text[: end_idx + 5]
    body = md_text[end_idx + 5 :]
    return front, body


def body_hash_from_file(path: Path) -> str:
    text = path.read_text(encoding="utf-8", errors="ignore")
    _, body = split_frontmatter(text)
    return sha256_text(body.strip())


def format_human_date(post_date: str) -> str:
    dt = parse_iso(post_date)
    if not dt:
        return post_date
    return dt.strftime("%B %d, %Y").replace(" 0", " ")


def format_ymd(post_date: str) -> str:
    dt = parse_iso(post_date)
    if not dt:
        return "1970-01-01"
    return dt.strftime("%Y-%m-%d")


def folded_yaml(key: str, value: str) -> str:
    lines = value.strip().splitlines() or [""]
    indented = "\n".join(f"  {line}" for line in lines)
    return f"{key}: >-\n{indented}\n"


def build_default_frontmatter(post: dict[str, Any], canonical_url: str) -> str:
    title = (post.get("title") or "").strip()
    subtitle = (post.get("subtitle") or post.get("description") or "").strip()
    post_date = post.get("post_date") or ""
    slug = (post.get("slug") or canonical_url.rstrip("/").split("/")[-1]).strip()

    parts = ["---\n"]
    parts.append(folded_yaml("title", title))
    if subtitle:
        parts.append(folded_yaml("subtitle", subtitle))
    parts.append(f"date: '{format_ymd(post_date)}'\n")
    parts.append(f"slug: {slug}\n")
    parts.append("type: shared_memo\n")
    parts.append(f"original_url: '{canonical_url}'\n")
    parts.append("visibility: public\n")
    parts.append("author: Nick Vincent\n")
    parts.append("publication: Data Leverage\n")
    parts.append("---\n\n")
    return "".join(parts)


def build_content(post: dict[str, Any], canonical_url: str, existing_frontmatter: str) -> str:
    front = existing_frontmatter or build_default_frontmatter(post, canonical_url)

    post_date = post.get("post_date") or ""
    header = (
        f"**Source:** [Data Leverage Substack]({canonical_url})  \n"
        f"**Date Published:** {format_human_date(post_date)}\n\n"
    )

    body_html = clean_body_html(post.get("body_html") or "")
    body_md = html_to_markdown(body_html)
    return front + header + body_md


def fetch_archive_urls() -> set[str]:
    urls: set[str] = set()
    try:
        data = fetch_json(f"{SUBSTACK_HOST}/api/v1/archive?sort=new")
    except Exception as exc:  # noqa: BLE001
        eprint(f"[warn] Could not fetch archive API: {exc}")
        return urls

    if isinstance(data, list):
        for item in data:
            if not isinstance(item, dict):
                continue
            url = item.get("canonical_url")
            if isinstance(url, str) and url.startswith(f"{SUBSTACK_HOST}/p/"):
                urls.add(url)
    return urls


def fetch_feed_urls() -> set[str]:
    urls: set[str] = set()
    try:
        xml_text = fetch_text(f"{SUBSTACK_HOST}/feed")
        root = ET.fromstring(xml_text)
    except Exception as exc:  # noqa: BLE001
        eprint(f"[warn] Could not fetch RSS feed: {exc}")
        return urls

    channel = root.find("channel")
    if channel is None:
        return urls

    for item in channel.findall("item"):
        link = (item.findtext("link") or "").strip()
        if link.startswith(f"{SUBSTACK_HOST}/p/"):
            urls.add(link)
    return urls


def fetch_post(url: str) -> dict[str, Any]:
    html = fetch_text(url)
    preloads = extract_preloads(html)
    post = preloads.get("post")
    if not isinstance(post, dict):
        raise ValueError("Post preloads missing")

    canonical = post.get("canonical_url") or url
    if not isinstance(canonical, str):
        canonical = url
    post["canonical_url"] = canonical
    return post


def discover_local_posts(cwd: Path) -> dict[str, str]:
    mapping: dict[str, str] = {}
    for path in sorted(cwd.glob("*.md")):
        text = path.read_text(encoding="utf-8", errors="ignore")
        url = extract_original_url(text)
        if url and url.startswith(f"{SUBSTACK_HOST}/p/"):
            mapping[url] = path.name
    return mapping


def load_state(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"version": STATE_VERSION, "last_run_utc": None, "posts": {}}
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("State file is not a JSON object")
    if data.get("version") != STATE_VERSION:
        eprint(
            f"[warn] State version mismatch (found={data.get('version')} expected={STATE_VERSION}). "
            "Proceeding with best effort."
        )
    data.setdefault("posts", {})
    return data


def save_state(path: Path, state: dict[str, Any]) -> None:
    state["version"] = STATE_VERSION
    state["last_run_utc"] = now_utc_iso()
    path.write_text(json.dumps(state, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def compare_updated_at(new_ts: str | None, old_ts: str | None) -> bool:
    new_dt = parse_iso(new_ts)
    old_dt = parse_iso(old_ts)
    if new_dt and old_dt:
        return new_dt > old_dt
    if new_dt and not old_dt:
        return True
    return False


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync Data Leverage Substack posts into this folder.")
    parser.add_argument("--dry-run", action="store_true", help="Print actions without writing files.")
    parser.add_argument(
        "--state-file",
        default=DEFAULT_STATE_FILE,
        help=f"Path to sync state file (default: {DEFAULT_STATE_FILE}).",
    )
    parser.add_argument(
        "--no-bootstrap",
        action="store_true",
        help="If state file does not exist, do not baseline existing files; evaluate all existing posts.",
    )
    parser.add_argument(
        "--force-overwrite",
        action="store_true",
        help="Overwrite local files even if they changed since the last synced file hash.",
    )
    parser.add_argument(
        "--url",
        action="append",
        default=[],
        help="Sync only a specific post URL (can be passed multiple times).",
    )
    parser.add_argument(
        "--refresh-url",
        action="append",
        default=[],
        help="Force-refresh a specific post URL even if updated_at has not advanced.",
    )
    args = parser.parse_args()

    cwd = Path.cwd()
    state_path = cwd / args.state_file
    state = load_state(state_path)
    posts_state: dict[str, Any] = state.setdefault("posts", {})

    local_by_url = discover_local_posts(cwd)
    had_state_file = state_path.exists()
    bootstrap_mode = (not had_state_file) and (not args.no_bootstrap)

    if bootstrap_mode:
        print("[info] No existing state file found. Bootstrapping baseline for existing posts.")

    archive_urls = fetch_archive_urls()
    feed_urls = fetch_feed_urls()

    if args.url:
        target_urls = set(args.url)
    else:
        target_urls = set(local_by_url.keys()) | archive_urls | feed_urls
    refresh_urls = set(args.refresh_url)

    if not target_urls:
        print("[info] No candidate Substack URLs found.")
        return 0

    added = 0
    updated = 0
    skipped = 0
    conflicts = 0
    errors = 0

    for url in sorted(target_urls):
        if not url.startswith(f"{SUBSTACK_HOST}/p/"):
            continue

        try:
            post = fetch_post(url)
        except (urllib.error.URLError, ValueError, json.JSONDecodeError) as exc:
            errors += 1
            eprint(f"[error] Failed to fetch/parse {url}: {exc}")
            continue

        canonical = post.get("canonical_url") or url
        if not isinstance(canonical, str):
            canonical = url

        post_date = (post.get("post_date") or "").strip()
        updated_at = (post.get("updated_at") or post_date).strip()
        slug = (post.get("slug") or canonical.rstrip("/").split("/")[-1]).strip()
        filename = f"{format_ymd(post_date)}-{slug}.md" if post_date else f"{slug}.md"

        local_file = (
            local_by_url.get(canonical)
            or local_by_url.get(url)
            or None
        )
        path = cwd / (local_file or filename)

        entry = posts_state.get(canonical) or posts_state.get(url)
        if entry and isinstance(entry, dict):
            last_synced_updated_at = entry.get("last_synced_updated_at")
            last_synced_file_hash = entry.get("last_synced_file_hash")
        else:
            last_synced_updated_at = None
            last_synced_file_hash = None
            entry = None

        is_new_local = not path.exists()
        needs_sync = False
        reason = ""

        if is_new_local:
            needs_sync = True
            reason = "new"
        elif entry is None and bootstrap_mode:
            needs_sync = False
            reason = "bootstrap"
        elif entry is None and not bootstrap_mode:
            needs_sync = True
            reason = "no-state"
        elif compare_updated_at(updated_at, last_synced_updated_at):
            needs_sync = True
            reason = "updated_at"
        else:
            needs_sync = False
            reason = "unchanged"

        if (canonical in refresh_urls) or (url in refresh_urls):
            needs_sync = True
            reason = "refresh-url"

        # Keep an existing frontmatter block exactly if present.
        existing_frontmatter = ""
        if path.exists():
            current_text = path.read_text(encoding="utf-8", errors="ignore")
            existing_frontmatter, _ = split_frontmatter(current_text)

        if needs_sync:
            if path.exists() and (entry is not None) and (not args.force_overwrite):
                current_file_hash = sha256_file(path)
                if last_synced_file_hash and current_file_hash != last_synced_file_hash:
                    conflicts += 1
                    print(f"[conflict] {path.name}: local file changed since last sync; skipping.")
                    skipped += 1
                    continue

            try:
                new_text = build_content(post, canonical, existing_frontmatter)
            except subprocess.CalledProcessError as exc:
                errors += 1
                eprint(f"[error] pandoc conversion failed for {canonical}: {exc}")
                continue

            action = "add" if is_new_local else "update"
            if args.dry_run:
                print(f"[dry-run] {action}: {path.name} ({reason})")
            else:
                path.write_text(new_text, encoding="utf-8")
                print(f"[{action}] {path.name} ({reason})")

            local_by_url[canonical] = path.name

            file_hash = sha256_text(new_text) if args.dry_run else sha256_file(path)
            body_hash = sha256_text(split_frontmatter(new_text)[1].strip())
            posts_state[canonical] = {
                "file": path.name,
                "post_id": post.get("id"),
                "last_synced_updated_at": updated_at or None,
                "last_synced_body_hash": body_hash,
                "last_synced_file_hash": file_hash,
                "last_synced_at_utc": now_utc_iso(),
            }

            if is_new_local:
                added += 1
            else:
                updated += 1
        else:
            if path.exists() and (entry is None) and bootstrap_mode:
                posts_state[canonical] = {
                    "file": path.name,
                    "post_id": post.get("id"),
                    "last_synced_updated_at": updated_at or None,
                    "last_synced_body_hash": body_hash_from_file(path),
                    "last_synced_file_hash": sha256_file(path),
                    "last_synced_at_utc": now_utc_iso(),
                }
                print(f"[bootstrap] {path.name}")
            else:
                skipped += 1

    if args.dry_run:
        print(
            f"[summary] dry-run: added={added} updated={updated} "
            f"skipped={skipped} conflicts={conflicts} errors={errors}"
        )
        return 0

    save_state(state_path, state)
    print(
        f"[summary] added={added} updated={updated} "
        f"skipped={skipped} conflicts={conflicts} errors={errors}"
    )
    print(f"[state] wrote {state_path.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
