---
title: DIY robots handling (robots.txt++)
summary: >-
  robots.txt can be used to express AI crawler access preferences. See example
  from OpenAI. Additionally, the X-Robots-Tag response header allows servers to
  send crawler directives via HTTP response headers.
status: usable-with-some-evidence
website: 'https://platform.openai.com/docs/bots'
actionsSupported:
  - attach-preference-signal
recentActivity: '2025-09-17T00:00:00.000Z'
visibility: public
type: data_license_initiative
---

Websites can use `robots.txt` and related directives to communicate whether AI crawlers may access content. Many AI crawlers (such as GPTBot) publish user-agent strings and honor disallow/allow rules.

https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Robots-Tag

`X-Robots-Tag` allows servers to send crawler directives via HTTP response headers, enabling granular control per URL and response type beyond `robots.txt`.

See also
https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/
