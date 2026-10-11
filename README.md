# RiskPulse — S&P Global & Crisil Campus Hackathon 2026

RiskPulse converts unstructured financial news and social-media posts into an auditable risk signal, then demonstrates two consumers: a tactical mock-index rebalancer (Module A) and a strategic wholesale-portfolio stress test (Module B). The core engine produces the required structured fields: sentiment score, event classification, impact score, confidence, linked entities, and an explanation.

The demo is intentionally self-contained and uses only synthetic/open-style sample data. It has two distinct input streams (`data/news.json` and `data/social.json`), a shared API schema, and a dashboard that makes the downstream decision visible.

## Architecture

```text
News JSON + Social JSON
          │
          ▼
  NLP Risk Engine (rules + transparent scoring)
  sentiment · event class · impact · entities
          │  GET /api/signals
          ├──────────────────┐
          ▼                  ▼
 Module A: index tilt   Module B: portfolio stress test
          │                  │
          └───── Dashboard ──┘
```

## Tech stack

Node.js 18+ with no runtime dependencies, native HTTP API, HTML/CSS/JavaScript dashboard, and JSON demo datasets. The deliberately explainable baseline is appropriate for a short hackathon demo; production scoring can replace the rule-based model with FinBERT and calibrated event models without changing the signal contract.

## Dataset and assumptions

- `data/news.json`: synthetic financial-news-style headlines.
- `data/social.json`: synthetic social posts; treated as lower-credibility inputs.
- `data/portfolio.json`: synthetic wholesale banking portfolio (loans, bonds, equities, derivatives), in USD millions.
- Stress shocks are illustrative, scaled by impact, and are not a calibrated risk model or investment recommendation.

## Quickstart

Requires Node.js 18 or newer.

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000). The API is also available at:

- `GET /api/signals` — individual structured signals
- `GET /api/dashboard` — signals plus Module A and B outputs
- `POST /api/analyze` — analyze `{"text":"...","source":"news"}`

Run the checks with:

```bash
npm test
```

## Key results and domain impact

The seeded geopolitical item produces a high-impact negative signal that crosses the Module B trigger (>7), applies an explainable shock set, and displays the portfolio’s before/after values. The same signal stream changes Module A weights for entities mentioned in the text. This shows how a common, traceable text-to-signal engine can serve trading, risk/ALM, and credit-analysis workflows.

## Submission checklist

- Source code and all demo data are included in this repository.
- Presentation: `docs/RiskPulse_Hackathon_Deck_Updated.pptx`
- Add candidate, college, public-repository, and video details before final submission.
