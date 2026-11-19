import {test} from 'node:test';import assert from 'node:assert/strict';
import {setupCra,materializeCra,craOrganizations,craSuggestion} from '../shared/continuousRisk';
import {finishRiskReview,projectedScore} from '../shared/assurance';
test('both organisations receive four mixed sources across at least three risks, idempotently',()=>{
 assert.equal(craOrganizations.length,2);
 for(const org of craOrganizations){const s=setupCra(org.id,0);materializeCra(s,false);assert.equal(s.data.signals.length,0);materializeCra(s,true);materializeCra(s,true);assert.equal(s.data.signals.length,4);
 const counts=s.data.risks.map(r=>s.data.signals.filter(a=>a.riskIds.includes(r.id)).length);assert.deepEqual(counts,[4,1,1]);assert.deepEqual(s.data.signals.map(a=>a.type),['news','news','internal','audit']);assert(s.data.signals.filter(a=>a.type!=='news').every(a=>a.url?.endsWith('.pdf')));
 const risk=s.data.risks[0],decisions=Object.fromEntries(s.data.signals.map(a=>[a.id,'accept' as const]));const proposal=craSuggestion(risk,s.data.signals);assert.equal(proposal.likelihood*proposal.impact,16);
 const input={riskId:risk.id,revision:0,decisions,likelihood:4,impact:4,reason:'Reviewed all sources.'};assert.throws(()=>finishRiskReview(s.data,input),/response is required/);
 const saved=finishRiskReview(s.data,{...input,mitigation:{title:'Restore approval evidence',description:'Reconcile and test the control.',action:'Reconcile and test the control.',owner:risk.owner,due:'2027-01-30',likelihoodReduction:1,impactReduction:0}});assert.equal(saved.risks[0].mitigations[0].title,'Restore approval evidence');assert.equal(projectedScore(saved.risks[0]),12);assert(saved.signals.every(a=>a.decisions[risk.id]==='accept'));assert(saved.signals.some(a=>a.riskIds.includes('cra-1')&&!a.decisions['cra-1']));assert.equal(s.data.risks[0].revision,0);
 assert.throws(()=>finishRiskReview(saved,input),/assessment changed/);
 }
});
test('every signal must be decided; rejected signals cannot silently change the score',()=>{
 const s=materializeCra(setupCra('exporter',0),true),r=s.data.risks[0];
 const no={riskId:r.id,revision:0,decisions:{},likelihood:4,impact:4,reason:'test'};assert.throws(()=>finishRiskReview(s.data,no),/Decide every signal/);
 const rejected=Object.fromEntries(s.data.signals.map(a=>[a.id,'decline' as const]));assert.throws(()=>finishRiskReview(s.data,{...no,decisions:rejected}),/No accepted signal/);
 const saved=finishRiskReview(s.data,{...no,decisions:rejected,likelihood:r.likelihood,impact:r.impact});assert.equal(saved.risks[0].likelihood*r.impact,12);
});

test('risk owners can document an independent assessment after rejecting every signal',()=>{
 const s=materializeCra(setupCra('exporter',0),true),r=s.data.risks[1];
 const decisions=Object.fromEntries(s.data.signals.filter(a=>a.riskIds.includes(r.id)).map(a=>[a.id,'decline' as const]));
 const saved=finishRiskReview(s.data,{riskId:r.id,revision:0,decisions,likelihood:3,impact:3,reason:'Rejected the report; independent control testing supports this assessment.'},{allowIndependentAssessment:true});
 assert.equal(saved.risks[1].likelihood*saved.risks[1].impact,9);assert.equal(saved.signals.filter(a=>a.riskIds.includes(r.id)&&!a.decisions[r.id]).length,0);
});
