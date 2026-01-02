#!/usr/bin/env python3
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

STATIC_DIR = Path(__file__).resolve().parent
DATA_DIR = Path(__file__).resolve().parents[2] / "content" / "shared-references"
REQUIRED_FIELDS = ["type", "citation_key", "entry_type", "title", "url"]
WARNING_FIELDS = ["authors", "year"]


def parse_value(raw):
    value = raw.strip()
    if len(value) >= 2 and ((value[0] == '"' and value[-1] == '"') or (value[0] == "'" and value[-1] == "'")):
        return value[1:-1]
    return value


def parse_frontmatter(text):
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return {}

    fm_lines = []
    for line in lines[1:]:
        if line.strip() == "---":
            break
        fm_lines.append(line)

    data = {}
    current_key = None
    for line in fm_lines:
        if not line.strip():
            continue
        if line.startswith("  - "):
            if current_key:
                data.setdefault(current_key, []).append(parse_value(line[4:]))
            continue
        if ":" in line:
            key, value = line.split(":", 1)
            key = key.strip()
            value = value.strip()
            if value == "":
                data[key] = []
            else:
                data[key] = parse_value(value)
            current_key = key
            continue
    return data


def load_entries():
    entries = []
    for path in sorted(DATA_DIR.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        frontmatter = parse_frontmatter(text)
        missing = [field for field in REQUIRED_FIELDS if not frontmatter.get(field)]
        warnings = [field for field in WARNING_FIELDS if not frontmatter.get(field)]
        entries.append({
            "file": path.name,
            "frontmatter": frontmatter,
            "missing": missing,
            "warnings": warnings,
        })
    return entries


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/entries":
            payload = {
                "entries": load_entries(),
                "required": REQUIRED_FIELDS,
                "warnings": WARNING_FIELDS,
            }
            body = json.dumps(payload, ensure_ascii=True).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        return super().do_GET()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8000), Handler)
    print("Metadata checker running at http://127.0.0.1:8000")
    server.serve_forever()
