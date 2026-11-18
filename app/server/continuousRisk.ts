import {readPublicRoom,sharedRoomId,invalidatePublicRoom} from './roomReads.js';
import {Router,type Request,type Response,type NextFunction} from 'express';
import {z} from 'zod';
import {pool,tenant} from './db.js';
import {sharedRoom} from './sharedRoom.js';
import {requireAdmin} from './adminAuth.js';
import {publishedContent} from './content.js';
import {freshParticipant} from '../shared/workshop.js';
import {craOrganizations,craNewRisk,craSignal,setupCra,materializeCra,decideCraNewRisk,type CraState} from '../shared/continuousRisk.js';
import {finishRiskReview} from '../shared/assurance.js';
export const continuousRisk=Router();
async function transact(workspace:string,fn:(state:CraState|undefined,release:any)=>any){const room={id:await sharedRoomId(),data:await readPublicRoom()};if(publishedContent(room.data).application?.kind!=='audit-suite')throw Error('The active topic does not use the assurance workspace.');return tenant(workspace,async db=>{
 const session=(await db.query("SELECT jsonb_build_object('resetEpoch',data->'resetEpoch','craRelease',data->'craRelease') AS data FROM seminar_sessions WHERE id=$1 FOR SHARE",[room.id])).rows[0].data;
 const epoch=session.resetEpoch||0,release=session.craRelease?.epoch===epoch?session.craRelease:{epoch,released:false,revision:0};
 if(!(await db.query('SELECT 1 FROM seminar_participants WHERE session_id=$1 AND workspace_id=$2',[room.id,workspace])).rowCount)await db.query('INSERT INTO seminar_participants(session_id,workspace_id,data) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',[room.id,workspace,freshParticipant()]);
 const row=(await db.query('SELECT data FROM seminar_participants WHERE session_id=$1 AND workspace_id=$2 FOR UPDATE',[room.id,workspace])).rows[0];
 let state=row.data.cra as CraState|undefined;if(state?.epoch!==epoch)state=undefined;const before=JSON.stringify(state);if(state)materializeCra(state,release.released);
 let result:any;try{result=fn(state,release);}catch(error){throw Object.assign(error as Error,{craDecision:true});}state=result.state??state;if(state&&JSON.stringify(state)!==before)await db.query("UPDATE seminar_participants SET data=jsonb_set(data,'{cra}',$1::jsonb),updated_at=now() WHERE session_id=$2 AND workspace_id=$3",[JSON.stringify(state),room.id,workspace]);
 return {state,release,organizations:craOrganizations,newRisk:state?.organizationId==='finance'&&release.released&&!state.newRiskDecision?{...craNewRisk,signal:craSignal('finance',craNewRisk.id)}:null};
 });}
continuousRisk.get('/cra/state',async(_req,res)=>res.json(await transact(res.locals.workspace.id,()=>({}))));
continuousRisk.post('/cra/setup',async(req,res)=>{const input=z.object({organizationId:z.enum(['exporter','finance']),epoch:z.number().int()}).parse(req.body);res.json(await transact(res.locals.workspace.id,(s,r)=>{if(input.epoch!==r.epoch)throw Error('The exercise was reset. Refresh and choose again.');if(s)throw Error('This workspace already has an organisation.');return {state:materializeCra(setupCra(input.organizationId,r.epoch),r.released)};}));});
continuousRisk.post('/cra/new-risk',async(req,res)=>{const input=z.object({decision:z.enum(['accept','decline']),epoch:z.number().int()}).parse(req.body);res.json(await transact(res.locals.workspace.id,(s,r)=>{if(!s||!r.released||s.epoch!==input.epoch)throw Error('No current signal is available.');return {state:decideCraNewRisk(s,input.decision)};}));});
const mitigation=z.object({action:z.string().trim().min(1).max(6000),owner:z.string().trim().min(1).max(200),due:z.string().max(20),likelihoodReduction:z.number().min(0).max(4),impactReduction:z.number().min(0).max(4)});
continuousRisk.post('/cra/respond',async(req,res)=>{const input=z.object({epoch:z.number().int(),riskId:z.string(),revision:z.number().int(),decisions:z.record(z.string(),z.enum(['accept','decline'])),likelihood:z.number().min(1).max(5),impact:z.number().min(1).max(5),reason:z.string().trim().min(1).max(6000),mitigation:mitigation.optional()}).parse(req.body);res.json(await transact(res.locals.workspace.id,(s,r)=>{if(!s||s.epoch!==input.epoch||!r.released)throw Error('No current signal is available.');return {state:{...s,data:finishRiskReview(s.data,input)}};}));});
continuousRisk.get('/admin/cra',requireAdmin,async(_req,res)=>{const room={data:await readPublicRoom()};const epoch=room.data.resetEpoch||0;res.json({release:room.data.craRelease?.epoch===epoch?room.data.craRelease:{epoch,released:false,revision:0}});});
continuousRisk.post('/admin/cra/release',requireAdmin,async(req,res)=>{const input=z.object({epoch:z.number().int(),revision:z.number().int()}).parse(req.body);const room=await sharedRoom();if(publishedContent(room.data).application?.kind!=='audit-suite')return res.status(409).json({error:'Activate the assurance topic first.'});const release={epoch:input.epoch,released:true,revision:input.revision+1,at:new Date().toISOString()};const result=await pool.query("UPDATE seminar_sessions SET data=jsonb_set(data,'{craRelease}',$1::jsonb) WHERE id=$2 AND COALESCE((data->>'resetEpoch')::int,0)=$3 AND (CASE WHEN (data->'craRelease'->>'epoch')::int=$3 THEN COALESCE((data->'craRelease'->>'revision')::int,0) ELSE 0 END)=$4",[JSON.stringify(release),room.id,input.epoch,room.data.craRelease?.epoch===input.epoch?input.revision:0]);if(!result.rowCount)return res.status(409).json({error:'The exercise changed. Refresh its controls.'});invalidatePublicRoom();res.json({release});});

continuousRisk.use((error:any,_req:Request,res:Response,next:NextFunction)=>{if(error?.craDecision)return res.status(409).json({error:error.message});next(error);});
