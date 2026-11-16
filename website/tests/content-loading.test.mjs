import {test} from 'node:test';import assert from 'node:assert/strict';
import {loadContentSnapshot} from '../assets/keynote/content-modules.mjs';
test('cold-start timeouts retry the active topic instead of returning the default deck',async()=>{
 const old={window:globalThis.window,location:globalThis.location,fetch:globalThis.fetch};try{
 globalThis.window={SIGNAL_HOSTING:{apiOrigin:'https://service.example'}};globalThis.location={search:''};let calls=0,retries=0;
 globalThis.fetch=async()=>{calls++;if(calls<3)throw Error('Cold start');return {ok:true,json:async()=>({revision:5,topicId:'ai-audit-beyond',config:{modules:[]}})}};
 const result=await loadContentSnapshot({wait:async()=>{},onRetry:()=>retries++});assert.equal(result.topicId,'ai-audit-beyond');assert.equal(calls,3);assert.equal(retries,2);
 globalThis.fetch=async()=>({ok:false,status:404});await assert.rejects(loadContentSnapshot({attempts:1,wait:async()=>{}}));
 globalThis.fetch=async()=>({ok:true,json:async()=>({})});await assert.rejects(loadContentSnapshot({attempts:1}));
 }finally{Object.assign(globalThis,old);}
});
