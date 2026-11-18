import {test} from 'node:test';
import assert from 'node:assert/strict';
import {databaseConfig} from './databaseConfig.js';
test('Neon direct connections verify TLS, use signal and discard a foreign CA',()=>{
 const c=databaseConfig({DATABASE_URL:'postgresql://signal_app:example@ep-demo.neon.tech/db?sslmode=disable&sslrootcert=wrong'});
 assert.equal(c.schema,'signal');assert(c.cloud);
 const uri=new URL(c.connectionString!);assert.equal(uri.searchParams.get('sslmode'),'verify-full');assert.equal(uri.searchParams.get('sslrootcert'),null);
});
test('session state prevents pooled Neon connections and cloud public schema',()=>{
 const chosen=databaseConfig({DATABASE_URL:'postgresql://owner:example@ep-demo-pooler.neon.tech/db',DATABASE_URL_UNPOOLED:'postgresql://owner:example@ep-demo.neon.tech/db'});
 assert.equal(new URL(chosen.connectionString!).hostname,'ep-demo.neon.tech');
 assert.throws(()=>databaseConfig({DATABASE_URL:'postgresql://signal_app:example@ep-demo-pooler.neon.tech/db'}),/direct/);
 assert.throws(()=>databaseConfig({DATABASE_URL:'postgresql://signal_app:example@ep-demo.neon.tech/db',DATABASE_SCHEMA:'public'}),/isolated/);
});
test('existing local and Supabase deployment configurations remain supported',()=>{
 assert.equal(databaseConfig({DATABASE_URL:'postgresql://local:example@localhost/db'}).cloud,false);
 const c=databaseConfig({NODE_ENV:'production',DATABASE_SCHEMA:'signal',DATABASE_URL:'postgresql://signal_app:example@db.example.supabase.co/db'});
 assert(new URL(c.connectionString!).searchParams.get('sslrootcert')?.endsWith('supabase-prod-ca-2021.crt'));
});
