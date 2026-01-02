---
visibility: public
type: data_license_memo
title: AI Preference Signals, Licenses, and Enforcement
---
# AI Preference Signals, Licenses, and Enforcement  

This is a brief memo aimed at organizations who might be thinking about adopting state of the art AI training data preference signals and/or licensing, and enforcing these signals and/or license terms so that members and contributors of an organization can control how their valuable content is used in AI pipelines.  

## Context  

Ambiguity in the legal frameworks that govern AI data practices has created uncertainty regarding what data can be used for AI training. While there is an emerging set of tools for data creators to express preferences about how and when their content should be used in AI pipelines, there is no widely adopted best practices standard.  

This creates a critical window for decisive action by organizations that steward valuable content. By adopting preference signals that state acceptable uses of data and conditions for use, and supporting enforcement of these preferences, an organization can protect its members and contributors from unauthorized exploitation of their work. It can positively influence the future of labor, intellectual property, and online communities. And it can lead the way in creating a consent first AI ecosystem.  

There are a number of emerging protocols and technologies that enable organizations to apply preference signals to data and (try to) enforce them. Examples include standards under development such as Really Simple Licensing, IETF "aipref" and Creative Commons "preference signals", technical measures like Cloudflare’s anti scraping technologies that enforce no training defaults, and alternative training paradigms such as privacy preserving computation through systems like SyftBox or data collaboration approaches like AI2's FlexOlmo.  

Organizations today have the power to enable AI systems to benefit from contributors’ work, but with their consent, proper credit, and potentially fair compensation.  

## Current Risks  

Right now, content from organizations is likely being scraped for AI training and evaluation datasets without the knowledge of authors or the organization itself. It is being used for post training and fine tuning purposes without proper attribution. Content may also be integrated into AI outputs that fail to respect the norms and ethics of the contributing community.

In some cases content may be retrieved by AI models in ways that are beneficial, such as by linking back to original sources and increasing visibility. It is important to be honest that there may be some winners from AI integration.  

However, public opinion data suggests that no training by default is the most widely supported position among both content creators and the general public. [citation needed]

## Proposal  

A reasonable default position for many organizations should be to mark organizational content as not available for AI training, while providing a clear and easy to use opt in mechanism for contributors who wish to allow specific uses. This is not about taking a permanent "anti-AI" stance, but rather about taking immediate actions while communities and institutions deliberate and set up themselves up for effective collective bargaining.

This approach preserves the autonomy of contributors, aligns with public sentiment, and keeps the door open to negotiated and mutually beneficial AI collaborations.  

## Implementation options today:

One option is a default no training signal applied across the organization’s content platforms, while allowing sub groups or working groups to adopt alternative signals such as compensation models, community support arrangements, or open access commitments, and permitting individual contributors to override these defaults.  

Another option is a default must attribute signal, justified by existing ethical or professional standards, while still allowing group or individual modifications.  

A third option is a survey-driven default, in which the organization firsts polls its members to determine the preferred approach and implements a no training, must attribute, or hybrid model accordingly.  

A fourth option is to take immediate actions to monetize, by exploring licensing partnerships with AI developers for controlled access to contributor content and testing revenue sharing models, contributor compensation schemes, or community funded open access licenses.  

## Enforcement  

Enforcement of these preferences can take multiple forms. For no training defaults, organizations can rely on technical measures such as AI crawler blocking. For attribution requirements, they can conduct audits to monitor AI models for use of organizational content and check citation rates in retrieval systems and outputs. For long term readiness, organizations can explore partnerships with privacy preserving computation platforms that honor preference metadata. Escalation tools such as watermarking, dataset poisoning, or reputational pressure campaigns can be used against non compliant developers. Finally, cross platform coordination with peer institutions like arXiv, Wikipedia, and Stack Exchange can help build momentum toward industry wide standards.  

## Key Considerations  

A full no training default may limit the use of more granular signals at the group or author level. In cases where content might become fully open without embedded preference signals, future enforcement becomes significantly harder. Early adoption increases the likelihood of AI developers respecting and implementing signals.  

## Why Action Is Needed  

Under the current status quo, members and contributors have no reliable way to express preferences for if, how, and when their content is used in AI pipelines. Without action, academic and professional attribution norms may be undermined, economic benefits from AI will disproportionately flow to technology companies and bypass the content creators, and organizations risk facilitating AI systems that profit from members’ work without consent, credit, or compensation. What's more, substantially *less data* will be available for AI training, meaning that AI itself may fail to achieve its "full" capabilities!

## References  

Creative Commons Preference Signals: https://creativecommons.org/2025/06/25/introducing-cc-signals-a-new-social-contract-for-the-age-of-ai/  

IETF AI Preference Signaling (AI Pref): https://www.ietf.org/blog/aipref-wg/ and https://datatracker.ietf.org/wg/aipref/about/  

Cloudflare AI Crawler Blocking: https://www.cloudflare.com/en-ca/press-releases/2025/cloudflare-just-changed-how-ai-crawlers-scrape-the-internet-at-large/  

OpenMined NSAI: https://syft-protocol.openmined.org/  

AI2 FlexOlmo: https://allenai.org/blog/flexolmo
