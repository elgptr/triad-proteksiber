import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {randomBytes,createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url),{Client}=require('pg'),dotenv=require('dotenv');
const root=fileURLToPath(new URL('../../',import.meta.url)),local=path.join(root,'app/.local');
const tables=['workspaces','guest_sessions','seminar_sessions','seminar_participants'];
const quote=s=>'"'+s.replaceAll('"','""')+'"';
const sha=rows=>createHash('sha256').update(JSON.stringify(rows)).digest('hex');
const envPath=path.join(root,'.env.local'),original=await fs.readFile(envPath,'utf8'),env=dotenv.parse(original);
const sourceURL=new URL(env.SOURCE_DATABASE_URL),targetURL=new URL(env.NEON_OWNER_DATABASE_URL||env.DATABASE_URL_UNPOOLED||env.DATABASE_URL);
if(!targetURL.hostname.endsWith('.neon.tech')||targetURL.hostname.includes('-pooler'))throw Error('A direct Neon owner connection is required');
if(!sourceURL.hostname.includes('supabase'))throw Error('Expected Supabase source');
sourceURL.searchParams.set('sslmode','verify-full');sourceURL.searchParams.set('sslrootcert',path.join(root,'app/server/certs/supabase-prod-ca-2021.crt'));
targetURL.searchParams.set('sslmode','verify-full');targetURL.searchParams.delete('sslrootcert');
const source=new Client({connectionString:sourceURL.href,connectionTimeoutMillis:15000}),target=new Client({connectionString:targetURL.href,connectionTimeoutMillis:15000});
let sourceTx=false,targetTx=false;
try{
 await source.connect();await target.connect();
 const present=await target.query("SELECT to_regnamespace('signal') IS NOT NULL AS schema,EXISTS(SELECT FROM pg_roles WHERE rolname='signal_app') AS role");
 if(present.rows[0].schema||present.rows[0].role)throw Error('Target SIGNAL objects already exist; refusing to overwrite');
 await source.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');sourceTx=true;await source.query("SET LOCAL TIME ZONE 'UTC'");
 const found=await source.query("SELECT table_name FROM information_schema.tables WHERE table_schema='signal' AND table_type='BASE TABLE' ORDER BY table_name");
 if(JSON.stringify(found.rows.map(r=>r.table_name))!==JSON.stringify([...tables].sort()))throw Error('Unexpected source tables; review required');
 const snapshot={createdAt:new Date().toISOString(),tables:{}};
 for(const table of tables){const r=await source.query(`SELECT to_jsonb(t) AS row FROM signal.${quote(table)} t ORDER BY to_jsonb(t)::text`);snapshot.tables[table]=r.rows.map(r=>r.row);}
 await source.query('COMMIT');sourceTx=false;
 await fs.mkdir(local,{recursive:true});const stamp=Date.now(),backup=path.join(local,'signal-before-neon-'+stamp+'.json');await fs.writeFile(backup,JSON.stringify(snapshot),{mode:0o600});
 const password=randomBytes(32).toString('hex'),appURL=new URL(targetURL);appURL.username='signal_app';appURL.password=password;
 await fs.writeFile(path.join(local,'neon-app.env'),'DATABASE_URL='+JSON.stringify(appURL.href)+'\nDATABASE_URL_UNPOOLED='+JSON.stringify(appURL.href)+'\nDATABASE_SCHEMA=signal\nDB_POOL_MAX=1\n',{mode:0o600});
 await target.query('BEGIN');targetTx=true;await target.query("SET LOCAL TIME ZONE 'UTC'");
 await target.query(`CREATE ROLE signal_app LOGIN PASSWORD '${password}' NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS CONNECTION LIMIT 3`);
 await target.query('CREATE SCHEMA signal AUTHORIZATION CURRENT_USER');await target.query('REVOKE ALL ON SCHEMA signal FROM PUBLIC');await target.query('SET LOCAL search_path TO signal,pg_catalog');
 let sql=await fs.readFile(path.join(root,'app/server/schema.sql'),'utf8');sql=sql.replace('CREATE POLICY seminar_participant_owner ON seminar_participants USING','CREATE POLICY seminar_participant_owner ON seminar_participants TO signal_app USING');await target.query(sql);
 for(const t of ['workspaces','guest_sessions','seminar_sessions']){await target.query(`ALTER TABLE ${quote(t)} ENABLE ROW LEVEL SECURITY`);await target.query(`CREATE POLICY signal_backend_${t} ON ${quote(t)} TO signal_app USING(true) WITH CHECK(true)`);}
 await target.query('GRANT USAGE ON SCHEMA signal TO signal_app');await target.query('GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA signal TO signal_app');
 const results=[];
 for(const t of tables){for(const row of snapshot.tables[t]){const cols=Object.keys(row);await target.query(`INSERT INTO signal.${quote(t)} (${cols.map(quote).join(',')}) VALUES (${cols.map((_,i)=>'$'+(i+1)).join(',')})`,cols.map(k=>row[k]&&typeof row[k]==='object'?JSON.stringify(row[k]):row[k]));}const r=await target.query(`SELECT to_jsonb(t) AS row FROM signal.${quote(t)} t ORDER BY to_jsonb(t)::text`);if(sha(r.rows.map(r=>r.row))!==sha(snapshot.tables[t]))throw Error('Snapshot verification failed for '+t);results.push({table:t,rows:r.rowCount,sha256:sha(snapshot.tables[t])});}
 await target.query('COMMIT');targetTx=false;
 const app=new Client({connectionString:appURL.href,connectionTimeoutMillis:15000});try{await app.connect();await app.query('BEGIN');await app.query("SET LOCAL search_path TO signal,pg_catalog");await app.query("SELECT set_config('app.workspace_id','00000000-0000-0000-0000-000000000000',true)");const r=await app.query('SELECT count(*)::int AS n FROM seminar_participants');if(r.rows[0].n!==0)throw Error('Participant isolation check failed');const role=await app.query("SELECT rolbypassrls,rolsuper FROM pg_roles WHERE rolname=current_user");if(role.rows[0].rolbypassrls||role.rows[0].rolsuper)throw Error('Unsafe application role');await app.query('ROLLBACK');}finally{await app.end();}
 const replace=(text,key,value)=>{const line=key+'='+JSON.stringify(value);const regex=new RegExp('^'+key+'=.*$','m');return regex.test(text)?text.replace(regex,()=>line):text+'\n'+line+'\n';};
 let updated=replace(original,'NEON_OWNER_DATABASE_URL',targetURL.href);updated=replace(updated,'DATABASE_URL',appURL.href);updated=replace(updated,'DATABASE_URL_UNPOOLED',appURL.href);updated=replace(updated,'DATABASE_SCHEMA','signal');await fs.writeFile(envPath,updated,{mode:0o600});
 await fs.writeFile(path.join(local,'neon-migration-report.json'),JSON.stringify({createdAt:snapshot.createdAt,verified:true,rlsVerified:true,backup:path.basename(backup),tables:results},null,2));console.log(JSON.stringify({copied:true,verified:true,rlsVerified:true,tables:results.map(({table,rows})=>({table,rows})),report:'app/.local/neon-migration-report.json'}));
}catch(e){if(sourceTx)await source.query('ROLLBACK').catch(()=>{});if(targetTx)await target.query('ROLLBACK').catch(()=>{});console.error(JSON.stringify({migrationFailed:true,code:e.code||e.name,reason:typeof e.message==='string'&&!/postgres(?:ql)?:|password|connection string/i.test(e.message)?e.message:'See safe database diagnostics'}));process.exitCode=1;}finally{await source.end().catch(()=>{});await target.end().catch(()=>{});}
