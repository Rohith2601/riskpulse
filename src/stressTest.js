'use strict';
const { clamp } = require('./riskEngine');
const SCENARIOS = {
  Geopolitical: { equity: -0.10, rates: 0.02, credit: -0.045, label: 'Risk-off: equities −10%, rates +200 bps, credit spread shock' },
  'Credit Event': { equity: -0.07, rates: 0.01, credit: -0.07, label: 'Credit shock: equities −7%, rates +100 bps, spread stress' },
  Macroeconomic: { equity: -0.08, rates: 0.015, credit: -0.035, label: 'Macro slowdown: equities −8%, rates +150 bps' },
  'Merger/Acquisition': { equity: 0.02, rates: 0, credit: -0.005, label: 'Deal-specific scenario: modest equity uplift' },
  'Product Launch': { equity: 0.03, rates: 0, credit: 0, label: 'Product catalyst: targeted equity uplift' },
  Other: { equity: -0.02, rates: 0.005, credit: -0.01, label: 'Conservative general-risk scenario' }
};
function runStress(portfolio, signal) {
  const shock = SCENARIOS[signal.event_classification] || SCENARIOS.Other;
  const scale = signal.impact_score / 10;
  const positions = portfolio.map(p => {
    const pnl = p.notional_m * (p.equity_beta * shock.equity + p.rate_sensitivity * (shock.rates * 100) + p.credit_beta * shock.credit) * scale;
    return { ...p, stressed_value_m: Number((p.notional_m + pnl).toFixed(2)), pnl_m: Number(pnl.toFixed(2)) };
  });
  const before_m = positions.reduce((a,p) => a + p.notional_m, 0);
  const after_m = positions.reduce((a,p) => a + p.stressed_value_m, 0);
  return { triggered: signal.impact_score > 7, threshold: 7, scenario: shock.label, severity: signal.impact_score, before_m, after_m: Number(after_m.toFixed(2)), loss_m: Number((after_m - before_m).toFixed(2)), loss_pct: Number(((after_m / before_m - 1) * 100).toFixed(2)), positions };
}
module.exports = { runStress, SCENARIOS };
