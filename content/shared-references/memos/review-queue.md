---
title: Paper Review Queue
type: memo
visibility: public
---

## Finding Papers to Review

Papers added from web searches that need manual verification are tagged with `status:needs-review`.

To find all papers needing review:

```bash
grep -l "status:needs-review" content/shared-references/bibtex-entries/*.md
```

Or using ripgrep:

```bash
rg -l "status:needs-review" content/shared-references/bibtex-entries/
```

## Review Checklist

When reviewing a paper:

1. Verify author names and affiliations
2. Confirm publication venue and year
3. Check URL is correct and accessible
4. Verify the abstract accurately describes the paper
5. Confirm collection tags are appropriate
6. Run the bibtex checker if available

After review, remove the `status:needs-review` tag.
