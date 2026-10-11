'use strict';
const { clamp } = require('./riskEngine');
const UNIVERSE = ['NVDA', 'XOM', 'JPM', 'UNH', 'KRE'];
function rebalance(signals) {
  const base = 1 / UNIVERSE.length;
  const scores = Object.fromEntries(UNIVERSE.map(t => [t, 0]));
  signals.forEach(s => s.entities.forEach(t => { if (t in scores) scores[t] += s.sentiment_score * (s.impact_score / 10); }));
  let raw = UNIVERSE.map(t => ({ ticker: t, score: scores[t], weight: clamp(base * (1 + scores[t] * 0.5), base * 0.5, base * 1.5) }));
  const total = raw.reduce((a,x) => a + x.weight, 0);
  return raw.map(x => ({ ...x, benchmark_weight: Number((base * 100).toFixed(1)), weight: Number((x.weight / total * 100).toFixed(1)), change_pp: Number((x.weight / total * 100 - base * 100).toFixed(1)) }));
}
module.exports = { rebalance };
