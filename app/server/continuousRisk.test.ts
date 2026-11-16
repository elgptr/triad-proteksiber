import {test} from 'node:test';import assert from 'node:assert/strict';
import {setupCra,materializeCra,decideCraNewRisk,craOrganizations} from '../shared/continuousRisk';
import {finishRiskReview,suggestedAssessment,projectedScore} from '../shared/assurance';
test('one released article reassesses an exporter and identifies a missing finance exposure',()=>{
 const a=setupCra('exporter',0),b=setupCra('finance',0);assert.equal(craOrganizations.length,2);for(const s of [a,b]){assert.equal(s.data.risks.length,3);assert.equal(new Set(s.data.risks.map(r=>r.objective)).size,1);materializeCra(s,false);assert.equal(s.data.signals.length,0);}
 materializeCra(a,true);materializeCra(a,true);assert.equal(a.data.signals.length,1);assert.equal(a.data.signals[0].riskIds[0],a.data.risks[0].id);
 materializeCra(b,true);assert.equal(b.data.signals.length,0);decideCraNewRisk(b,'accept');assert.equal(b.data.risks.length,4);assert.equal(b.data.signals.length,1);assert.throws(()=>decideCraNewRisk(b,'accept'));
 const declined=setupCra('finance',0);decideCraNewRisk(declined,'decline');assert.equal(declined.data.risks.length,3);assert.equal(declined.data.signals.length,0);
 const risk=a.data.risks[0],signal=a.data.signals[0],proposal=suggestedAssessment(risk,[signal]);assert.equal(proposal.likelihood*proposal.impact,16);
 const input={riskId:risk.id,revision:0,decisions:{[signal.id]:'accept' as const},likelihood:4,impact:4,reason:'Buyer exposure challenges the margin assumption.'};assert.throws(()=>finishRiskReview(a.data,input),/response is required/);
 const next=finishRiskReview(a.data,{...input,mitigation:{action:'Diversify markets and review buyer commitments',owner:risk.owner,due:'2027-01-30',likelihoodReduction:1,impactReduction:0}});assert.equal(next.risks[0].likelihood*next.risks[0].impact,16);assert.equal(projectedScore(next.risks[0]),12);assert.equal(next.risks[0].mitigations.length,1);assert.equal(a.data.risks[0].revision,0);
});
