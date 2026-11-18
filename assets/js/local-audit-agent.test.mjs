import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderLocalAuditAgent,installLocalAuditAgent} from '../keynote/local-audit-agent.mjs';
test('audit setup separates evidence, skill, templates and reviewed output',()=>{
 const html=renderLocalAuditAgent({visual:'local-agent-setup'});
 for(const value of ['SKILL.md','working-paper.docx','finding-register.xlsx','READ ONLY','output/drafts/','output/reviewed/','not a product screenshot','does not mean the model runs offline'])assert(html.includes(value),value);
 assert(!html.includes('<iframe'));assert.equal(renderLocalAuditAgent({visual:'unknown'}),null);
});
test('document flow names evidence trace, draft status and human gate; animation can pause',()=>{
 const html=renderLocalAuditAgent({visual:'local-agent-flow'});
 for(const value of ['E02 row 18','Not an issued report','Auditor validates','data-la-pause','data-la-replay','not a measured result'])assert(html.includes(value),value);
 let click;const classes=new Set();const demo={classList:{toggle(c){if(classes.has(c)){classes.delete(c);return false;}classes.add(c);return true;}}};
 const button={closest:()=>demo,hasAttribute:()=>true,setAttribute(k,v){this[k]=v;}};
 installLocalAuditAgent({addEventListener:(_,fn)=>click=fn});click({target:{closest:()=>button}});assert.equal(button['aria-pressed'],'true');assert(classes.has('la-paused'));
 click({target:{closest:()=>button}});assert.equal(button['aria-pressed'],'false');
});
