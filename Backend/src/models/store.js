import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dataFile=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../data/societyfix-store.json');
function load(){try{const v=JSON.parse(fs.readFileSync(dataFile,'utf8'));return {users:v.users||[],complaints:v.complaints||[],notifications:v.notifications||[],history:v.history||[],sessions:new Map(v.sessions||[])};}catch{return {users:[],complaints:[],notifications:[],history:[],sessions:new Map()};}}
export const store=load();let queued=false;
export function persistStore(){if(queued)return;queued=true;setTimeout(()=>{queued=false;try{fs.mkdirSync(path.dirname(dataFile),{recursive:true});const tmp=dataFile+'.tmp';fs.writeFileSync(tmp,JSON.stringify({...store,sessions:[...store.sessions.entries()]},null,2));fs.renameSync(tmp,dataFile);}catch(e){console.error('Could not persist SocietyFix data:',e.message);}},10);}
export function resetStore(){store.users.length=0;store.complaints.length=0;store.notifications.length=0;store.history.length=0;store.sessions.clear();persistStore();}
