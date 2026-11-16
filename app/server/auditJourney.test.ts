import {test} from 'node:test';
import assert from 'node:assert/strict';
import {startJourney,advanceJourney,addJourneySource,planningFactors,journeyReport,proposedCriteria} from '../shared/auditJourney';
import {recommendPlan,finishRiskReview,suggestedAssessment,projectedScore} from '../shared/assurance';
for(const org of ['exporter','finance'])test('connected audit journey: '+org,()=>{
 let j=startJourney(org);assert.equal(j.data.risks.length,5);assert.equal(new Set(j.data.risks.map(r=>r.objective)).size,1);
 assert.throws(()=>addJourneySource(j,'news'));
 j=advanceJourney(j);assert.throws(()=>advanceJourney(j),/planning decision/);
 j.data.selected=recommendPlan(j.data).selected;j.planningReason='Prioritise material exposure, stale coverage and strategic importance within capacity.';
 assert.throws(()=>advanceJourney(j),/criterion/);
 j.criteria.push({id:'custom',title:'Local requirement',text:'Investigate material exceptions.',origin:'Board policy, section 4',approved:false});j.criteria=j.criteria.map(c=>({...c,approved:true}));
 j=advanceJourney(j);assert.equal(j.stage,2);assert.equal(j.data.planApproved,true);assert.throws(()=>advanceJourney(j),/Assign an auditor/);
 j.auditor='Participant';j.finding='8 of 40 references are missing from this evidence pack.';j.limitation='Approval may be held elsewhere.';j.response='Reconcile files and monitor independent approval.';j.evidenceReviewed=true;
 j=advanceJourney(j);assert.equal(j.stage,3);assert(journeyReport(j).includes('Local requirement'));assert.equal(j.data.signals.length,0);
 assert.throws(()=>advanceJourney({...j,evidenceReviewed:false}),/Validate/);
 j=advanceJourney(j);assert.equal(j.stage,4);assert.equal(j.data.signals.length,1);assert.equal(j.data.signals[0].type,'audit');assert.deepEqual(j.data.signals[0].riskIds,['j-risk-0']);
 j=addJourneySource(addJourneySource(j,'internal'),'news');assert.equal(j.data.signals.length,3);assert.equal(addJourneySource(j,'news').data.signals.length,3);
 const r=j.data.risks[0],pending=j.data.signals.filter(s=>s.riskIds.includes(r.id)),decisions=Object.fromEntries(pending.map(s=>[s.id,'accept' as const]));const score=suggestedAssessment(r,pending);assert.equal(score.likelihood*score.impact,16);
 assert.throws(()=>finishRiskReview(j.data,{riskId:r.id,revision:0,decisions,...score,reason:'Accepted relevant evidence.'}),/response is required/);
 const prior=planningFactors(j)[0].priority;
 j.data=finishRiskReview(j.data,{riskId:r.id,revision:0,decisions,...score,reason:'Accepted relevant evidence.',mitigation:{action:'Reconcile and enforce independent approval.',owner:r.owner,due:'2027-06-30',likelihoodReduction:1,impactReduction:0}});
 assert.equal(j.data.risks[0].likelihood*j.data.risks[0].impact,16);assert.equal(projectedScore(j.data.risks[0]),12);assert(planningFactors(j)[0].priority>prior);
 assert.equal(startJourney(org).data.signals.length,0,'A fresh participant does not share decisions.');
});
test('declined sources preserve exposure; criteria follow selected audit theme',()=>{
 const j=startJourney('exporter');j.reportIssued=true;const withSignal=addJourneySource(j,'news');const r=withSignal.data.risks[0];const next=finishRiskReview(withSignal.data,{riskId:r.id,revision:0,decisions:{'journey-news':'decline'},likelihood:r.likelihood,impact:r.impact,reason:'No confirmed exposure for this event.'});assert.equal(next.risks[0].likelihood,3);assert.equal(next.risks[0].mitigations.length,0);assert(proposedCriteria('exporter',4)[0].text.includes('authorised recipients'));
});
