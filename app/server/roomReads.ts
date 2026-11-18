import {pool} from './db.js';
import {sharedRoom} from './sharedRoom.js';
import {readCache} from './readCache.js';
let identity:Promise<string>|undefined;
export function sharedRoomId(){return identity??=sharedRoom().then(r=>r.id).catch(e=>{identity=undefined;throw e;});}
const snapshot=readCache(async()=>{const id=await sharedRoomId();const r=await pool.query(`SELECT jsonb_build_object('topicLibrary',CASE WHEN data->'topicLibrary' IS NOT NULL THEN jsonb_build_object('revision',data->'topicLibrary'->'revision','liveRevision',data->'topicLibrary'->'liveRevision','activeTopicId',data->'topicLibrary'->'activeTopicId','topics',(SELECT jsonb_agg(t - 'draft') FROM jsonb_array_elements(data->'topicLibrary'->'topics') t WHERE t->>'id'=data->'topicLibrary'->>'activeTopicId')) ELSE NULL END,'content',CASE WHEN data->'content' IS NOT NULL THEN jsonb_build_object('published',data->'content'->'published') ELSE NULL END,'presentation',data->'presentation','resetEpoch',data->'resetEpoch','craRelease',data->'craRelease') AS data FROM seminar_sessions WHERE id=$1`,[id]);return r.rows[0].data;},2000);
export const readPublicRoom=()=>snapshot.read();
export const invalidatePublicRoom=()=>snapshot.clear();
