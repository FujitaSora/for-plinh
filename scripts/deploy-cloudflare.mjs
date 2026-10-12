import {spawnSync} from 'node:child_process';
const cli='./node_modules/wrangler/bin/wrangler.js';
for(const args of [
 ['d1','migrations','apply','DB','--remote','--config','wrangler.database.json'],
 ['deploy']
]){
 const result=spawnSync(process.execPath,[cli,...args],{stdio:'inherit',env:{...process.env,CI:'true'}});
 if(result.error)throw result.error;
 if(result.status!==0)process.exit(result.status??1);
}
