import app from './src/app.js';
import { env } from './src/config/env.js';
app.listen(env.port,()=>console.log(`SocietyFix API listening at http://localhost:${env.port}`));
