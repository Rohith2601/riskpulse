'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { analyze, aggregate } = require('./riskEngine');
const { runStress } = require('./stressTest');
const { rebalance } = require('./rebalancer');
const root = path.join(__dirname, '..');
const readJson = name => JSON.parse(fs.readFileSync(path.join(root, 'data', name), 'utf8'));
const build = () => {
  const signals = [...readJson('news.json'), ...readJson('social.json')].map(analyze);
  const leadSignal = aggregate(signals);
  return { generated_at: new Date().toISOString(), signals, lead_signal: leadSignal, stress_test: runStress(readJson('portfolio.json'), leadSignal), rebalancer: rebalance(signals) };
};
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'application/javascript; charset=utf-8', '.json':'application/json; charset=utf-8' };
function reply(res, code, body, contentType='application/json; charset=utf-8') { res.writeHead(code, {'Content-Type':contentType, 'Cache-Control':'no-store'}); res.end(body); }
http.createServer((req,res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/signals') return reply(res, 200, JSON.stringify(build().signals));
  if (url.pathname === '/api/dashboard') return reply(res, 200, JSON.stringify(build()));
  if (url.pathname === '/api/analyze' && req.method === 'POST') { let body=''; req.on('data', c=>body+=c); return req.on('end',()=> { try { const input=JSON.parse(body); if (!input.text) throw Error('text is required'); reply(res,200,JSON.stringify(analyze({id:'manual',source:input.source === 'social' ? 'social':'news',published_at:new Date().toISOString(),text:input.text}))); } catch(e) { reply(res,400,JSON.stringify({error:e.message})); }}); }
  const safe = url.pathname === '/' ? '/index.html' : url.pathname;
  const file = path.normalize(path.join(root, 'public', safe));
  if (!file.startsWith(path.join(root, 'public')) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return reply(res,404,JSON.stringify({error:'Not found'}));
  reply(res,200,fs.readFileSync(file),types[path.extname(file)] || 'application/octet-stream');
}).listen(process.env.PORT || 3000, () => console.log(`RiskPulse running on http://localhost:${process.env.PORT || 3000}`));
