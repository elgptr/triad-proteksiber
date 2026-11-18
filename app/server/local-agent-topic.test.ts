import {test} from 'node:test';
import assert from 'node:assert/strict';
import {topicLibrary} from '../shared/topics.js';
test('stored topics gain the local-agent example after daily tasks without replacing edits or duplicating slides',()=>{
 const lib=topicLibrary({});const topic=lib.topics.find(t=>t.id==='ai-audit-beyond')!;
 topic.draft.modules.forEach(m=>m.slides=m.slides.filter(s=>!s.key.startsWith('aib-local-agent-')));
 topic.published=structuredClone(topic.draft);topic.published.title='Edited seminar';
 const upgraded=topicLibrary({topicLibrary:lib});const saved=upgraded.topics.find(t=>t.id===topic.id)!;
 assert.equal(saved.published!.title,'Edited seminar');
 const keys=saved.published!.modules.flatMap(m=>m.slides.map(s=>s.key)),i=keys.indexOf('aib-daily-tasks');
 assert.deepEqual(keys.slice(i,i+4),['aib-daily-tasks','aib-local-agent-setup','aib-local-agent-flow','aib-confidential-work']);
 assert.deepEqual(topicLibrary({topicLibrary:upgraded}),upgraded);
});
