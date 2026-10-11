'use strict';

const EVENT_RULES = [
  ['Geopolitical', ['war', 'sanction', 'shipping disruption', 'middle east', 'conflict', 'supply disruption'], 8.5],
  ['Credit Event', ['default', 'downgrade', 'liquidity', 'loan defaults', 'credit risk'], 8],
  ['Merger/Acquisition', ['acquisition', 'merger', 'takeover', 'deal'], 5],
  ['Product Launch', ['unveils', 'launch', 'platform', 'product'], 4],
  ['Macroeconomic', ['inflation', 'interest rate', 'recession', 'gdp', 'jobs'], 7]
];
const POSITIVE = ['strong', 'surge', 'positive', 'growth', 'up', 'demand', 'synergies', 'constructive', 'catalyst', 'lifts'];
const NEGATIVE = ['disruption', 'risk', 'default', 'cuts', 'pressure', 'worsening', 'downgrade', 'nervous', 'war', 'liquidity'];
const TICKERS = { 'nvidia': 'NVDA', 'exxon': 'XOM', 'exxon mobil': 'XOM', 'jpmorgan': 'JPM', 'major banks': 'JPM', 'healthcare': 'UNH', 'lender': 'KRE', 'bank': 'KRE' };

function occurrences(text, words) {
  return words.reduce((n, word) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\ /g, '\\s+');
    return n + (new RegExp(`\\b${escaped}\\b`, 'g').test(text) ? 1 : 0);
  }, 0);
}
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

function analyze(item) {
  const text = item.text.toLowerCase();
  const event = EVENT_RULES.find(([, words]) => occurrences(text, words) > 0) || ['Other', [], 3];
  const pos = occurrences(text, POSITIVE), neg = occurrences(text, NEGATIVE);
  const sentiment = Number(clamp((pos - neg) / Math.max(3, pos + neg), -1, 1).toFixed(2));
  const credibility = item.source === 'news' ? 0.9 : 0.62;
  const velocity = item.source === 'social' ? 0.35 : 0.2;
  const impact = Number(clamp(event[2] * (0.5 + 0.5 * Math.abs(sentiment)) * (0.7 + 0.3 * credibility) * (1 + 0.5 * velocity), 1, 10).toFixed(1));
  const entities = [...new Set(Object.entries(TICKERS).filter(([name]) => text.includes(name)).map(([, ticker]) => ticker).concat((item.text.match(/\$[A-Z]{1,5}\b/g) || []).map(x => x.slice(1))))];
  return { signal_id: `sig-${item.id}`, source: item.source, source_item_id: item.id, published_at: item.published_at, text: item.text, sentiment_score: sentiment, event_classification: event[0], impact_score: impact, confidence: Number((0.55 + credibility * 0.3 + Math.min(pos + neg, 4) * 0.04).toFixed(2)), entities, explanation: `${event[0]} keywords; ${pos} positive and ${neg} negative cues; ${item.source} credibility ${credibility}.` };
}
function aggregate(signals) { return [...signals].sort((a,b) => b.impact_score - a.impact_score || a.sentiment_score - b.sentiment_score)[0]; }
module.exports = { analyze, aggregate, clamp };
