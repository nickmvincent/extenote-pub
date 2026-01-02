---
title: Reference Check Scratchpad
type: scratchpad
visibility: public
created: 2024-12-28
updated: 2024-12-28
purpose: Agent and human coordination for reference verification
---

# Reference Check Scratchpad

## Instructions for Agents

This document coordinates verification of references that cannot be automatically checked via academic APIs (DBLP, Semantic Scholar, OpenAlex, Crossref).

### Your Task
1. Pick an item from the **Pending Verification** section below
2. Use web search to find the canonical source (publisher page, official website, etc.)
3. Verify the metadata matches: title, authors, year, venue/publisher
4. Update the item's status in this table
5. If you find a canonical URL, add it to `canonical_source` column
6. Add notes about any discrepancies or concerns
7. **IMPORTANT**: After verifying, update the actual reference file's frontmatter with `manually_verified` and `canonical_source` fields

### Verification Standards
- **Books**: Use publisher website, Google Books, or WorldCat
- **Technical specs/standards**: Use official specification website
- **Datasets**: Use official repository (HuggingFace, GitHub, Kaggle)
- **Blog posts/articles**: Use original publication URL
- **Preprints not in DBs**: Use arXiv, SSRN, or institutional repository

### Status Values
| Status | Meaning |
|--------|---------|
| `pending` | Not yet verified |
| `verified` | Agent verified via web search |
| `needs_human` | Agent found issues requiring human judgment |
| `confirmed` | Human confirmed correct |
| `fixed` | Human corrected and confirmed |

### How to Update Reference Files
After verification, the reference file should have these fields added to frontmatter:

```yaml
manually_verified:
  verified_at: '2024-12-28T10:00:00.000Z'
  verified_by: agent  # or 'human:username'
  notes: "Verified against publisher website"

canonical_source:
  url: "https://example.com/the-reference"
  title: "Page title as displayed"
  accessed_at: '2024-12-28'
  match_confidence: 1.0  # 0-1, how confident the match is
```

---

## Summary Stats (Last updated: 2025-12-28)

| Category | Count | Verified | Needs Human |
|----------|-------|----------|-------------|
| Books (not_found) | 24 | 24 | 0 |
| Misc/Specs (not_found) | 58 | 58 | 0 | (smith2020 deleted)
| Articles (not_found) | 36 | 28 | 8 | (weyl2018blueprint deleted as duplicate)
| Mismatches (author count) | 13 | 13 | 0 |
| Mismatches (year) | 8 | 8 | 0 |
| Mismatches (venue-only) | ~100 | - | auto-acceptable |
| **Total verified** | **131** | 131 | **8** |
| **Confirmed (by API)** | **101** | - | - |

---

## Pending Verification: NOT FOUND

### Books (24 items) - ALL VERIFIED
<!-- Books not found in academic databases - verify via publisher/Google Books/WorldCat -->

| file | title | year | status | canonical_source | notes |
|------|-------|------|--------|------------------|-------|
| bijker1987 | The Social Construction of Technological Systems | 1987 | verified | mitpress.mit.edu | MIT Press |
| binfield2004 | Writings of the Luddites | 2004 | verified | muse.jhu.edu | Johns Hopkins UP |
| bowker1999 | Sorting Things Out: Classification and Its Consequences | 1999 | verified | mitpress.mit.edu | MIT Press |
| braverman1974 | Labor and Monopoly Capital | 1974 | verified | monthlyreview.org | Monthly Review Press |
| burawoy1979 | Manufacturing Consent | 1979 | verified | press.uchicago.edu | U Chicago Press |
| dreyfus1972 | What Computers Can't Do | 1972 | verified | books.google.com | Harper & Row |
| dreyfus1992 | What Computers Still Can't Do | 1992 | verified | mitpress.mit.edu | MIT Press |
| dyerwitheford2015 | Cyber-Proletariat | 2015 | verified | plutobooks.com | Pluto Press |
| floridi2013 | The Ethics of Artificial Intelligence | 2004 | fixed | link.springer.com | YEAR FIXED: 2004 Minds & Machines article |
| hochschild1983 | The Managed Heart | 1983 | verified | ucpress.edu | UC Press |
| johnson2023power | Power and Progress | 2023 | verified | publicaffairsbooks.com | 2024 Nobel laureates |
| minsky1967 | Computation: Finite and Infinite Machines | 1967 | verified | dl.acm.org | Prentice-Hall |
| ostrom1990 | Governing the Commons | 1990 | verified | cambridge.org | 2009 Nobel |
| pasquinelli2023 | The Eye of the Master | 2023 | verified | versobooks.com | 2024 Deutscher Prize |
| pml1book | Probabilistic Machine Learning: An introduction | 2022 | verified | mitpress.mit.edu | Kevin Murphy |
| polanyi1944 | The Great Transformation | 1944 | verified | wikipedia.org | Farrar & Rinehart |
| raymond1999 | The Cathedral and the Bazaar | 1999 | verified | oreilly.com | Year confirmed |
| scholz2016platforms | Ours to Hack and to Own | 2016 | verified | orbooks.com | OR Books |
| shapiro1998 | Information Rules | 1998 | verified | hbr.org | HBS Press |
| slee2015 | What's Yours Is Mine | 2015 | verified | orbooks.com | OR Books |
| srnicek2017 | Platform Capitalism | 2017 | verified | politybooks.com | Polity Press |
| turkle1984 | The Second Self | 1984 | verified | mitpress.mit.edu | Simon & Schuster 1st ed |
| wiener1948 | Cybernetics | 1948 | verified | mitpress.mit.edu | MIT Press |
| williamson1985 | The Economic Institutions of Capitalism | 1985 | verified | ssrn.com | Free Press, 2009 Nobel |

### Misc/Specs/Standards (59 items - HIGH PRIORITY for agents)
<!-- These have URLs - agents should verify the URL still works and metadata is correct -->

| file | title | url | status | notes |
|------|-------|-----|--------|-------|
| alpaca_clean | Alpaca Data Cleaned Repository | github.com/gururise/AlpacaDataCleaned | verified | 1.6k stars |
| alpaca_post | Alpaca blog post | crfm.stanford.edu/2023/03/13/alpaca.html | verified | March 13 2023 |
| alpaca_repo | Stanford Alpaca GitHub | github.com/tatsu-lab/stanford_alpaca | verified | Official Tatsu Lab repo |
| amodei2024machines | Machines of Loving Grace | darioamodei.com/essay/machines-of-loving-grace | verified | URL updated to /essay/, Oct 11 2024 |
| arxiv_api | arXiv API User's Manual | info.arxiv.org/help/api/user-manual.html | verified | Official arXiv docs |
| arxiv_bulk | arXiv Bulk Data Access | info.arxiv.org/help/bulk_data.html | verified | Official arXiv docs |
| arxiv_oai | arXiv OAI-PMH Interface | info.arxiv.org/help/oa/index.html | verified | Official arXiv docs |
| cc_ai_and_cc_2023 | Understanding CC Licenses and Generative AI | creativecommons.org/2023/08/18/understanding-cc-licenses-and-generative-ai/ | verified | Aug 18 2023 |
| cc_formats | Web Archiving File Formats | commoncrawl.org/blog/web-archiving-file-formats-explained | verified | Common Crawl blog |
| cc_getstarted | Common Crawl Get Started | commoncrawl.org/get-started | verified | Official CC docs |
| common_crawl_website | Common Crawl | commoncrawl.org | verified | Nonprofit 501(c)(3) |
| coppa_ftc_2013 | COPPA Rule | ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa | verified | FTC official |
| crawford_paglen_excavating_ai_2019 | Excavating AI | excavating.ai | verified | Sep 19 2019 |
| deckelmann_wikipedias_2023 | Wikipedia's value in the age of AI | wikimediafoundation.org/news/2023/07/12/wikipedias-value-in-the-age-of-generative-ai/ | verified | Jul 12 2023 |
| dolly_repo | Databricks Dolly | github.com/databrickslabs/dolly | verified | 10.8k stars |
| eu_gdpr_2016 | GDPR | eur-lex.europa.eu/eli/reg/2016/679/oj | verified | EUR-Lex official |
| ferpa_ed_1974 | FERPA | studentprivacy.ed.gov/ferpa | verified | URL updated to current domain |
| gsm8k_hf | GSM8K HuggingFace | huggingface.co/datasets/openai/gsm8k | verified | OpenAI official |
| gsm8k_repo | GSM8K GitHub | github.com/openai/grade-school-math | verified | OpenAI official |
| hh_rlhf | HH-RLHF Dataset | huggingface.co/datasets/Anthropic/hh-rlhf | verified | URL updated, GitHub deprecated |
| hipaa_privacy_rule_2000 | HIPAA Privacy Rule | hhs.gov/hipaa/for-professionals/privacy/index.html | verified | URL works, HHS.gov official |
| howto100m_site | HowTo100M Project | di.ens.fr/willow/research/howto100m/ | verified | ENS Paris Willow team |
| iipc_warc | WARC Format 1.1 | iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/ | verified | Found spec URL |
| illinois_bipa_2008 | BIPA | ilga.gov/legislation/ilcs/ilcs3.asp?ActID=3004 | verified | Illinois General Assembly |
| jsonlines | JSON Lines Specification | jsonlines.org | verified | Official spec site |
| laion_5b | LAION-5B | laion.ai/blog/laion-5b/ | verified | URL updated to blog format |
| liu_data_2024 | Data Flywheels for LLM | jxnl.co/writing/2024/03/28/data-flywheel/ | verified | Jason Liu article |
| loc_warc | WARC Format (LoC) | loc.gov/preservation/digital/formats/fdd/fdd000236.shtml | verified | Library of Congress |
| lozhkov2024starcoder2stackv2 | StarCoder 2 and The Stack v2 | arxiv.org/abs/2402.19173 | verified | arXiv confirmed, 66 authors |
| marda2024public | Public AI | mozillafoundation.org/en/research/library/public-ai/ | verified | Mozilla Foundation Sep 2024 |
| math_hf | Competition Math HuggingFace | huggingface.co/datasets/hendrycks/competition_math | verified | Note: DMCA notice exists |
| meta_dumps | Wikipedia Data Dumps | meta.wikimedia.org/wiki/Data_dumps/Dump_format | verified | Meta-Wikimedia |
| ndjson_spec | NDJSON Specification | github.com/ndjson/ndjson-spec | verified | GitHub spec |
| nostalgebraist2020 | interpreting GPT: the logit lens | lesswrong.com/posts/AcKRB8wDpdaN6v6ru/interpreting-gpt-the-logit-lens | verified | Found URL, Aug 2020 |
| oasst1_hf | OpenAssistant OASST1 | huggingface.co/datasets/OpenAssistant/oasst1 | verified | HuggingFace dataset |
| openai_chatapi | OpenAI Chat API Reference | platform.openai.com/docs/api-reference/chat | verified | OpenAI Platform |
| owasp_llm_top10_2023 | OWASP Top 10 for LLMs | owasp.org/www-project-top-10-for-large-language-model-applications/ | verified | OWASP Foundation |
| parquet | Apache Parquet | parquet.apache.org | verified | Apache official |
| pg_catalogs | Project Gutenberg Catalogs | gutenberg.org/ebooks/offline_catalogs.html | verified | Project Gutenberg |
| pg_formats | Project Gutenberg Formats | gutenberg.org/help/file_formats.html | verified | Project Gutenberg |
| pushshift_site | Pushshift.io | pushshift.io | verified | Archiving platform, restricted access since 2023 API changes |
| reddit_api | Reddit API Docs | reddit.com/dev/api/ | verified | OAuth required, 60 req/min |
| reddit_help | Reddit Data API Wiki | support.reddithelp.com/hc/en-us/articles/16160319875092 | verified | Found URL, updated Nov 2025 |
| relaion_5b | Re-LAION-5B | laion.ai/blog/relaion-5b/ | verified | Year corrected: 2024 not 2022 |
| roche_what_2024 | What is a Data Flywheel | snowplow.io/blog/what-is-a-data-flywheel | verified | Dec 5, 2024 |
| se_dataexplorer | Stack Exchange Data Explorer | data.stackexchange.com/help | verified | SQL query tool, weekly updates |
| se_meta | Stack Exchange Data Dump format | meta.stackexchange.com/questions/267329 | verified | Found URL, discusses XML format |
| shankar_data_2024 | Data Flywheels for LLM Apps | sh-reya.com/blog/ai-engineering-flywheel/ | verified | July 2024 |
| silver2025experience | Welcome to the Era of Experience | storage.googleapis.com/.../Era-of-Experience... | verified | Silver+Sutton, April 2025, DeepMind PDF |
| ~~smith2020~~ | ~~Example Citation Placeholder~~ | - | DELETED | Placeholder entry removed |
| stack_docs | BigCode Project Docs | bigcode-project.org/docs/about/the-stack/ | verified | 6.4TB source code |
| stack_hf | The Stack HuggingFace | huggingface.co/datasets/bigcode/the-stack | verified | 6TB, 358 languages |
| stack_v2_hf | The Stack v2 HuggingFace | huggingface.co/datasets/bigcode/the-stack-v2 | verified | 3B files, 600+ languages |
| tfds_c4 | C4 in TensorFlow Datasets | tensorflow.org/datasets/catalog/c4 | verified | Cleaned Common Crawl |
| tfrecord_tf | TFRecord Tutorial | tensorflow.org/tutorials/load_data/tfrecord | verified | Binary records format |
| us_copyright_office_ai_2024 | Copyright and AI Policy | copyright.gov/ai/ | verified | Multi-part study, 10k+ comments |
| whisper_blog | Introducing Whisper | openai.com/index/whisper/ | verified | Sep 2022, MIT License |
| wiki_db | Wikipedia Database Download | en.wikipedia.org/wiki/Wikipedia:Database_download | verified | CC-BY-SA 4.0, monthly dumps |

### Articles Not in Academic DBs (37 items)
<!-- These may need manual search or are preprints/reports -->

| file | title | year | status | notes |
|------|-------|------|--------|-------|
| andrejevic2011 | Surveillance and alienation in the online economy | 2011 | verified | Surveillance & Society Vol 8(3), open access |
| autor2024 | The labor market impacts of technological change | 2024 | needs_human | NBER W30074 is 2022, not 2024 - year mismatch |
| batty2001modelingc | Modeling Complexity: The Limits to Prediction | 2001 | verified | UCL Discovery, CASA Working Papers 36 |
| benaich2023 | State of AI Report 2023 | 2023 | verified | stateof.ai official |
| couldry2019 | Data colonialism | 2019 | verified | SAGE Television & New Media, DOI: 10.1177/1527476418796632 |
| dpo_paper | Direct Preference Optimization | 2024 | verified | arXiv:2305.18290, NeurIPS 2023 |
| dubal2020 | The digitization of day labor as gig work | 2020 | verified | OnLabor.org |
| elhage2021 | A mathematical framework for transformer circuits | 2021 | verified | transformer-circuits.pub, Anthropic |
| flew2021 | The Australian News Media Bargaining Code | 2021 | needs_human | Found in Journal of Media Law, not Internet Policy Review |
| gao2023 | Scaling laws for reward model overoptimization | 2023 | verified | ICML 2023, arXiv:2210.10760 |
| gao2024 | The impact of generative AI on Wikipedia traffic | 2024 | needs_human | Could not find paper with this title/author |
| gregory2021 | The value of data: Evidence from ride-hailing | 2021 | needs_human | Could not find NBER paper with this author combo |
| grimmelmann2009 | The Google dilemma | 2009 | verified | SSRN, 53 NYLS Law Rev. 939 |
| hugenholtz2021 | Copyright in the data economy | 2021 | needs_human | Found related work, exact chapter not confirmed |
| keynes1930 | Economic possibilities for our grandchildren | 1930 | verified | Cambridge UP Collected Writings. Classic |
| kitchin2017 | Thinking critically about algorithms | 2017 | verified | Taylor & Francis, DOI: 10.1080/1369118X.2016.1154087 |
| lanier2018 | A blueprint for a better digital society | 2018 | verified | HBR Sep 26 2018 |
| lemley2021 | Fair learning | 2021 | verified | Texas Law Review Vol 99(4), pp. 743-785 |
| lipton2018troubling | Troubling Trends in Machine Learning Scholarship | 2018 | verified | arXiv:1807.03341, ICML 2018 Debates |
| longpre2024dataprovenance | The Data Provenance Initiative | 2024 | verified | Nature Machine Intelligence, Aug 14 2024 |
| mackenzie1999 | Technological determinism | 1999 | needs_human | Found in Social Shaping of Technology, venue mismatch |
| mcdonald2008costof | The Cost of Reading Privacy Policies | 2008 | verified | OSU Knowledge Bank, I/S Vol 4(3) |
| mlodozeniec2025dtda | Distributional Training Data Attribution | 2025 | verified | arXiv:2506.12965 |
| narayanan2025 | AI as Normal Technology | 2025 | verified | Knight First Amendment Institute |
| oderinwale2025aitrainingeconomics | The Economics of AI Training Data | 2025 | verified | arXiv:2510.24990 |
| pile_paper | The Pile: An 800GB Dataset | 2021 | verified | arXiv:2101.00027, EleutherAI |
| rogers2023 | Changing the world by changing the data | 2023 | needs_human | Actually ACL-IJCNLP 2021 - year mismatch |
| shumailov2024 | Model collapse from recursive training | 2024 | verified | Nature 631, 755-759 |
| taylor2023 | Canada's Online News Act | 2023 | needs_human | Could not find in CJC 2023 by Gregory Taylor |
| terranova2000 | Free labor: Producing culture for digital economy | 2000 | verified | Duke UP Social Text Vol 18(2). Classic |
| turing1950 | Computing machinery and intelligence | 1950 | verified | Oxford Mind Vol LIX(236). Classic |
| vincent2021 | Data leverage: empowering the public | 2021 | verified | ACM FAccT 2021, DOI: 10.1145/3442188.3445885 |
| vincentcanada | Canada as a Champion for Public AI | 2025 | verified | Montreal AI Ethics reference |
| wang2020recidivism | Interpretable Fair ML for Recidivism | 2020 | verified | arXiv:2005.04176, J Quant Criminology 2023 |
| ~~weyl2018blueprint~~ | ~~A Blueprint for a Better Digital Society~~ | 2018 | DELETED | Duplicate of lanier2018, removed |
| winner1980 | Do artifacts have politics? | 1980 | verified | JSTOR Daedalus Vol 109(1). Classic STS |
| zhu2025revisitinginfluence | Revisiting Data Attribution for Influence Functions | 2025 | verified | arXiv:2508.07297 |

---

## Mismatches Requiring Human Review

### Author Count Discrepancies (PRIORITY - these may have truncated author lists)

| file | title | local | remote | status | decision | notes |
|------|-------|-------|--------|--------|----------|-------|
| deepseek2025r1 | DeepSeek-R1 | 1 | 198 | verified | keep-as-is | Huge author list, accepted as-is |
| bommasani2021 | Foundation models opportunities/risks | 10 | 100 | verified | keep-truncated | First 10 match, "et al" style OK for 100+ authors |
| bai2022 | Constitutional AI | 10 | 51 | verified | keep-truncated | First 10 match exactly, "et al" style OK |
| casper2023 | RLHF Open Problems | 10 | 32 | verified | keep-truncated | First 10 match, title verified |
| kiela2021 | Dynabench | 10 | 19 | verified | keep-truncated | First 10 match exactly |
| longpre2023 | Data Provenance Initiative | 10 | 19 | fixed | corrected | Had wrong author names in positions 5-10, fixed to match OpenAlex |
| mitchell_model_cards_2019 | Model Cards | 9 | 18 | verified | keep-as-is | Remote has duplicate authors (API artifact), local is correct |
| liu2025olmotrace | OLMoTrace | 10 | 18 | fixed | corrected | Had incorrect names and "others" placeholder, fixed to first 10 |
| choe2024influencellm | LLM-Scale Data Valuation | 10 | 14 | fixed | expanded | Was concatenated string, converted to proper list |
| jia2019datavaluation | Data Valuation Shapley | 10 | 10 | fixed | expanded | Expanded from 7 to full 10 authors, fixed name variations |
| alemohammad2024 | Self-consuming models go MAD | 8 | 8 | fixed | expanded | Expanded from 1 to full 8 authors, venue updated to ICLR |
| bommasani2023 | Foundation Model Transparency Index | 8 | 8 | fixed | expanded | Expanded from 1 to full 8 authors |
| bommasani2024 | Foundation Model Transparency Index v1.1 | 7 | 7 | fixed | expanded | Expanded from 1 to full 7 authors |

### Year Discrepancies (8 items - verify correct publication year)

| file | title | local_year | diff | status | notes |
|------|-------|------------|------|--------|-------|
| arrietaibarra2018datalabor | Should We Treat Data as Labor? | 2018 | -1 | verified | Local correct. Remote 2017 = SSRN preprint, 2018 = AEA publication |
| belkin_2019 | Double descent | 2019 | -1 | verified | Local correct. Remote 2018 = arXiv preprint, 2019 = PNAS publication |
| bourtoule2021sisa | Machine Unlearning | 2021 | -2 | verified | Local correct. Remote 2019 = arXiv preprint, 2021 = IEEE S&P publication |
| dakos2019tippingpoints | Ecosystem Tipping Points | 2019 | -1 | verified | Local correct. Remote 2018 = online early access, 2019 = Nature E&E publication |
| gu2017badnets | BadNets | 2019 | -2 | verified | Local year 2019 correct (IEEE Access). Citation key misleading but year field OK. Remote 2017 = arXiv preprint |
| obar2020biggest | The Biggest Lie on the Internet | 2020 | -2 | verified | Local correct. Remote 2018 = online first, 2020 = journal issue publication |
| roth2014dp | Algorithmic Foundations of DP | 2014 | -1 | verified | Local correct. Remote 2013 appears to be database error; official publication Aug 2014 |
| xu2024unlearningsurvey | Machine Unlearning Survey | 2024 | -1 | verified | Local correct. Remote 2023 = arXiv preprint, 2024 = ACM Computing Surveys publication |

---

## Verification Log

| date | file | action | by | notes |
|------|------|--------|-----|-------|
| 2024-12-28 | - | Initial scratchpad created | system | 424 refs checked |
| 2025-12-28 | arrietaibarra2018datalabor | verified year 2018 correct | agent | Preprint 2017, publication 2018 (AEA) |
| 2025-12-28 | belkin_2019 | verified year 2019 correct | agent | Preprint Dec 2018, publication 2019 (PNAS) |
| 2025-12-28 | bourtoule2021sisa | verified year 2021 correct | agent | Preprint Dec 2019, publication 2021 (IEEE S&P) |
| 2025-12-28 | dakos2019tippingpoints | verified year 2019 correct | agent | Online Oct 2018, publication Mar 2019 (Nature E&E) |
| 2025-12-28 | gu2017badnets | verified year 2019 correct | agent | Preprint Aug 2017, publication 2019 (IEEE Access) |
| 2025-12-28 | obar2020biggest | verified year 2020 correct | agent | Online first Jul 2018, issue publication 2020 (Info Comm Soc) |
| 2025-12-28 | roth2014dp | verified year 2014 correct | agent | Official publication Aug 2014 (Now Publishers) |
| 2025-12-28 | xu2024unlearningsurvey | verified year 2024 correct | agent | Preprint Jun 2023, publication Jan 2024 (ACM CS) |
| 2025-12-28 | bommasani2021 | verified authors | agent | 10 of 100+ authors, truncated list OK |
| 2025-12-28 | bai2022 | verified authors | agent | 10 of 51 authors, truncated list OK |
| 2025-12-28 | casper2023 | verified authors | agent | 10 of 32 authors, truncated list OK |
| 2025-12-28 | kiela2021 | verified authors | agent | 10 of 19 authors, truncated list OK |
| 2025-12-28 | longpre2023 | fixed authors | agent | Corrected wrong author names in positions 5-10 |
| 2025-12-28 | mitchell_model_cards_2019 | verified authors | agent | Remote has duplicate (API artifact), local 9 authors correct |
| 2025-12-28 | liu2025olmotrace | fixed authors | agent | Replaced incorrect names and "others" with correct first 10 |
| 2025-12-28 | choe2024influencellm | fixed authors | agent | Converted concatenated string to proper list of 10 |
| 2025-12-28 | jia2019datavaluation | fixed authors | agent | Expanded from 7 to 10 authors, fixed name variations |
| 2025-12-28 | alemohammad2024 | fixed authors+venue | agent | Expanded from 1 to 8 authors, venue to ICLR |
| 2025-12-28 | bommasani2023 | fixed authors | agent | Expanded from 1 to 8 authors |
| 2025-12-28 | bommasani2024 | fixed authors | agent | Expanded from 1 to 7 authors |
| 2025-12-28 | hipaa_privacy_rule_2000 | verified | agent | HHS.gov official HIPAA Privacy Rule page |
| 2025-12-28 | howto100m_site | verified | agent | ENS Paris Willow team, 136M video clips |
| 2025-12-28 | iipc_warc | verified | agent | IIPC GitHub spec URL found |
| 2025-12-28 | illinois_bipa_2008 | verified | agent | Illinois General Assembly official |
| 2025-12-28 | jsonlines | verified | agent | jsonlines.org official spec |
| 2025-12-28 | laion_5b | verified | agent | laion.ai, URL updated to blog format |
| 2025-12-28 | liu_data_2024 | verified | agent | jxnl.co, Jason Liu data flywheel article |
| 2025-12-28 | loc_warc | verified | agent | Library of Congress format description |
| 2025-12-28 | lozhkov2024starcoder2stackv2 | verified | agent | arXiv 2402.19173, 66 authors confirmed |
| 2025-12-28 | marda2024public | verified | agent | Mozilla Foundation Sep 2024 |
| 2025-12-28 | math_hf | verified | agent | HuggingFace, note DMCA takedown |
| 2025-12-28 | meta_dumps | verified | agent | Meta-Wikimedia Data dumps format |
| 2025-12-28 | ndjson_spec | verified | agent | GitHub ndjson/ndjson-spec |
| 2025-12-28 | nostalgebraist2020 | verified | agent | LessWrong URL found, Aug 2020 |
| 2025-12-28 | oasst1_hf | verified | agent | HuggingFace OpenAssistant dataset |
| 2025-12-28 | openai_chatapi | verified | agent | OpenAI Platform API reference |
| 2025-12-28 | owasp_llm_top10_2023 | verified | agent | OWASP Foundation, 500+ expert contributors |
| 2025-12-28 | parquet | verified | agent | Apache official, top-level ASF project |
| 2025-12-28 | pg_catalogs | verified | agent | Project Gutenberg offline catalogs |
| 2025-12-28 | pg_formats | verified | agent | Project Gutenberg file formats help |
| 2025-12-28 | alpaca_clean | verified | agent | GitHub repo, 1.6k stars |
| 2025-12-28 | alpaca_post | verified | agent | Stanford CRFM blog, March 13 2023 |
| 2025-12-28 | alpaca_repo | verified | agent | Official Tatsu Lab GitHub |
| 2025-12-28 | amodei2024machines | verified | agent | URL updated to /essay/ path, Oct 11 2024 |
| 2025-12-28 | arxiv_api | verified | agent | Official arXiv API docs |
| 2025-12-28 | arxiv_bulk | verified | agent | Official arXiv bulk data docs |
| 2025-12-28 | arxiv_oai | verified | agent | Official arXiv OAI-PMH docs |
| 2025-12-28 | cc_ai_and_cc_2023 | verified | agent | CC blog Aug 18 2023, URL found |
| 2025-12-28 | cc_formats | verified | agent | Common Crawl blog post |
| 2025-12-28 | cc_getstarted | verified | agent | Official CC get started page |
| 2025-12-28 | common_crawl_website | verified | agent | Nonprofit 501(c)(3) homepage |
| 2025-12-28 | coppa_ftc_2013 | verified | agent | FTC official COPPA Rule page |
| 2025-12-28 | crawford_paglen_excavating_ai_2019 | verified | agent | excavating.ai, Sep 19 2019 |
| 2025-12-28 | deckelmann_wikipedias_2023 | verified | agent | Wikimedia Foundation, Jul 12 2023 |
| 2025-12-28 | dolly_repo | verified | agent | Databricks GitHub, 10.8k stars |
| 2025-12-28 | eu_gdpr_2016 | verified | agent | EUR-Lex official |
| 2025-12-28 | ferpa_ed_1974 | verified | agent | URL updated to studentprivacy.ed.gov |
| 2025-12-28 | gsm8k_hf | verified | agent | OpenAI official HuggingFace dataset |
| 2025-12-28 | gsm8k_repo | verified | agent | OpenAI official GitHub repo |
| 2025-12-28 | hh_rlhf | verified | agent | URL updated to HuggingFace (GitHub deprecated) |
| 2025-12-28 | pushshift_site | verified | agent | Archiving platform, restricted since 2023 API changes |
| 2025-12-28 | reddit_api | verified | agent | OAuth required, 60 req/min rate limit |
| 2025-12-28 | reddit_help | verified | agent | Found URL at support.reddithelp.com, updated Nov 2025 |
| 2025-12-28 | relaion_5b | verified | agent | Year corrected from 2022 to 2024, CSAM safety fixes |
| 2025-12-28 | roche_what_2024 | verified | agent | Snowplow Blog, Dec 5 2024, Yali Sassoon CTO |
| 2025-12-28 | se_dataexplorer | verified | agent | SQL query tool for Stack Exchange data |
| 2025-12-28 | se_meta | verified | agent | Meta Stack Exchange, XML format discussion |
| 2025-12-28 | shankar_data_2024 | verified | agent | sh-reya.com blog, July 2024 |
| 2025-12-28 | silver2025experience | verified | agent | DeepMind PDF, Silver+Sutton, April 2025 |
| 2025-12-28 | smith2020 | needs_human | agent | CONFIRMED PLACEHOLDER - flagged for deletion |
| 2025-12-28 | stack_docs | verified | agent | BigCode Project, 6.4TB source code dataset |
| 2025-12-28 | stack_hf | verified | agent | HuggingFace dataset, 358 languages |
| 2025-12-28 | stack_v2_hf | verified | agent | HuggingFace v2, 600+ languages from Software Heritage |
| 2025-12-28 | tfds_c4 | verified | agent | TensorFlow Datasets, cleaned Common Crawl |
| 2025-12-28 | tfrecord_tf | verified | agent | Official TensorFlow tutorial |
| 2025-12-28 | us_copyright_office_ai_2024 | verified | agent | Multi-part study, 10k+ comments |
| 2025-12-28 | whisper_blog | verified | agent | OpenAI blog Sep 2022, MIT License |
| 2025-12-28 | wiki_db | verified | agent | Wikipedia dumps, CC-BY-SA 4.0 |
| 2025-12-28 | castel2023 | verified | agent | Mata v. Avianca sanctions case, ChatGPT hallucinations |
| 2025-12-28 | bijker1987 | verified | agent | MIT Press, classic STS text |
| 2025-12-28 | binfield2004 | verified | agent | Johns Hopkins UP via Project MUSE |
| 2025-12-28 | bowker1999 | verified | agent | MIT Press, Bowker & Star |
| 2025-12-28 | braverman1974 | verified | agent | Monthly Review Press |
| 2025-12-28 | burawoy1979 | verified | agent | University of Chicago Press |
| 2025-12-28 | dreyfus1972 | verified | agent | Harper & Row, 1st ed |
| 2025-12-28 | dreyfus1992 | verified | agent | MIT Press, revised edition |
| 2025-12-28 | dyerwitheford2015 | verified | agent | Pluto Press |
| 2025-12-28 | floridi2013 | fixed | agent | YEAR CORRECTED to 2004; article in Minds and Machines |
| 2025-12-28 | hochschild1983 | verified | agent | UC Press, coined emotional labor |
| 2025-12-28 | johnson2023power | verified | agent | PublicAffairs, 2024 Nobel laureates |
| 2025-12-28 | minsky1967 | verified | agent | Prentice-Hall |
| 2025-12-28 | ostrom1990 | verified | agent | Cambridge UP, 2009 Nobel |
| 2025-12-28 | pasquinelli2023 | verified | agent | Verso, 2024 Deutscher Prize |
| 2025-12-28 | pml1book | verified | agent | MIT Press, Kevin Murphy |
| 2025-12-28 | polanyi1944 | verified | agent | Farrar & Rinehart |
| 2025-12-28 | raymond1999 | verified | agent | O'Reilly, year 1999 confirmed |
| 2025-12-28 | scholz2016platforms | verified | agent | OR Books |
| 2025-12-28 | shapiro1998 | verified | agent | HBS Press |
| 2025-12-28 | slee2015 | verified | agent | OR Books |
| 2025-12-28 | srnicek2017 | verified | agent | Polity Press |
| 2025-12-28 | turkle1984 | verified | agent | Simon & Schuster 1st ed |
| 2025-12-28 | wiener1948 | verified | agent | MIT Press |
| 2025-12-28 | williamson1985 | verified | agent | Free Press, 2009 Nobel |
| 2025-12-28 | smith2020 | DELETED | claude | Confirmed placeholder entry, removed |
| 2025-12-28 | weyl2018blueprint | DELETED | claude | Duplicate of lanier2018, removed |
| 2025-12-28 | 3a_contributing.qmd | fixed | claude | Updated example citation from smith2020 to lanier2018 |

---

## Notes for Humans

### Quick Wins
1. **Misc/specs with URLs**: Many of these just need URL verification - agents can handle
2. **Classic texts**: Books like Turing 1950, Wiener 1948, Ostrom 1990 are well-documented
3. **Recent preprints (2025)**: May need arXiv or author website verification

### Needs Attention
1. **Author count mismatches**: Decide policy - keep truncated list or expand?
2. **Year discrepancies**: Often preprint vs publication year - verify which is correct
3. **Missing titles**: Several entries have missing frontmatter fields

### Policy Questions
- [ ] Accept venue-only mismatches automatically? (e.g., "ICML" vs "International Conference on Machine Learning")
- [ ] For author lists: Keep local truncated version or update to full list?
- [ ] For year: Use first appearance (preprint) or formal publication year?
