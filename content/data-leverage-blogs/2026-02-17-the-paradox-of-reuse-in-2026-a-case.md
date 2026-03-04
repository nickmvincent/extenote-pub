---
title: >-
  The Paradox of Reuse in 2026: A Case of Quasi-Enclosure, or "Subsidized Club Goods that Sort of Look Like Public Goods"
subtitle: >-
  How we can understand, and react to, the complicated impacts of AI systems on online communities and knowledge commons
date: '2026-02-17'
slug: the-paradox-of-reuse-in-2026-a-case
type: shared_memo
original_url: 'https://dataleverage.substack.com/p/the-paradox-of-reuse-in-2026-a-case'
visibility: public
author: Nick Vincent
publication: Data Leverage
---

Source: [Data Leverage Substack](https://dataleverage.substack.com/p/the-paradox-of-reuse-in-2026-a-case)

Date Published: February 17, 2026

This post was co-authored with David Pham. This is another relatively long post (and a part one of two).

![](https://substackcdn.com/image/fetch/$s_!audI!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa1890d52-b992-4b45-a743-9d35e75ea8bf_640x480.jpeg)

A dry stone enclosure from geograph. Copyright [Roger McLachlan](https://www.geograph.org.uk/profile/1205) and licensed for [reuse](https://www.geograph.org.uk/reuse.php?id=382118) under this [Creative Commons Licence](http://creativecommons.org/licenses/by-sa/2.0/).

## In a nutshell

- AI capabilities are continuing to improve while online platforms like StackExchange, Wikipedia, and GitHub that produce and sustain volunteer-driven “knowledge commons” are experiencing new challenges (many of which stem from simultaneous loss of human engagement and increased “pollution” of AI engagement).

- Various industries that also produce knowledge goods, such as journalism and research, are facing related challenges.

- It’s important to try to *accurately* capture what’s happening in economic and sociological terms; it’s also important to be able to *succinctly* describe what’s happening in a way that facilitates useful public discourse and policy response.

- There are two different extreme reactions to the impacts on online communities: an anti-StackOverflow take (“good riddance, Claude Code is awesome and it’s fine if these online communities wither away”) and an anti-AI take (“This is a disaster! It’s enclosure, it’s a tragedy of the commons!”)

- This post argues for a middle ground framing: data-dependent agentic LLM systems developed and operated by private organizations are creating a situation that might be described as a “quasi-enclosure” (a term used by Salomé Viljoen in [A Relational Theory of Data Governance](https://yalelawjournal.org/pdf/131.2_Viljoen_1n12myx5.pdf)). Contribution energy that might have otherwise contributed to common pools is being *redirected* such that data ends up in privately-controlled data pools, fuelling “[club goods](https://en.wikipedia.org/wiki/Club_good)” that are being offered back to the public in a heavily subsidized fashion. These club goods still retain a strange kind of detached interaction: people using coding agents do “interact with” and “help” each other through the model weights managed by AI labs.

- The “subsidized club goods” provided by AI labs are also driving some amount of *new* energy that might not otherwise exist (e.g. people who heavily use Claude Code who might never have contributed to Wikipedia). Some of this new energy is possible because the tools are actually useful: they really can fix (some) bugs.

- **The overall flow of value still** ***kind of looks like*** **AI is acting as a public good, but we are actually in a very precarious situation.**

This framing suggests we have several paths forward, and there is a “golden path” upon which all the actors involved can continue to contribute to the health of knowledge ecosystems. On this golden path, AI *does* serve as a force for promoting knowledge commons and does distribute utility widely (spoiler alert: the implications here will be mostly restating previous newsletter posts\!<a href="#footnote-1" id="footnote-anchor-1" class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" target="_self">1</a>)

## Introduction

In January 2026, there was a fresh wave of discourse on AI’s impact on websites like Stack Overflow<a href="#footnote-2" id="footnote-anchor-2" class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" target="_self">2</a>. This debate suggests a need for updated thinking on the “[paradox of reuse](https://dataleverage.substack.com/p/the-paradox-of-reuse-language-models-edition)” (reuse without attribution will actually hurt platforms where information curation happens and therefore hurt AI itself eventually) in light of evidence that AI is obviously still getting better and the [contention](https://x.com/tszzl/status/2011506847036162177) that “AI produces new knowledge every day”.

Why is this debate so important? AI’s impact on Stack Overflow and Wikipedia will have implications that will extend well beyond any particular platform. The bigger questions here really have implications for all knowledge work, both volunteer and professional, because they concern AI’s impact on **incentives for knowledge creation**. While voluntary and professional knowledge work can interact with each other in complex ways (e.g. via conflicts between intrinsic and extrinsic motivation), volunteer communities and professional organizations are likely to face very resonant challenges.

One concern: people will look at the evidence<a href="#footnote-3" id="footnote-anchor-3" class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" target="_self">3</a> that content ecosystems are being negatively impacted while AI capabilities simultaneously improve<a href="#footnote-4" id="footnote-anchor-4" class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" target="_self">4</a>, and conclude therefore that either (a) data from content ecosystems is actually not important for AI progress or (b) data from content ecosystems was kind of important in 2022 but now it’s not a big deal.

Further, they may engage with arguments that frame what’s going on as a kind of [enclosure](https://en.wikipedia.org/wiki/Enclosure) (privatization) and/or [tragedy of the commons](https://en.wikipedia.org/wiki/Tragedy_of_the_commons) (depletion through overuse) and find these arguments at odds with positive outcomes they see before them (e.g., the fact that coding agents seem to be helping lots of people code, perhaps even better than Q&A sites that came before), and dismiss those concerns.

We may benefit from understanding the current situation as a **quasi-enclosure**<a href="#footnote-5" id="footnote-anchor-5" class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" target="_self">5</a>: value is still *tentatively flowing* in a way that looks like a public good, but the situation is precarious. To complete the metaphor, this is a quasi-enclosure because there are effective “fences” (sources of excludability) being “put up” around the pools to which data is flowing (servers where the private coding agent transcripts live), but at the same time there are copies of that data on some user machines and if we assume this data will be used to train models that are released to the public at an affordable rate, the models continue to distribute utility widely.

AI impacts on platforms like StackOverflow and Wikipedia really do represent a kind of commons failure (specifically, harms to a [knowledge commons](https://en.wikipedia.org/wiki/Knowledge_commons)<a href="#footnote-6" id="footnote-anchor-6" class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" target="_self">6</a>). As people substitute their StackOverflow consumption for chatbot or coding agent interactions, it is the case that people are replacing their interactions with commons with use of subsidized [club goods](https://en.wikipedia.org/wiki/Club_good). In this case, AI products are being offered as club goods that were built by processing a commons<a href="#footnote-7" id="footnote-anchor-7" class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" target="_self">7</a> and rely on continual upkeep of data labor from users. This upkeep can come from people contributing to a commons *or* from people using the tools via privatized harnesses. Importantly, subsidized club goods can (1) have their subsidy reduced, (2) be cut off entirely, or (3) redirected any time.

This means that the data labor we generate when we use AI tools really is continuing to benefit other people, just like contributions to StackOverflow data helped other people. However, at any time the situation could change drastically<a href="#footnote-8" id="footnote-anchor-8" class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" target="_self">8</a>. The price to use AI might rise drastically, or the operators who hold this data might decide to more aggressively automate rather than augment people. E.g., once AI hits a certain capability threshold, an AI company might choose to end their \$200/month consumer program and instead offer only \$100,000/month packages aimed at management seeking to fully replace workers.

## Recapping the paradox of re-use

The 2015 [version](https://upload.wikimedia.org/wikipedia/commons/1/19/ICWSM15_Wikimedia_Talk.pdf) of the paradox of reuse story/argument, roughly stated: Google started to add “answer box” entities to search that would quote or re-use Wikipedia without attribution. There was major concern that this would cut off Wikipedia traffic and harm the site. Part of the concern here was that traffic to Wikipedia is important for, in ecological terms, “regenerating” the “stock” of volunteer energy. Traffic also drives donations. In the extreme, with zero traffic, Wikipedia would be negatively impacted.

Some researchers began to [study](https://brenthecht.com/publications/icwsm17_googlewikipedia.pdf) this paradox of reuse. Eventually, Wikipedia launched “[Wikimedia Enterprise](https://meta.wikimedia.org/wiki/Wikimedia_Enterprise)” to try to provide an alternative model – tech companies could financially support peer production in a structured way.

Ultimately, in the search engine context, there was a relatively simple fix to the paradox: just add attribution back in, and maybe even give said attribution a little more design emphasis. Then LLMs came along, and the first batch of LLM products sent things back to square one, because there were no links in these interfaces, and therefore attribution was impossible. Eventually, LLMs also started integrating web search tools (and there are even tools for training data tracing like [OlmoTrace](https://allenai.org/blog/olmotrace)), and we came full circle. LLMs seemed to be mostly replicating the search experience within a chatbot UI, with the same sort of design questions – will they attribute sources prominently, which sources will they select, etc.

While early discussions of the paradox of reuse focused on Wikipedia, the same fundamental relationship between online community platforms and AI/search writ large exists for other volunteer-driven platforms like StackExchange<a href="#footnote-9" id="footnote-anchor-9" class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" target="_self">9</a> as well as professional content organizations (e.g., news websites). Notably, echoing Wikimedia Enterprise, StackExchange does have [an array](https://stackoverflow.blog/2025/12/02/introducing-stack-overflow-ai-assist-a-tool-for-the-modern-developer/) of AI-era initiatives in operation right now.

So, we might take this message away: when new innovations in search and AI impact how attribution works, they often perturb traffic flow to content sites, which may in turn harm those sites. Note that there are two related but distinct causes here: the more general concern that AI systems compete for people’s limited attention, and the *reuse-specific-concern* that AI systems specifically use content from a site to answer a question without attributing that site.

## Are paradox of reuse concerns a form of “crying wolf”?

So, given these claims, shouldn’t AI already be getting worse, right now, because we’ve eroded the knowledge commons that made pretraining possible? If not now, when will it get bad? When will there be some kind of inflection point?

A complete explanation requires an updated model for thinking about AI’s impact on human knowledge production.<a href="#footnote-10" id="footnote-anchor-10" class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" target="_self">10</a> Specifically, we must consider how AI will separately affect:

1.  whether or not humans engage in knowledge production at all,

2.  the quality of knowledge production, and

3.  where the outputs of knowledge production flow.

(We won’t exhaustively specify this “knowledge production model here”).

AI may cause humans to increase or decrease the total amount of time they spend on knowledge tasks. Consider one extreme example: AI gets so good at serving short form content, nobody ever edits Wikipedia ever again. Or consider a more moderate example: chatbot answers are good enough that people never really click links to platforms like Wikipedia and the total number of “editors” in the world drops; or coding agents are good enough that very few new users make an account on Q&A sites. Indeed, this seems close to what’s actually happening. AI may also affect knowledge production because perceived spam or slop (e.g., “[slop PRs](https://www.theregister.com/2026/02/03/github_kill_switch_pull_requests_ai/)”) puts users off.

Separately, AI capability levels will affect the quality of data records that are produced. Consider trying to fix a bug with just a paper manual vs. with StackOverflow vs. with ChatGPT vs. with \$1000 of Claude Code credits. With better tools, one can produce better bug fixes. So total volume could go up or down and quality might vary independently. We also should note that it’s always been the case that peer production has extremely *[concentrated](https://mako.cc/copyrighteous/editor-to-reader-ratios-on-wikipedia) contribution patterns* – a few people contribute a lot, most people don’t contribute at all. Specifically, a few people contribute a lot of volume, and a few people make especially high value contributions.<a href="#footnote-11" id="footnote-anchor-11" class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" target="_self">11</a>

Finally, there is a separate question: where do the outputs from knowledge work end up? After you finish fixing your bug, does the result end up just on your computer? On StackExchange servers and in their public dump? On the servers owned by an AI operator, and in the future training set?

## A Stylized Model of Energy and Capture

In order to further reason about distinct ways that AI will impact knowledge production, it might be useful to introduce a stylized model that captures energy, data, model quality, and so on. We can make some assumptions about contributors and the final destination of their outputs in order to reason about how we AI design choices determine the impacts of different AI systems on knowledge production

For now, let’s collapse the first two factors above (whether humans engage in knowledge production, the quality of that production) into a single concept: “Energy for Knowledge Work and Contribution”, or just “*E”* for energy. The impact of AI on the stock and flow of “E” is mainly dependent on AI capabilities and the design of systems that make those capabilities available to people. When AI can actually help people fix bugs, then the quality of their bug fixing knowledge work goes up.<a href="#footnote-12" id="footnote-anchor-12" class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" target="_self">12</a>

The question of *where* this “E” flows is not that dependent on details about the AI technologies themselves, but rather the choices related to *capturing* these outputs (we’ll call this just “*C”*). Specifically, we’ll abstractly define C as a “commons score”, such that it’s a measure of the percentage of content that is in the commons. A high C means that almost all data resources are in some kind of public domain.

To benefit from our one-letter variables for concisely talking about these relationships, let’s also use *M* to capture the notion of model quality (*M* goes up means models are getting better) and *D* to refer to our abstract dataset. So, contribution energy *E* creates data records *D* which are used to train model *M,* and then *M* is deployed in some kind of system. This system itself directly impacts *E*, and then separately the outputs of *E* end up somewhere. If they end up concentrated C is low, if they end up in public C is high.

- E = **Energy** for knowledge work and contribution. A stock that can rise and fall.

- D = **Dataset** that is produced by knowledge work and contribution.

  - Can be separated in a “stable” component (e.g., English grammar) and an unstable component.<a href="#footnote-13" id="footnote-anchor-13" class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" target="_self">13</a>

- C = **Commons score** for knowledge work outputs. When C is high, outputs of E are more public goods-y. When C is low, they are private goods-y, but access to models might be subsidized

- M = **Model** quality. M goes up means AI is getting better.

We can imagine two identical AI models (same level of M), but one outputs all transcripts to a public data pool and the other accrues transcripts to a private lab training pool. While equivalent in terms of E, D, and M, these could obviously lead to different outcomes in the long run.

Further, certain types of models enable certain *types* of data collection that are otherwise impossible. Coding agents create much richer traces than web-based chatbots. In particular, the ability for models to act in the world (even if just running bash commands and hitting API endpoints from a laptop) massively increases the potential for knowledge production *through* AI use. So we need both an agent-capable model (high M) and a corresponding harness/interface to enable certain types of knowledge.

Considering just variation in E and C framing, we can think through the “2x2 grid of extreme scenarios”:

- Low E, Low C: Atrophy + reliance on narrow labeler pools

- Low E, High C: Deskilling, commons sputters on

- High E, Low C: Everyone empowered, but private organizations control the data pools

- High E, High C: Everyone empowered, outputs accumulate as public goods

Based on what’s happened recently with various model and tool releases, it seems the situation right now is this:

- **Models are still getting better:** it sure seems like M is going up.

- **It seems like contributor energy might even be increasing.** Even though traffic to web platforms is down, it seems people really are shipping products using AI tools, and they’re doing it without StackOverflow! And while many users of StackOverflow were just lurkers, almost every single user of coding agents is creating valuable data (though it may be unused if you’ve opted out of “help improve AI”).

- Even though the outputs aren’t in any kind of commons, they are, **for now, benefiting other humans**. This is because AI labs are subsidizing the public<a href="#footnote-14" id="footnote-anchor-14" class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" target="_self">14</a> right now. They’re losing money on some offerings, offering free tiers, etc. Note: unlike free tier products in the ad economy, free tier users are most likely not contributing that valuable of data and are probably getting the better end of the bargain, for now.

  - This means for now, even though E is flowing from users to private labs instead of to something like a public StackExchange dump, the rest of the public is still benefiting from all this data value because *they’re also using the models*. As long as labs keep aggregating all this valuable data labor and serving it back to people, it still looks like a commons.

Stack Exchange’s data has historically been provided in a way that made it a true public good (though governed by a private company). However, this raw data now offers lower overall raw utility for most users if we compare directly to the AI models (e.g. if we asked users “Would you rather have access to raw SE dumps or a Claude Code account)?

But we can make a strong argument that the current situation is providing more utility to more people than the prior situation. Most obviously, there’s a lot of ideas you can implement now that you could not do 6 months ago.

So, are AI companies enclosing the commons?

We argue: the current situation is best described as a **precarious quasi-enclosure**. From a zoomed out view, AI tools are currently helping people to create more knowledge. And much of this knowledge is still flowing back to the public. But unlike when the knowledge was actually in a public dump, this could end at any time. Any lab could choose to delete all their model weights overnight<a href="#footnote-15" id="footnote-anchor-15" class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" target="_self">15</a>. Or, more likely, AI operators might need to cut back on subsidization and suddenly access to models will become highly pay-walled (this isn’t necessarily a bad thing, but would certainly represent a kind of enclosure).

There certainly is a world in which AI progress contributes broadly to social welfare. But also, there are many disempowerment scenarios in which things seem to be getting better and better until suddenly, they aren’t.

## So what actions does this framing suggest?

We can consider a number of options for reducing the precarity of our situation (these might seem obvious, but are worth restating):

- Get more data into commons by mandating openness, exportability, portability, etc.

  - This can be implemented top down via regulation, internally via lab policy, or bottoms up via user data sharing

- Try to keep AI tools more empowering than disempowering

- Keep subsidies durable (public inference infrastructure)

- Support research on distillation while simultaneously working towards data rules that give both data creator and AI companies control over the use of their outputs

More to come in a Part 2!

<div class="footnote" component-name="FootnoteToDOM">

<a href="#footnote-anchor-1" id="footnote-1" class="footnote-number" contenteditable="false" target="_self">1</a>

<div class="footnote-content">

See Section 5 of this [post](https://dataleverage.substack.com/p/the-coding-agent-data-deal), most of this [post](https://dataleverage.substack.com/p/almost-everybody-including-both-data), and ideas from [here](https://dataleverage.substack.com/p/how-collective-bargaining-for-information).

</div>

</div>

<div class="footnote" component-name="FootnoteToDOM">

<a href="#footnote-anchor-2" id="footnote-2" class="footnote-number" contenteditable="false" target="_self">2</a>

<div class="footnote-content">

See e.g., [tweet](https://x.com/Hesamation/status/2011251156467794250?s=20), [tweet](https://x.com/alexolegimas/status/2011432956984996294), [arbitrary reddit post just to get a sense of how people are engaging on other platforms](http://reddit). See this [blog post](https://www.ybrikman.com/blog/2026/01/21/gen-ai-snake-eating-its-own-tail/) and [discussion](https://news.ycombinator.com/item?id=46709320).

</div>

</div>

<div class="footnote" component-name="FootnoteToDOM">

<a href="#footnote-anchor-3" id="footnote-3" class="footnote-number" contenteditable="false" target="_self">3</a>

<div class="footnote-content">

Examples: Google AI summaries are associated with fewer outbound clicks ([Pew](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/)), Wikimedia reports an 8% decline in human pageviews after improved bot-detection ([Wikimedia](https://diff.wikimedia.org/2025/10/17/new-user-trends-on-wikipedia/)), Stack Overflow questions fell ~78% YoY by late 2025 ([DevClass](https://devclass.com/2026/01/05/dramatic-drop-in-stack-overflow-questions-as-devs-look-elsewhere-for-help/), [raw data](https://data.stackexchange.com/stackoverflow/query/1882534/questions-per-month)), publishers are describing an “end of the traffic era” ([The Guardian](https://www.theguardian.com/media/2026/jan/12/publishers-fear-ai-search-summaries-and-chatbots-mean-end-of-traffic-era)).

</div>

</div>

<div class="footnote" component-name="FootnoteToDOM">

<a href="#footnote-anchor-4" id="footnote-4" class="footnote-number" contenteditable="false" target="_self">4</a>

<div class="footnote-content">

See e.g. measurement [work](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)

</div>

</div>

<div class="footnote" component-name="FootnoteToDOM">

<a href="#footnote-anchor-5" id="footnote-5" class="footnote-number" contenteditable="false" target="_self">5</a>

<div class="footnote-content">

Not a formal term of art in the public goods or club goods literature, but was used by Viljoen on “[A Relational Theory of Data Governance](https://yalelawjournal.org/feature/a-relational-theory-of-data-governance)” and I think is a useful term to apply here

</div>

</div>

<div class="footnote" component-name="FootnoteToDOM">

<a href="#footnote-anchor-6" id="footnote-6" class="footnote-number" contenteditable="false" target="_self">6</a>

<div class="footnote-content">

See e.g. [Hess and Ostrom](https://www.researchgate.net/publication/239919282_Introduction_An_Overview_of_the_Knowledge_Commons)

</div>

</div>

<div class="footnote" component-name="FootnoteToDOM">

<a href="#footnote-anchor-7" id="footnote-7" class="footnote-number" contenteditable="false" target="_self">7</a>

<div class="footnote-content">

Extension [coverage](https://www.cip.org/research/generative-ai-digital-commons) of AI and digital commons from the Collective Intelligence Project

</div>

</div>

<div class="footnote" component-name="FootnoteToDOM">

<a href="#footnote-anchor-8" id="footnote-8" class="footnote-number" contenteditable="false" target="_self">8</a>

<div class="footnote-content">

We are beginning to see increased selective enforcement of Terms of Service.

</div>

</div>

<div class="footnote" component-name="FootnoteToDOM">

<a href="#footnote-anchor-9" id="footnote-9" class="footnote-number" contenteditable="false" target="_self">9</a>

<div class="footnote-content">

And it so happens that (1) Wikipedia and Stack Exchange are the platforms that have seen the most empirical study in the past few years.

</div>

</div>

<div class="footnote" component-name="FootnoteToDOM">

<a href="#footnote-anchor-10" id="footnote-10" class="footnote-number" contenteditable="false" target="_self">10</a>

<div class="footnote-content">

It’s also possible that it’s too soon to see some of the harms from the erosion of online knowledge platforms actually become fully realized. We might just need to wait to see (though IMO ideally we should be intervening in the meantime).

</div>

</div>

<div class="footnote" component-name="FootnoteToDOM">

<a href="#footnote-anchor-11" id="footnote-11" class="footnote-number" contenteditable="false" target="_self">11</a>

<div class="footnote-content">

Many professional knowledge-focused domains operate like this too. I’d argue however that “high value contributions” involve stochasticity (it’s random!), so a large body of participation is critical for producing the diamonds in the rough that provide a lot of the “data value” in any given dataset. Put another way, yes, most ambitious scientific projects fail, but it’s good to have a high volume of them because even the best grantmakers / reviewers can never predict a priori who will be a superstar.

</div>

</div>

<div class="footnote" component-name="FootnoteToDOM">

<a href="#footnote-anchor-12" id="footnote-12" class="footnote-number" contenteditable="false" target="_self">12</a>

<div class="footnote-content">

Whether AI actually leads people to do productive things or just consume “later-regretted infinite content” is a separate UX and policy question, though also dependent on the capability to actually produce such content.

</div>

</div>

<div class="footnote" component-name="FootnoteToDOM">

<a href="#footnote-anchor-13" id="footnote-13" class="footnote-number" contenteditable="false" target="_self">13</a>

<div class="footnote-content">

See <https://dataleverage.substack.com/p/ai-technologies-are-system-maps-and-you-are-a-cartographer>

</div>

</div>

<div class="footnote" component-name="FootnoteToDOM">

<a href="#footnote-anchor-14" id="footnote-14" class="footnote-number" contenteditable="false" target="_self">14</a>

<div class="footnote-content">

In terms of both general pricing for subscription plans, but also via specific programs like free use for students.

</div>

</div>

<div class="footnote" component-name="FootnoteToDOM">

<a href="#footnote-anchor-15" id="footnote-15" class="footnote-number" contenteditable="false" target="_self">15</a>

<div class="footnote-content">

This could be for safety reasons. Or, in some of the bigger lawsuits against AI operators, plaintiffs might even ask for this kind of thing.

</div>

</div>
