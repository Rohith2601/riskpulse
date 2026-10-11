# Updated deck notes

The updated deck is kept within the required seven-slide limit. It accurately describes this implementation:

1. RiskPulse title and the three output fields.
2. Problem, two sources, and the shared risk-engine approach.
3. Architecture: JSON replay sources → Node API/risk engine → dashboard/API → modules A and B.
4. Implementation: transparent lexical sentiment, event rules, credibility weighting, impact formula, stress scenario and rebalancing guardrails.
5. Demo results: live dashboard outputs calculated from `data/` rather than fixed claims.
6. Domain impact and explainability.
7. Limitations and next steps: replace rules with FinBERT, calibrate impact with event studies, use real approved feeds.

The source deck had a Python/FastAPI/FinBERT tech-stack slide. The updated version labels those as future production upgrades and describes the actual dependency-free Node prototype.
