---
title: TDMRep (W3C)
summary: >-
  W3C specification for expressing text and data mining permissions via a
  well-known JSON file, designed for EU DSM Directive compliance.
status: usable-but-new
website: 'https://www.w3.org/community/tdmrep/'
spec: 'https://www.w3.org/2022/tdmrep/'
actionsSupported:
  - attach-preference-signal
  - attach-formal-license
pipelineStages:
  - collect
  - train
jurisdictions:
  - EU
tags:
  - text-data-mining
  - dsm-directive
  - opt-out
recentActivity: '2024-06-01T00:00:00.000Z'
recentActivityNote: W3C Community Group active
visibility: public
type: data_license_initiative
implementationSnippets:
  - title: '/.well-known/tdmrep.json'
    language: json
    code: |
      {
        "tdm": "optout",
        "license": "https://example.com/license"
      }
    sourceUrl: 'https://www.w3.org/2022/tdmrep/'
---

TDMRep is a W3C Community Group specification that enables publishers to declare their text and data mining (TDM) policies through a machine-readable file at `/.well-known/tdmrep.json`. Designed specifically to support the EU DSM Directive's opt-out mechanism for commercial TDM.
