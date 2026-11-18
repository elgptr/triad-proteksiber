import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderLocalAuditAgent,filmFrame,filmScenes,filmDuration} from '../keynote/local-audit-agent.mjs';
test('setup teaches skills, output templates, permissions and local-processing limits',()=>{
 const html=renderLocalAuditAgent({visual:'local-agent-setup'});
 for(const v of ['Skill = how to do the job','Template = what good output looks like','SKILL.md','working-paper.docx','Criterion + source','READ ONLY','tool permissions','local files do not mean offline AI'])assert(html.includes(v),v);
 assert(!html.includes('<iframe'));assert.equal(renderLocalAuditAgent({visual:'unknown'}),null);
});
test('film sequences 11 scenes from a typed prompt through evidence, tool, draft and human gate',()=>{
 assert.equal(filmScenes.length,11);assert.equal(filmFrame(0).prompt,'');assert(filmFrame(2500).prompt.length>0);assert(filmFrame(6000).prompt.endsWith('documents.'));
 assert.equal(filmFrame(6000).scene.file,'skill');assert.equal(filmFrame(11000).scene.file,'template');assert.equal(filmFrame(16000).scene.file,'policy');assert.equal(filmFrame(21000).scene.file,'register');assert.equal(filmFrame(26000).scene.file,'approvals');assert.equal(filmFrame(31000).scene.file,'script');
 assert.equal(filmFrame(31000).checked,0);assert.equal(filmFrame(37000).checked,40);
 assert.equal(filmFrame(41000).paperRows,0);assert.equal(filmFrame(42000).paperRows,1);assert.equal(filmFrame(47500).paperRows,5);
 assert.equal(filmFrame(48000).findingRows,1);assert.equal(filmFrame(54000).findingRows,6);assert.equal(filmFrame(54000).scene.kind,'review');assert(filmFrame(filmDuration).finished);
});
test('seeking backwards restores outputs; bounds and Indonesian prompt remain deterministic',()=>{
 assert.equal(filmFrame(50000).findingRows,3);assert.equal(filmFrame(20000).findingRows,0);assert.equal(filmFrame(-1).time,0);assert.equal(filmFrame(Infinity).time,filmDuration);
 assert(filmFrame(6000,'id').prompt.includes('Jangan ubah dokumen sumber.'));
 const html=renderLocalAuditAgent({visual:'local-agent-flow'});for(const v of ['data-la-seek','data-la-speed','data-la-next','data-la-replay','data-la-pause','data-la-paper','data-la-sheet','data-la-gate','not a live agent run'])assert(html.includes(v),v);
});
