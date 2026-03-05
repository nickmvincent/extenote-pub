---
title: Which datasets should we assume are "in all the AI models"?
date: '2025-09-24'
slug: which-datasets-should-we-assume-are-in-models
type: shared_memo
original_url: 'https://dataleverage.substack.com/p/which-datasets-should-we-assume-are'
visibility: public
---
**Source:** [Data Leverage Substack](https://dataleverage.substack.com/p/which-datasets-should-we-assume-are)  
**Date Published:** September 24, 2025

*This is post doesn’t touch on breaking news; the first draft was actually written back in December 2023! However, after sitting on it for a while, I believe the points still hold and this could be of interest for ongoing discussions.*

![](https://substackcdn.com/image/fetch/$s_!c4A0!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb26f8879-6232-4983-8a3b-27094b3bc8d2_250x250.jpeg)

Photograph by [Rama](https://commons.wikimedia.org/wiki/User:Rama), Wikimedia Commons, Cc-by-sa-2.0-fr

Model releases from Apple, Meta, Google and more have all sparked many rounds [of](https://techcrunch.com/2024/07/29/apple-says-it-took-a-responsible-approach-to-training-its-apple-intelligence-models/?guccounter=1) [discussion](https://x.com/JesseDodge/status/1732444597593203111?s=20) about training data. Organizations may share more data details in due time (Google has [expressed interest](https://x.com/JeffDean/status/1732461004901282238)), and some of the more recent technical reports (such as [Apple’s](https://machinelearning.apple.com/research/apple-intelligence-foundation-language-models)) reveal more details than we’ve seen before. However, we’re still mostly in the dark when it comes to specific dataset details for many of the large commercial models (to be sure, there is a growing set of groups/projects with details: [EleutherAI](https://www.eleuther.ai/projects/training-large-language-models)’s many works, [Dolma](https://allenai.org/dolma) from AI2, [FineWeb](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1) from HuggingFace, the [Data Provenance Initiative](https://www.dataprovenance.org/), and more).

There's a cool light bulb moment when studying probability when students learn to think in terms of [complementary events](https://en.wikipedia.org/wiki/Complementary_event). In short: sometimes, the easiest way to determine the probability of an event is to instead figure out the probability *p* that the event *won't occur*, then calculate (*1-p*). For [instance](https://en.wikipedia.org/wiki/Complementary_event#Example_of_the_utility_of_this_concept), to calculate the probability a "1" will show up at least once over 8 die rolls, we can start by thinking about the probability a "1" will never show up.

Of course, this idea isn’t really limited to probability; we similarly might estimate the volume of liquid in a mostly full cup by estimating how much is missing. Intuitively, this is useful because it means we don’t have to do as much [counting](https://math.stackexchange.com/questions/3351186/why-should-i-consider-the-complementary-probability-if-i-can-do-it-directly), and I think the high-level idea has some important connections to the aforementioned data discussions.

I've spent a lot of my research career thinking about data attribution and data’s value. In early work, much ado was made about showing that Wikipedia -- a volunteer created resource -- was crucial to both computing research and [real world](https://doi.org/10.1111/jems.12421) economic outcomes. One motivation for doing this kind of work (say, counting how often Wikipedia shows up in [search engine results](https://dl.acm.org/doi/abs/10.1145/3449078) or is used in [NLP research papers](https://github.com/nickmvincent/UGCValueRoundup/blob/main/wikipedia.md)[)](https://github.com/nickmvincent/UGCValueRoundup/blob/main/wikipedia.md))) is to give Wikipedia some potential bargaining power with other organizations and/or more credit in the public's eye. By giving people and communities who create valuable data credit for their work, we can support sustainable data ecosystems (credit might sometimes mean money, for instance through [Wikimedia Enterprise](https://meta.wikimedia.org/wiki/Wikimedia_Enterprise) which does rely on some assumption of “value delivered”, but it might also just mean attribution that leads to more volunteers, donations, activity, etc.). Another motivation is that documenting data dependencies is *scientifically valuable* so we know how computing systems are trained.

The point that Wikipedia is fuelling AI received a big boost in attention a while back with an [article](https://www.nytimes.com/2023/07/18/magazine/wikipedia-ai-chatgpt.html) in the New York Times magazine (and [The Daily Podcast](https://www.nytimes.com/2023/09/10/podcasts/the-daily/wikipedia-ai.html)) discussing both the history of the computing field's "Wikipedia habit" (which is not necessarily problematic per se, but is certainly a dependency) and what we might do going forward to try and combine the best parts of peer production and AI.

For people in AI, this stuff is not surprising at all. Researchers are familiar with the wide variety of Wikipedia-derived training sets and/or benchmarks (notably, nowadays, Wikipedia content is sometimes filtered out from some training so that it can be kept “clean” for evaluation).

We're now comfortably in the age of "web-scale" AI. That is, a large number of the AI systems currently getting attention -- and providing the "[foundation](https://en.wikipedia.org/wiki/Foundation_model)" for downstream systems -- are pre-trained models that use some \***quality-filtered**\* version of "everything one can get their hands on". It's the whole web, with some careful selection (for instance, using tricks like using Reddit scores as a filter, and filtering Common Crawl based on similarity with a "high quality reference"). These AI systems seem to share a vague, but never quite explicitly stated goal of trying to model almost all token sequences people can produce — barring the sequences that might be produced in under some human-defined *low quality conditions*. Token sequences that fit the “low quality” bill are filtered out, and so it isn’t true to say literally *everything* is in these LLMs.

There are a lot of open opportunities to understand the dependencies between AI systems and digital commons empirically. For instance, I still think do more experiments to understand a simulated "world without Wikipedia" (or a world without Stack Exchange, a world without scientific articles, and so on). Similarly, we should keep striving to improve our data documentation practices so that many of these questions are much easier to answer.

But, I'm starting to think that we're well past a point a point where we should be thinking about data attribution with a *guilty until innocent* approach, something that takes inspiration from the above concept of complements. This means: we should probably start with the assumption that Wikipedia is in everything, unless we have strong reason to believe it's not. The same idea can be applied to other “likely suspects”, like StackExchange or GitHub. At some point, for any data that’s not explicitly in some kind of walled garden (technically or legally), we should also assume the same.

A quick technical note: if we want to produce an estimate of “what portion of training dataset *D* is content from Wikipedia?”, we could frame as a simple enumeration problem (if we have complete labels for the whole dataset, there’s no need to do estimation at all — we’re just counting in that case!) or we could some assumptions about a distribution of model-training behaviors and treat this like parameter estimation. All that being said, I think the comparison to “counting down” rather than up can be conceptually useful (i.e., take the approach that requires the fewest operations).

If we just want to quickly estimate the total prevalence of "Wikipedia-touched models", this is a different problem. In this case, if we're pretty sure that most LLMs use Wikipedia in their training **or evaluation<a href="#footnote-1" id="footnote-anchor-1" class="footnote-anchor" data-component-name="FootnoteAnchorToDOM" target="_self">1</a>** procedures, we can arrive at an estimate more quickly looking for models that explicitly take steps to exclude Wikipedia.

Of course, the word “guilty” in “guilty until proven innocent” may have too negative of a connotation: it's not illegal or morally bad to use Wikipedia to train AI (though it may be illegal or morally bad to use other data sources). Very precisely, we might say, "If a data source seems potentially scrape-able, we should assume it has some influence on models trained on web-scale data", but I think guilty-until-proven-innocent-for-training-data captures this idea somewhat succinctly. And as we settle on a new social contract around expectations for reciprocity, ecosystem maintenance, etc., it might become frowned upon to train on Wikipedia without taking certain other actions.

I think it's also worth noting there's a parallel here with open source software and science. Instead of trying to count the number of quantitative scientific publications that explicitly say they use numpy, we'll probably get a faster and more accurate answer by trying to count the ones that provide evidence that they **don't** use numpy (of course, this is discipline-specific; we might make the same argument about assuming R was used in every paper by default for some fields). For the purposes of trying to credit these ubiquitous resources, at some point we should stop counting up from 0% and start counting **down** from 100%.

From the perspective of someone who just wants to count the prevalence of a certain type of content in datasets, the choice to count up from zero or count down from 100 probably just boils down to whether you think the point estimate is going to be below 50% or not.

Where this argument starts to get interesting is if we think about writing out a full list of “probably widely used” or “obvious no-brainer dataset choices” that we should include on the short-list of datasets that are “most likely in everything, unless otherwise stated”. From the perspective of accurate counting, this would mainly involve making a guess about which datasets appear in most training super sets.

This exercise might be an interesting way to provoke a societal discussion about which datasets *should* be on a such a short-list. Creating that short-list (at scale) can be a powerful exercise in collective intelligence. What are the datasets for which we want to assume “that’s probably in all the models”. Wikipedia and StackExchange may seem like obvious choices, but what else falls into this category?

<div class="footnote" component-name="FootnoteToDOM">

<a href="#footnote-anchor-1" id="footnote-1" class="footnote-number" contenteditable="false" target="_self">1</a>

<div class="footnote-content">

Again, it’s important to note that in some cases, researchers do explicitly filter out Wikipedia content — because it’s so central to popular evaluation datasets. Wikipedia editors still deserve credit for this (and arguably, deserve more credit, the topic of a future post or paper).

</div>

</div>
