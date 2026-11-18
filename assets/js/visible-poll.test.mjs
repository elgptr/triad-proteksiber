import {test} from 'node:test';
import assert from 'node:assert/strict';
import {visiblePoll} from './visible-poll.mjs';
const flush=()=>new Promise(r=>setImmediate(r));
function runtime(){const doc=new EventTarget(),win=new EventTarget(),timers=new Map();doc.visibilityState='visible';let id=0;return {document:doc,window:win,navigator:{onLine:true},setTimeout(fn){timers.set(++id,fn);return id;},clearTimeout(i){timers.delete(i);},timers};}
test('polls pause while hidden/offline and immediately refresh on return; cleanup removes listeners',async()=>{
 const r=runtime();r.document.visibilityState='hidden';let calls=0;const stop=visiblePoll(async()=>calls++,1000,r);
 assert.equal(calls,0);r.document.visibilityState='visible';r.document.dispatchEvent(new Event('visibilitychange'));await flush();assert.equal(calls,1);assert.equal(r.timers.size,1);
 r.navigator.onLine=false;r.window.dispatchEvent(new Event('offline'));assert.equal(r.timers.size,0);
 r.navigator.onLine=true;r.window.dispatchEvent(new Event('online'));await flush();assert.equal(calls,2);
 stop();assert.equal(r.timers.size,0);r.document.dispatchEvent(new Event('visibilitychange'));assert.equal(calls,2);
});
test('visibility changes cannot overlap slow requests or restart a stopped poll',async()=>{
 const r=runtime();let calls=0,resolve;const stop=visiblePoll(()=>{calls++;return new Promise(r=>resolve=r);},1000,r);
 r.document.dispatchEvent(new Event('visibilitychange'));r.window.dispatchEvent(new Event('online'));assert.equal(calls,1);
 stop();resolve();await flush();assert.equal(r.timers.size,0);
});
