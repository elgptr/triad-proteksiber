import {auditTopicContent} from '../shared/auditTopic.js';
import {test} from 'node:test';import assert from 'node:assert/strict';
import {topicLibrary,newTopicContent,topicApplication} from '../shared/topics.js';
import {activeSlides,defaultContent} from '../shared/content.js';
test('Beyond Compliance is one complete default topic, including all chapters and SIGNAL',()=>{const library=topicLibrary({});assert.equal(library.topics.length,2);assert.equal(library.activeTopicId,'beyond-compliance');assert.equal(activeSlides(library.topics[0].draft).length,45);assert.equal(topicApplication(library.topics[0].draft).kind,'signal');});
test('legacy draft and published packages migrate without silently publishing edits',()=>{const draft=newTopicContent('Draft');const lib=topicLibrary({content:{draft,published:{revision:5,config:defaultContent}}});assert.equal(lib.liveRevision,5);assert.equal(lib.topics[0].draft.title,'Draft');assert.equal(lib.topics[0].published?.title,'Beyond Compliance');});
test('a new topic starts independently without borrowing the SIGNAL app or slides',()=>{const first=newTopicContent('New topic'),second=newTopicContent('Another topic');first.modules[0].slides[0].body='Changed';assert.equal(second.modules[0].slides[0].body,'');assert.equal(topicApplication(first).kind,'none');assert.equal(activeSlides(first).length,1);});

 test('AI in Audit and Beyond is a separate draft with an audit workspace',()=>{const lib=topicLibrary({});const topic=lib.topics.find(t=>t.id==='ai-audit-beyond')!;assert.equal(topic.published,null);assert.equal(activeSlides(topic.draft).length,activeSlides(auditTopicContent()).length);assert.equal(topicApplication(topic.draft).kind,'audit-suite');assert.equal(lib.activeTopicId,'beyond-compliance');});
 test('adding the built-in topic preserves existing topics, active selection and revisions',()=>{const old={revision:8,liveRevision:3,activeTopicId:'custom',topics:[{id:'custom',title:'Custom',description:'Keep',draft:newTopicContent('Custom'),published:newTopicContent('Custom')}]};const lib=topicLibrary({topicLibrary:old});assert.equal(lib.topics.length,2);assert.equal(lib.activeTopicId,'custom');assert.equal(lib.revision,8);assert.equal(old.topics.length,1);assert.equal(topicLibrary({topicLibrary:lib}).topics.length,2);});

test('the seminar revision updates stored decks without losing custom slides or later admin choices',()=>{
 const old=auditTopicContent();const module=old.modules.find(m=>m.id==='ams')!;
 const parked=module.slides.find(s=>s.key==='aib-annual-planning')!;parked.enabled=true;
 const closing=module.slides.splice(module.slides.findIndex(s=>s.key==='aib-closing'),1)[0];module.slides.push(closing);
 const adoption=old.modules.flatMap(m=>m.slides).find(s=>s.key==='aib-adoption')!;adoption.title='Old adoption statistics';
 old.modules[0].slides.push({key:'my-intro',title:'My intro',body:'Keep this',notes:'Custom notes',enabled:true,layout:'content',tone:'day'});
 const raw={revision:8,liveRevision:3,activeTopicId:'ai-audit-beyond',topics:[{id:'ai-audit-beyond',title:'Keep title',description:'Keep description',draft:old,published:structuredClone(old),applicationRevision:4}]};
 const revised=topicLibrary({topicLibrary:raw}),topic=revised.topics[0],keys=activeSlides(topic.published!).map(s=>s.key);
 assert(!keys.includes('aib-annual-planning'));assert.equal(keys.at(-5),'aib-closing');assert.deepEqual(keys.slice(-4),['aib-sources','aib-research','aib-data-technical-references','aib-agentic-references']);
 assert.equal(activeSlides(topic.draft).find(s=>s.key==='my-intro')?.body,'Keep this');assert.equal(topic.title,'Keep title');assert.equal(topic.applicationRevision,4);assert.equal(revised.revision,8);assert.equal(revised.liveRevision,3);
 assert.equal(parked.enabled,true,'The source database record is not mutated during reads');assert.equal(adoption.title,'Old adoption statistics');
 assert.equal(topic.draft.modules.flatMap(m=>m.slides).find(s=>s.key==='aib-adoption')?.title,'Business analysis turns AI ideas into business value');
 assert.deepEqual(topicLibrary({topicLibrary:revised}),revised,'Repeated reads are idempotent');
 topic.draft.modules.flatMap(m=>m.slides).find(s=>s.key==='aib-annual-planning')!.enabled=true;
 assert.equal(topicLibrary({topicLibrary:revised}).topics[0].draft.modules.flatMap(m=>m.slides).find(s=>s.key==='aib-annual-planning')?.enabled,true,'An explicit later admin edit can re-enable the parked demo');
});
