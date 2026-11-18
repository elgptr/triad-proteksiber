import dotenv from 'dotenv';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const local=fileURLToPath(new URL('../../.env.local',import.meta.url));
// Explicit test/deployment settings take precedence; never overwrite injected vars.
dotenv.config({path:process.env.DOTENV_CONFIG_PATH||(existsSync(local)?local:'.env'),quiet:true});
