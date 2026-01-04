# Data Licenses Wizard: Technical Research & Questions

This document summarizes technical research on each initiative to inform wizard design. Each section includes technical details, wizard implications, and questions for your feedback.

---

## 1. PREFERENCE SIGNALS (Soft Enforcement)

### 1.1 robots.txt + AI Directives

**What it is:** Using existing robots.txt with AI-specific user-agents (GPTBot, ClaudeBot, etc.)

**Technical implementation:**
```
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: anthropic-ai
Disallow: /
```

**Also:** `X-Robots-Tag` HTTP header for per-response control:
```
X-Robots-Tag: noai, noimageai
```

**Pipeline stage:** Collect only (crawling phase)

**Limitations:**
- Relies on bots self-identifying with correct user-agent
- No enforcement mechanism - purely honor-based
- Doesn't cover training/fine-tuning/retrieval after data is collected
- Many AI companies don't publish user-agent strings

**Questions:**
1. Should we distinguish between "block all AI" vs "block training but allow search citations"?
2. How do we handle the proliferation of AI user-agents? (There are 50+ now)
3. Is this primarily useful for websites only, or also for other content types?

---

### 1.2 Spawning ai.txt

**What it is:** A separate file at `/ai.txt` specifically for AI permissions, read when media is *downloaded* (not crawled)

**Technical implementation:** Unclear from public docs - their API communicates permissions to partners (Hugging Face, Stability AI)

**Key difference from robots.txt:** Focused on *media downloads* not page crawls

**Partners:** Hugging Face, Stability AI

**Status:** WIP - no formal specification published

**Questions:**
1. Do you have the actual ai.txt spec/syntax? The public docs are sparse
2. Is this primarily for image/media datasets rather than text?
3. How does the Spawning API work - do AI companies query it, or does it push to them?
4. Should we track their WordPress plugin as a separate "implementation tool"?

---

### 1.3 IETF AIPref (draft-ietf-aipref-*)

**What it is:** Emerging IETF standard for AI usage preferences

**Two key drafts:**

**A. Vocabulary (draft-ietf-aipref-vocab-05):**
- Defines preference values like `train-ai=y`, `train-ai=n`
- Applies to: training foundation models, fine-tuning

**B. Attachment (draft-ietf-aipref-attach-04):**

**HTTP Header:**
```http
Content-Usage: train-ai=n
```

**robots.txt extension:**
```
User-Agent: *
Content-Usage: train-ai=n
Allow: /

User-Agent: *
Content-Usage: train-ai=y
Allow: /ai-ok/
```

**Pipeline stages:** Collect, train, fine-tune (via vocabulary)

**Status:** Active drafts, not yet RFC

**Questions:**
1. Should the wizard recommend this for forward-looking users even though it's not finalized?
2. The `train-ai` vocabulary seems narrow - are they adding `retrieve`, `summarize`, etc.?
3. How does this interact with RSL and other standards? Are they complementary or competing?

---

### 1.4 TDMRep (W3C)

**What it is:** EU-focused standard for Text and Data Mining reservation (DSM Directive compliance)

**Technical implementation:**

**File:** `/.well-known/tdmrep.json` (JSONL format, ODRL-based)

```json
[
  {
    "location": "https://example.com/",
    "tdm-reservation": 2,
    "tdm-policy": "https://example.com/policies/1"
  }
]
```

**Policy file (ODRL format):**
```json
{
  "@context": ["http://www.w3.org/ns/odrl.jsonld", {"tdm": "http://www.w3.org/ns/tdmrep#"}],
  "@type": "Offer",
  "profile": "http://www.w3.org/ns/tdmrep",
  "uid": "https://example.com/policies/1",
  "permission": [{
    "action": "tdm:mine",
    "constraint": [...],
    "duty": [...]
  }]
}
```

**tdm-reservation values:**
- `0` = no reservation (TDM allowed)
- `1` = reserved, no policy (TDM disallowed)
- `2` = reserved, policy available (conditional)

**Adopters:** 143 of top 250 French websites, Elsevier, Springer Nature, American Chemical Society

**Pipeline stages:** Collect, train (focused on text/data mining)

**Questions:**
1. Is this primarily relevant for EU-based publishers or globally useful?
2. The ODRL format is complex - should the wizard recommend simpler alternatives for non-EU users?
3. Should we note that this is specifically for the DSM Directive opt-out mechanism?

---

### 1.5 Creative Commons CC Signals

**What it is:** Proposed framework for signaling AI usage preferences, emphasizing reciprocity

**Four proposed signals:**
1. Credit
2. Credit + Direct Contribution
3. Credit + Ecosystem Contribution
4. Credit + Open

**Technical format:** Human and machine readable, building on IETF aipref standards

**Status:** Alpha release planned November 2025

**Integration:** Designed to work with RSL and IETF aipref

**Questions:**
1. Since this is pre-alpha, should we include it in wizard recommendations?
2. The focus on "credit" vs "payment" is interesting - does this appeal to a different user segment?
3. How does this differ from just using CC licenses with additional metadata?

---

## 2. FORMAL LICENSES

### 2.1 RSL (Really Simple Licensing)

**What it is:** XML-based machine-readable licensing standard with monetization support

**Technical implementation:**

**File:** `/.well-known/rsl.xml` or linked via HTTP header/HTML

**XML format:**
```xml
<rsl xmlns="https://rslstandard.org/rsl">
  <content url="/">
    <license>
      <permits type="usage">search</permits>
      <prohibits type="usage">train-ai</prohibits>
      <payment type="subscription">
        <amount currency="USD">99.99</amount>
      </payment>
    </license>
  </content>
</rsl>
```

**Usage types in permits/prohibits:**
- `all`, `train-ai`, `train-genai`, `ai-use`, `ai-summarize`, `search`

**Payment types:**
- `subscription`, `purchase`, `royalty`, `attribution`

**HTTP Header:**
```http
Link: <https://example.com/.well-known/rsl.xml>; rel="license"
```

**Enforcement:** Fastly CDN partnership for CDN-level enforcement

**Pipeline stages:** Collect, train, fine-tune, retrieve (comprehensive)

**Questions:**
1. Is RSL the most comprehensive "formal license" option right now?
2. The Fastly partnership is interesting - does this mean technical enforcement, or just faster delivery?
3. How does the OLP (Open License Protocol) OAuth extension work in practice?

---

### 2.2 copyright.sh

**What it is:** "Simple meta tag" for AI licensing

**Technical implementation:** Unclear - their website is minimal. Appears to be a meta tag approach.

**Status:** usable-but-new, "actively onboarding creators"

**Questions:**
1. Do you have more details on their technical implementation?
2. How does this differ from RSL or a simple license declaration?
3. Is this primarily for individual creators vs publishers?

---

## 3. TECHNICAL BLOCKING

### 3.1 Cloudflare AI Crawl Control

**What it is:** Bot detection + blocking + monetization at CDN level

**Features:**
1. **AI Audit:** Analytics showing which AI bots crawl your site
2. **Managed robots.txt:** Cloudflare-managed blocking
3. **Bot Management:** ML-based detection of bots even with spoofed user-agents
4. **Cryptographic verification:** Bots can prove identity
5. **HTTP 402 responses:** "Contact us to license" responses
6. **Pay-per-crawl:** Marketplace (private beta)

**Detection methods:**
- User-agent string matching (free tier)
- ML fingerprinting, behavioral analysis (paid)
- Cryptographic verification (when bots support it)

**Pipeline stages:** Collect (blocking at CDN level)

**Questions:**
1. This requires being on Cloudflare - should we note that as a dependency?
2. The 402 response + pay-per-crawl seems to blur blocking and monetization - how do we categorize?
3. Should "AI Audit" (visibility only) be distinguished from "AI Crawl Control" (blocking)?

---

### 3.2 easy-dataset-share

**What it is:** Anti-scraping tool for datasets

**Technical implementation:** Appears to integrate with Cloudflare

**Status:** usable-but-new, early-stage

**Questions:**
1. Is this a wrapper around Cloudflare, or a standalone tool?
2. Is this specifically for researchers sharing datasets?

---

## 4. TOLLGATES / MONETIZATION

### 4.1 TollBit

**What it is:** Subdomain-based paywall for AI access

**Technical architecture:**

1. **Publisher creates subdomain:** `tollbit.example.com` or `ai.example.com`

2. **CDN edge logic redirects bots:**
   - Detect AI user-agents at CDN (Cloudflare, Fastly, Akamai, AWS WAF)
   - Redirect to TollBit subdomain

3. **TollBit checks authentication:**
   - No valid token → paywall page
   - Valid token → fetch content, deliver markdown-cleaned version

4. **Content transformation:** Returns markdown without nav/social clutter

**Supported CDNs:** Cloudflare, Fastly, Google Cloud Armor, AWS WAF

**Example Cloudflare worker setup:** Checks user-agent, redirects to TollBit subdomain

**Pipeline stages:** Collect (gated crawling), retrieve (for RAG access)

**Questions:**
1. The subdomain approach is clever - but does it require DNS changes?
2. How does pricing work - per-crawl, subscription, or publisher-defined?
3. Is the content "cleaning" (markdown conversion) a key feature or incidental?
4. NLWeb protocol support - is this for agentic AI access?

---

### 4.2 ProRata / Gist

**What it is:** Licensing collective + AI search product with attribution-based revenue share

**How it works:**

1. **Publishers join:** Sign licensing agreement (700+ publishers)
2. **Gist product:** AI-powered search that uses only licensed content
3. **Attribution:** Proprietary algorithm tracks which content contributed to each answer
4. **Revenue share:** 50% to ProRata, 50% split among contributing publishers based on attribution

**Key technical feature:** Attribution bar shows percentage of content from each source

**Gist Answers:** Embeddable AI search for publisher websites (can use own content or network)

**Gist Ads:** Native advertising adjacent to AI responses

**Pipeline stages:** Train (licensed training data), retrieve (for Gist), generate (attribution at output)

**Questions:**
1. Is this primarily for large publishers, or can individual creators join?
2. The attribution algorithm is proprietary - is there any transparency into how it works?
3. Does joining ProRata mean exclusive licensing, or can publishers license elsewhere too?
4. Is Gist the only AI product using their licensed content, or do they license to others?

---

## 5. CERTIFICATION

### 5.1 FairlyTrained

**What it is:** Non-profit certification for AI models trained on licensed data only

**Certification process:**
1. Apply online
2. Written submission proving all training data is licensed
3. Review + potential follow-up questions
4. Annual re-certification

**Criteria:** All training data must be:
- Explicitly provided via contract, OR
- Available under appropriate open license

**NOT accepted:** "Fair use" or similar exceptions as justification

**Fee structure:** Based on company revenue ($150-$500 submission + $500-$6,000 annual)

**Certified companies:** Beatoven.AI, Boomy, BRIA AI, Endel, LifeScore, Rightsify, Somms.ai, Soundful, Tuney, KL3M (first LLM)

**Pipeline stages:** Train, fine-tune (certifies training data practices)

**Questions:**
1. Is this primarily aimed at AI companies, or can publishers use this to find "safe" AI partners?
2. Should the wizard recommend creators *look for* FairlyTrained certified tools?
3. How does transparency work - can anyone verify what training data was used?

---

## 6. NEW INFRASTRUCTURE

### 6.1 OpenMined Attribution-Based Control (ABC)

**What it is:** Decentralized protocol for data control and attribution in AI

**Core concept:** Instead of copying data to AI providers, enable direct communication where attribution and control flow with information

**Technical stack:**
- Federated learning
- Homomorphic encryption
- Blockchain/distributed systems

**Syft Protocol:**
- Decentralized protocol for querying data
- Enforces licensing, pricing, attribution rules in real-time
- Logs every interaction
- Automatic royalty distribution

**SyftBox:**
- Local "datasites" that participate in global AI without data leaving
- Computation runs where data lives
- Explicit permission for any access

**Pipeline stages:** All (collect, train, fine-tune, retrieve, generate) - architectural change

**Questions:**
1. This is the most ambitious technically - is it production-ready or research?
2. How would a publisher actually integrate with this today?
3. Is this more relevant for B2B data providers than individual creators?

---

## WIZARD DESIGN QUESTIONS

Based on this research, I have several high-level questions:

### Categorization

1. **Actions taxonomy:** Current categories are:
   - attach-preference-signal
   - attach-formal-license
   - technical-blocking
   - add-tollgate
   - join-licensing-collective
   - certification
   - new-infrastructures

   Are these the right buckets? Should we split or merge any?

2. **Pipeline stages:** I've assigned stages based on my understanding:
   - `collect` = crawling/scraping phase
   - `train` = pre-training foundation models
   - `fine-tune` = adapting models
   - `retrieve` = RAG, search augmentation
   - `generate` = output/attribution

   Are these assignments correct for each initiative?

### User Personas

3. **Content types matter more than I thought:**
   - Websites → robots.txt, IETF aipref, Cloudflare, TollBit
   - Images/media → ai.txt (Spawning), Cloudflare
   - Datasets → easy-dataset-share, OpenMined
   - Published articles → TDMRep, RSL, ProRata
   - Code → ??? (separate licensing ecosystem)

   Should the wizard give different recommendations based on content type?

4. **Technical capacity varies:**
   - "Just add a file" → robots.txt, ai.txt, TDMRep, RSL
   - "Configure CDN" → Cloudflare, TollBit
   - "Join platform" → ProRata, FairlyTrained
   - "Integrate infrastructure" → OpenMined

   How much should we weight technical complexity?

### Gaps

5. **What's missing?** Are there important initiatives not in the catalog? e.g.:
   - llms.txt (for documentation sites)
   - IPTC photo metadata standards
   - Getty/Shutterstock licensing
   - Music: ContentID, Audible Magic

6. **Verification/evidence:** How do we know if these actually work?
   - TDMRep is adopted by 143/250 French sites
   - ProRata has 700+ publishers
   - But do AI companies actually respect robots.txt, TDMRep, etc.?

### Wizard Flow

7. **Goal-to-action mapping:** My current mappings:
   - "Express preferences" → attach-preference-signal, attach-formal-license
   - "Block scraping" → technical-blocking
   - "Get compensated" → add-tollgate, join-licensing-collective
   - "Track usage" → new-infrastructures, attach-preference-signal
   - "Collective action" → join-licensing-collective, certification
   - "Verify compliance" → certification, new-infrastructures

   Do these mappings make sense?

8. **Layered approaches:** Many users will want multiple tools:
   - robots.txt (free, easy) + RSL (formal) + Cloudflare (enforcement)

   Should the wizard explicitly recommend "stacks" rather than individual tools?

---

## SOURCES

- [Cloudflare AI Crawl Control](https://developers.cloudflare.com/ai-crawl-control/)
- [IETF AIPref WG](https://datatracker.ietf.org/wg/aipref/about/)
- [RSL Specification](https://rslstandard.org/rsl)
- [TDMRep W3C Spec](https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240202/)
- [TollBit Documentation](https://docs.tollbit.com/)
- [ProRata](https://prorata.ai/)
- [FairlyTrained](https://www.fairlytrained.org/)
- [OpenMined ABC](https://openmined.org/attribution-based-control/)
- [CC Signals](https://creativecommons.org/ai-and-the-commons/cc-signals/)
- [Spawning ai.txt](https://site.spawning.ai/spawning-ai-txt)
