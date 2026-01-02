---
type: assignment
title: "Assignment 3: Dataset Inspection & Analysis"
slug: cmpt419-fall2025-a3
course_slug: cmpt419-fall2025
assignment_number: 3
assignment_type: project
points_possible: 20
description: >
  Critically inspect and analyze LLM pre-training datasets using datasheets,
  assessment metrics, and napkin math techniques.
learning_objectives:
  - Acquire and sample from large-scale datasets
  - Apply the Datasheets for Datasets framework
  - Develop custom data quality assessment metrics
  - Estimate human labor and economic value of datasets
tags:
  - data-documentation
  - datasheets
  - llm-data
visibility: public
---

# Assignment 3: Dataset Inspection & Analysis

**Submission:** Single notebook-style PDF report

## Part 1: Data Acquisition (4 marks)

1. Obtain 300k tokens from LLM pre-training data (Dolma, RefinedWeb, or equivalent)
2. Document methods and code for sampling
3. Identify and describe a secondary dataset matching your project interests

## Part 2: Datasheets (8 marks)

Answer all Section 3.2 questions from the "Datasheets for Datasets" paper for both datasets.

**Reference:** https://arxiv.org/pdf/1803.09010

## Part 3: Data Assessment (8 marks)

1. Create two tables with 10 observations each
2. Include "assessment column" using a custom metric (e.g., toxicity scores, usefulness rating)
3. Justify your chosen metric
4. Summarize findings in paragraph form

## Part 4: Data Napkin Math

Estimate the following for your project dataset:

1. Human labor hours required to create the dataset
2. Commissioning cost (labor hours × hourly rate)
3. Potential revenue from dataset applications
4. Document all assumptions and reasoning

## Deliverables

- PDF report with embedded code samples
