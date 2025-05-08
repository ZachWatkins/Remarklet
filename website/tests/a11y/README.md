# Accessibility Testing

This directory contains automated accessibility tests for the Remarklet website.

## Overview

These tests use [axe-core](https://github.com/dequelabs/axe-core) with Playwright to check the website for accessibility violations against WCAG 2.0 and 2.1 standards (Level A and AA).

## Running the Tests

You can run the accessibility tests locally with:

```bash
npm run test:a11y
```

## Test Details

The tests:

1. Discover pages from the sitemap (if available)
2. Run axe-core on each discovered page
3. Generate detailed reports for any violations
4. Save violations to JSON files for further analysis

## GitHub Actions Integration

These tests run automatically:

- After each successful GitHub Pages deployment
- On a daily schedule (midnight UTC)
- Manually via the Actions tab

If violations are found, the workflow:

- Creates a detailed HTML report
- Creates or updates a GitHub Issue with the violations
- Uploads the test artifacts for inspection

## Compliance Targets

The tests check for compliance with:

- WCAG 2.0 Level A
- WCAG 2.0 Level AA
- WCAG 2.1 Level A
- WCAG 2.1 Level AA

## Interpreting Results

For each violation, the report includes:

- Impact level (critical, serious, moderate, minor)
- Detailed description of the issue
- HTML element causing the violation
- Link to more information about how to fix the issue
