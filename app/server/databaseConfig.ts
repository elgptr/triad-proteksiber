import {fileURLToPath} from 'node:url';
export function databaseConfig(env:NodeJS.ProcessEnv){
 let uri=env.DATABASE_URL?new URL(env.DATABASE_URL):undefined;
 if(uri?.hostname.endsWith('.neon.tech')&&env.DATABASE_URL_UNPOOLED){const direct=new URL(env.DATABASE_URL_UNPOOLED);if(!direct.hostname.endsWith('.neon.tech'))throw Error('Neon direct URL must use a Neon endpoint');uri=direct;}
 const neon=!!uri?.hostname.endsWith('.neon.tech');
 const cloud=env.NODE_ENV==='production'||neon;
 const schema=env.DATABASE_SCHEMA||(neon?'signal':'public');
 if(!/^[a-z_][a-z0-9_]*$/.test(schema))throw Error('Invalid database schema');
 if(cloud&&schema!=='signal')throw Error('Cloud requires the isolated signal schema');
 if(cloud&&!uri)throw Error('DATABASE_URL must be configured for SIGNAL');
 if(neon&&uri!.hostname.includes('-pooler'))throw Error('Use the direct Neon connection: this application requires session-level search_path');
 if(cloud){
  uri!.searchParams.set('sslmode','verify-full');
  if(neon)uri!.searchParams.delete('sslrootcert');
  else uri!.searchParams.set('sslrootcert',fileURLToPath(new URL('./certs/supabase-prod-ca-2021.crt',import.meta.url)));
 }
 return {schema,cloud,connectionString:uri?.toString()};
}
