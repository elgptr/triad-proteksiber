import './loadEnvironment.js';
import {databaseConfig} from './databaseConfig.js';
import pg from 'pg';
import {readFile} from 'node:fs/promises';
const {schema,cloud,connectionString}=databaseConfig(process.env);
// signal_app has a role-wide limit of three connections. Reserve capacity for
// Render's overlapping old/new processes and deployment health checks.
const requestedPoolMax=Number(process.env.DB_POOL_MAX||1);
const poolMax=process.env.NODE_ENV==='production'?1:requestedPoolMax;
const rawPool=new pg.Pool({connectionString,max:poolMax,connectionTimeoutMillis:15000,idleTimeoutMillis:5000});
rawPool.on('error',error=>console.error('Idle database connection failed:',error.name));
// Set an explicit, non-public search path before handing out every connection.
// Production uses Supabase's session pooler; no session can fall back to Atlas public tables.
const initialized=new WeakSet<pg.PoolClient>();
export const pool={
 async connect(){const client=await rawPool.connect();try{if(!initialized.has(client)){const check=await client.query("SELECT set_config('search_path',$1,false),current_user AS db_user",[schema+',pg_catalog']);if(cloud&&check.rows[0].db_user!=='signal_app')throw Error('Cloud requires the restricted signal_app role; provision and migrate before starting the app');initialized.add(client);}return client;}catch(e){client.release();throw e;}},
 async query<T extends pg.QueryResultRow=any>(sql:string,values?:any[]){const client=await this.connect();try{return await client.query<T>(sql,values);}finally{client.release();}},
 end:()=>rawPool.end()
};
export async function migrate(){
 if(cloud){
  // Cloud bootstrap is reviewed separately; never auto-migrate a shared Supabase project.
  const check=await pool.query("SELECT to_regclass('signal.workspaces') AS workspaces,to_regclass('signal.seminar_participants') AS participants");
  if(!check.rows[0].workspaces||!check.rows[0].participants)throw Error('The isolated SIGNAL schema is not provisioned');
  return;
 }
 await pool.query(await readFile(new URL('./schema.sql',import.meta.url),'utf8'));
}
export async function tenant<T>(workspace:string,fn:(client:pg.PoolClient)=>Promise<T>){const c=await pool.connect();try{await c.query('BEGIN');await c.query("SELECT set_config('app.workspace_id',$1,true)",[workspace]);const result=await fn(c);await c.query('COMMIT');return result;}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}}
