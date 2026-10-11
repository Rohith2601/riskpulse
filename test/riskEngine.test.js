'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const { analyze } = require('../src/riskEngine');
const { runStress } = require('../src/stressTest');
test('classifies an adverse geopolitical item', () => { const s=analyze({id:'x',source:'news',published_at:'2026-01-01',text:'War causes a supply disruption, liquidity pressure, and market risk.'}); assert.equal(s.event_classification,'Geopolitical'); assert.ok(s.sentiment_score < 0); assert.ok(s.impact_score > 7); });
test('stress test fires only above threshold', () => { const out=runStress([{notional_m:10,rate_sensitivity:-.02,equity_beta:1,credit_beta:0}],{event_classification:'Geopolitical',impact_score:8}); assert.equal(out.triggered,true); assert.ok(out.after_m < 10); });
