// Serial polling pauses in background tabs/offline and refreshes on return.
// Injected runtime makes lifecycle/concurrency behavior testable without a browser.
export function visiblePoll(read,interval,runtime=globalThis){
 const doc=runtime.document,win=runtime.window||runtime;
 let stopped=false,running=false,timer;
 const visible=()=>doc.visibilityState!=='hidden'&&runtime.navigator?.onLine!==false;
 const clear=()=>{if(timer!==undefined)runtime.clearTimeout(timer);timer=undefined;};
 async function tick(){clear();if(stopped||running||!visible())return;running=true;
  try{await read();}catch{}finally{running=false;if(!stopped&&visible())timer=runtime.setTimeout(tick,interval);}
 }
 const resume=()=>{clear();if(visible())void tick();};
 doc.addEventListener('visibilitychange',resume);win.addEventListener('online',resume);win.addEventListener('offline',resume);void tick();
 return()=>{stopped=true;clear();doc.removeEventListener('visibilitychange',resume);win.removeEventListener('online',resume);win.removeEventListener('offline',resume);};
}
