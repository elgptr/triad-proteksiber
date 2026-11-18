import {test} from 'node:test';
import assert from 'node:assert/strict';
import {installFullscreenGuide,fullscreenGuide} from '../keynote/fullscreen-guide.mjs';
test('slide guide gives a real fullscreen action and Windows fallback',async()=>{
 assert.match(fullscreenGuide(),/data-enter-fullscreen/);assert.match(fullscreenGuide(),/F11/);assert.match(fullscreenGuide(),/top right/);
 let click,calls=0;const hint={hidden:true};const button={closest:()=>({querySelector:()=>hint})};
 const stage={querySelector:()=>null,addEventListener:(_,fn)=>click=fn};
 const doc={fullscreenElement:null,documentElement:{lang:'en',requestFullscreen:async()=>calls++}};
 installFullscreenGuide(stage,doc);const event={target:{closest:()=>button},preventDefault(){}};
 await click(event);assert.equal(calls,1);
 doc.fullscreenElement={};await click(event);assert.equal(calls,1,'Clicking an entry button while fullscreen should not exit');
 doc.fullscreenElement=null;doc.documentElement.requestFullscreen=async()=>{throw Error('blocked');};await click(event);assert.equal(hint.hidden,false);assert.match(hint.textContent,/F11/);
});
