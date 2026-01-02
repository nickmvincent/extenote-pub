---
# Extenote Tag Taxonomy
#
# This file defines the 2-level tag hierarchy and enables enforcement.
#
# RULES:
# 1. If a file has a specific tag, it MUST also have the corresponding broad tag
# 2. Collections (collection:xyz) are broad tags, public by default
# 3. Broad tags are unprefixed (e.g., "ml-methods") and are NOT collections
# 4. A specific tag can belong to multiple broad tags
#
# ENFORCEMENT:
# - Run taxonomy validation to check all files comply
# - Validation will flag files missing required broad tags

taxonomy:

  # =============================================================================
  # COLLECTIONS (public broad tags)
  # =============================================================================

  collection:data-leverage:
    description: "Data as a source of power and influence"
    specific_tags:
      - data-labor
      - data-poisoning
      - data-strikes
      - data-contribution

  collection:ugc-value:
    description: "User-generated content value in AI systems"
    specific_tags:
      - user-generated-content
      - wikipedia
      - search-engines
      - stackoverflow

  collection:influence-functions:
    description: "Data attribution via influence function methods"
    specific_tags:
      - influence-functions
      - data-attribution
      - tracin

  collection:data-valuation:
    description: "Quantifying the value of training data"
    specific_tags:
      - data-valuation
      - shapley-value
      - data-markets

  collection:data-selection:
    description: "Methods for selecting training data subsets"
    specific_tags:
      - data-selection
      - coreset
      - curriculum-learning

  collection:data-poisoning:
    description: "Adversarial attacks on training data"
    specific_tags:
      - data-poisoning
      - backdoor
      - trojan

  collection:scaling-laws:
    description: "Scaling behavior of ML models"
    specific_tags:
      - scaling-laws
      - chinchilla
      - compute-optimal

  collection:machine-unlearning:
    description: "Removing data from trained models"
    specific_tags:
      - unlearning
      - right-to-be-forgotten
      - sisa

  collection:data-augmentation:
    description: "Training data augmentation techniques"
    specific_tags:
      - data-augmentation
      - mixup
      - curriculum-learning

  collection:causal-inference:
    description: "Causal methods in ML/data analysis"
    specific_tags:
      - causal-inference
      - counterfactual
      - instrumental-variable

  collection:model-collapse:
    description: "Model degradation from synthetic data"
    specific_tags:
      - model-collapse
      - synthetic-data
      - recursive-training

  collection:active-learning:
    description: "Query-based data selection for labeling"
    specific_tags:
      - active-learning
      - query-strategy
      - uncertainty-sampling

  collection:privacy-memorization:
    description: "Privacy risks from model memorization"
    specific_tags:
      - memorization
      - extraction-attack
      - differential-privacy

  collection:fairness-data:
    description: "Data-related fairness concerns"
    specific_tags:
      - datasheets
      - data-documentation
      - representation-bias

  # =============================================================================
  # BROAD TAGS (non-collection broad categories)
  # =============================================================================

  ml-methods:
    description: "Technical machine learning methodology"
    specific_tags:
      - training-dynamics
      - interpretability
      - benchmark
      - adversarial
      - optimization
      - architecture
      - evaluation
      - foundational
      - data-selection
      - coreset
      - curriculum-learning
      - data-augmentation
      - mixup
      - active-learning
      - query-strategy
      - uncertainty-sampling
      - scaling-laws
      - chinchilla
      - compute-optimal
      - influence-functions
      - tracin
      - causal-inference
      - counterfactual
      - instrumental-variable
      - model-collapse
      - synthetic-data
      - recursive-training
      - unlearning
      - sisa

  data-governance:
    description: "Data management, curation, and stewardship"
    specific_tags:
      - data-infrastructure
      - data-valuation
      - data-labor
      - data-attribution
      - data-centric-ai
      - data-quality
      - data-provenance
      - data-contribution
      - datasheets
      - data-documentation
      - representation-bias

  ai-society:
    description: "Social implications and impacts of AI"
    specific_tags:
      - fairness
      - content-ecosystems
      - ai-economics
      - public-perception
      - labor-impacts
      - creator-economy
      - platform-power
      - data-strikes
      - data-markets
      - user-generated-content
      - wikipedia
      - search-engines
      - stackoverflow

  language-models:
    description: "LLM-specific research"
    specific_tags:
      - prompting
      - in-context-learning
      - rlhf
      - instruction-tuning
      - chat-models

  ai-safety:
    description: "Safety, security, and reliability of AI systems"
    specific_tags:
      - adversarial
      - robustness
      - alignment
      - jailbreak
      - red-teaming
      - data-poisoning
      - backdoor
      - trojan
      - model-collapse
      - memorization
      - extraction-attack

  legal-policy:
    description: "Legal frameworks and policy for AI/data"
    specific_tags:
      - regulation
      - copyright
      - scraping-law
      - terms-of-service
      - licensing
      - gdpr
      - ai-act

  privacy:
    description: "Privacy concerns in AI/ML"
    specific_tags:
      - differential-privacy
      - federated-learning
      - anonymization
      - pii
      - consent
      - memorization
      - extraction-attack
      - unlearning
      - right-to-be-forgotten

# =============================================================================
# REVERSE INDEX (auto-generated reference)
# Shows which broad tag(s) each specific tag requires
# =============================================================================
#
# data-labor: [collection:data-leverage, data-governance]
# data-poisoning: [collection:data-leverage, collection:data-poisoning]
# shapley-value: [collection:data-valuation]
# adversarial: [ml-methods, ai-safety]
# fairness: [ai-society]
# regulation: [legal-policy]
# ...
#
# Note: A file with "data-labor" needs EITHER collection:data-leverage OR data-governance
# A file with "adversarial" needs EITHER ml-methods OR ai-safety
# =============================================================================

---

# Tag Taxonomy

This file defines the hierarchical relationship between broad tags and specific tags.

## How it works

1. **Collections** (`collection:xyz`) are public broad tags representing curated paper collections
2. **Broad tags** (e.g., `ml-methods`) are non-collection broad categories
3. **Specific tags** are detailed topic tags that must be paired with their parent broad tag

## Enforcement Rule

If a file has a specific tag, it **must** also have at least one of the corresponding broad tags.

Example: A file tagged with `shapley-value` must also have `collection:data-valuation`.

## Adding new tags

1. If creating a new specific tag, add it under the appropriate broad tag above
2. If none fit, either create a new broad category or use the tag standalone (no enforcement)
3. Tags not listed here are "free tags" with no hierarchy enforcement
