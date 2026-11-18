// A bounded shared snapshot: concurrent viewers share one DB read. A generation
// prevents a read started before a committed write from repopulating stale data.
export function readCache<T>(load:()=>Promise<T>,ttl:number){
 let pending:Promise<T>|undefined,until=0,generation=0;
 return {clear(){generation++;pending=undefined;until=0;},read(){
  if(pending&&Date.now()<until)return pending;
  const current=generation;until=Infinity;
  const request=load().then(value=>{if(generation===current&&pending===request)until=Date.now()+ttl;return value;}).catch(error=>{if(generation===current&&pending===request){pending=undefined;until=0;}throw error;});
  pending=request;return request;
 }};
}
