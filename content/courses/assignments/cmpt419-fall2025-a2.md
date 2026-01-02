---
type: assignment
title: "Assignment 2: Training Data Influence Analysis"
slug: cmpt419-fall2025-a2
course_slug: cmpt419-fall2025
assignment_number: 2
assignment_type: project
points_possible: 32
weight: 5
description: >
  Analyze training data influence using leave-one-out, group-level influence,
  and Shapley value estimation techniques.
learning_objectives:
  - Implement leave-one-out influence computation
  - Analyze group-level data influence
  - Estimate Shapley values using Monte Carlo methods
  - Understand the relationship between individual and group data contributions
tags:
  - data-valuation
  - shapley-values
  - influence-functions
visibility: public
---

# Assignment 2: Training Data Influence Analysis

**Group Size:** 1-3 students
**AI Use:** Permitted (must disclose)
**Total Points:** 32

## Part 1: Preliminaries (10 marks)

1. Select a classification dataset (UCI recommended)
2. Subsample to ~10,000 rows for computational efficiency
3. Train baseline classifier(s)

**Report requirements:**
- Dataset description with feature/label details
- Train/test split approach
- Classifier choice rationale
- Performance metrics (accuracy, confusion matrix, precision-recall or ROC curve)
- Justified primary metric selection

## Part 2: Brute Force LOO Influence (8 marks)

1. Compute leave-one-out influence for 10 manually/randomly selected training points
2. Report influence scores and observe trends
3. Note any unusual high-influence points

## Part 3: Group-Level Influence (8 marks)

1. Calculate leave-entire-group-out influence for 10 groups of varying sizes
2. Generate plot showing group size versus influence relationship

## Part 4: Shapley Values (6 marks)

1. Implement Truncated Monte Carlo Shapley estimation using 10 permutations maximum
2. Plot distribution of Shapley values across training data
3. Optional: Compare with Part 2 LOO results using additional permutations

## Deliverables

- Code file(s)
- Report PDF
- Groups must include contribution statement
