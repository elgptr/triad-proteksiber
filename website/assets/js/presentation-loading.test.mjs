import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('./presentation-loading.js',import.meta.url),'utf8');
for(const lang of ['en','id'])test(`loading states and module failure recovery (${lang})`,()=>{
 const nodes={button:{},h1:{},'[data-loading-message]':{},'.loading-hint':{}};
 const root={isConnected:true,dataset:{},querySelector:s=>nodes[s]},events={};let reloads=0;
 const window={addEventListener:(name,fn)=>events[name]=fn};
 vm.runInNewContext(source,{document:{getElementById:()=>root},window,location:{search:'?lang='+lang,reload:()=>reloads++},URLSearchParams});
 assert.equal(root.dataset.state,'connecting');assert.equal(nodes.button.hidden,true);
 window.SIGNAL_LOADING.set('waiting');assert.equal(nodes.button.hidden,true);
 window.SIGNAL_LOADING.set('preparing');events.unhandledrejection();assert.equal(root.dataset.state,'error');assert.equal(nodes.button.hidden,false);
 nodes.button.onclick();assert.equal(reloads,1);
 root.isConnected=false;events.error();assert.equal(reloads,1);
 assert(nodes.h1.textContent.includes(lang==='id'?'Presentasi':'presentation'));
});
