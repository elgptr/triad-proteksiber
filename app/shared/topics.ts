import {z} from 'zod';
import {auditTopicContent,auditTopicId} from './auditTopic.js';
import {contentSchema,defaultContent,type ContentConfig} from './content.js';
export const topicInput=z.object({title:z.string().trim().min(1).max(300),description:z.string().max(4000).default(''),config:contentSchema});
export type Topic={id:string;title:string;description:string;draft:ContentConfig;published:ContentConfig|null;publishedDescription?:string;applicationRevision?:number;seminarDeckRevision?:number};
export type TopicLibrary={revision:number;liveRevision:number;activeTopicId:string;topics:Topic[]};
function addLocalAgentExample(library:TopicLibrary){
 const topic=library.topics.find(t=>t.id===auditTopicId);if(!topic)return library;
 const examples=auditTopicContent().modules.flatMap(m=>m.slides).filter(s=>['aib-local-agent-setup','aib-local-agent-flow'].includes(s.key));
 for(const config of [topic.draft,topic.published]){if(!config)continue;const module=config.modules.find(m=>m.slides.some(s=>s.key==='aib-daily-tasks'));if(!module)continue;let anchor='aib-daily-tasks';for(const example of examples){if(!config.modules.some(m=>m.slides.some(s=>s.key===example.key))){const i=module.slides.findIndex(s=>s.key===anchor);module.slides.splice(i+1,0,structuredClone(example));}anchor=example.key;}}
 return library;
}
// Apply the requested built-in deck revision once, preserving custom slides and
// unrelated topic settings. A later admin edit can re-enable the parked demo.
function reviseSeminarDeck(library:TopicLibrary){
 const topic=library.topics.find(t=>t.id===auditTopicId);
 if(!topic||(topic.seminarDeckRevision||0)>=1)return library;
 const defaults=auditTopicContent().modules.flatMap(m=>m.slides);
 const references=new Set(['aib-sources','aib-research','aib-data-technical-references','aib-agentic-references']);
 for(const config of [topic.draft,topic.published]){
  if(!config)continue;
  for(const module of config.modules)for(const slide of module.slides){
   if(slide.layout!=='original')continue;
   if(slide.builtin==='aib-annual-planning')slide.enabled=false;
   if(['aib-adoption','aib-three-signals'].includes(slide.builtin||'')){
    const updated=defaults.find(s=>s.key===slide.builtin);
    if(updated){slide.title=updated.title;slide.notes=updated.notes;}
   }
  }
  const closingModule=config.modules.find(m=>m.slides.some(s=>s.layout==='original'&&s.builtin==='aib-closing'));
  if(closingModule){
   const appendix=config.modules.flatMap(m=>m.slides).filter(s=>s.layout==='original'&&references.has(s.builtin||''));
   for(const module of config.modules)module.slides=module.slides.filter(s=>!appendix.includes(s));
   const after=closingModule.slides.findIndex(s=>s.layout==='original'&&s.builtin==='aib-closing')+1;
   closingModule.slides.splice(after,0,...appendix);
  }
 }
 topic.seminarDeckRevision=1;
 return library;
}
export function topicLibrary(data:any):TopicLibrary{
 if(data.topicLibrary){const library=structuredClone(data.topicLibrary) as TopicLibrary;if(!library.topics.some(t=>t.id===auditTopicId))library.topics.push(auditDraft());const audit=library.topics.find(t=>t.id===auditTopicId);if(audit)for(const config of [audit.draft,audit.published]){if(!config||config.modules.some(m=>m.slides.some(s=>s.key==='aib-hitl-practice')))continue;const module=config.modules.find(m=>m.slides.some(s=>s.key==='aib-human-authority'));const source=auditTopicContent().modules.flatMap(m=>m.slides).find(s=>s.key==='aib-hitl-practice');if(module&&source)module.slides.splice(module.slides.findIndex(s=>s.key==='aib-human-authority')+1,0,structuredClone(source));}return reviseSeminarDeck(addLocalAgentExample(library));}
 const published=data.content?.published?.config||defaultContent;
 return {revision:0,liveRevision:data.content?.published?.revision||0,activeTopicId:'beyond-compliance',topics:[{id:'beyond-compliance',title:'Beyond Compliance',description:'Memaksimalkan Potensi AI dalam Mengawal Strategi dan Risiko Organisasi. Deck lengkap dan aplikasi SIGNAL.',draft:data.content?.draft||published,published},auditDraft()]};
}
export function topicApplication(config:ContentConfig){return config.modules.find(m=>m.enabled&&m.demo.kind!=='none')?.demo||{kind:'none' as const};}
export function newTopicContent(title:string):ContentConfig{return {schemaVersion:1,title,modules:[{id:'opening',title:'Pembukaan',description:'',enabled:true,demo:{kind:'none'},slides:[{key:'cover',title,body:'',notes:'',enabled:true,layout:'title',tone:'day'}]}]};}

function auditDraft():Topic{return {id:auditTopicId,title:"AI in Audit and Beyond",description:"RSM Indonesia: Dena Sucianandika and Teuku Raja Irfan Radarma. AI capability, auditing AI, audit assistance, an assurance workspace and dynamic risk management.",draft:auditTopicContent(),published:null,seminarDeckRevision:1};}
