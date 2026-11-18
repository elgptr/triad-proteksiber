import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readCache} from './readCache.js';
test('concurrent viewers share a read; invalidation wins over an in-flight old read',async()=>{
 let resolve!:(v:number)=>void,calls=0;
 const cache=readCache(()=>{calls++;return calls===1?new Promise<number>(r=>resolve=r):Promise.resolve(2);},2000);
 const first=cache.read(),other=cache.read();assert.equal(first,other);assert.equal(calls,1);
 cache.clear();assert.equal(await cache.read(),2);resolve(1);assert.equal(await first,1);assert.equal(await cache.read(),2);assert.equal(calls,2);
});
test('failed reads do not poison later requests',async()=>{
 let calls=0;const cache=readCache(async()=>{if(++calls===1)throw Error('offline');return 'recovered';},2000);
 await assert.rejects(cache.read());assert.equal(await cache.read(),'recovered');
});
test('expired snapshots refresh instead of remaining permanently cached',async()=>{
 let calls=0;const cache=readCache(async()=>++calls,0);
 assert.equal(await cache.read(),1);assert.equal(await cache.read(),2);
});
