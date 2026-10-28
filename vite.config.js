import {defineConfig} from 'vite';
import {readFile} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
// Foliate is deliberately vendored as native browser modules, not transformed by Vite.
const nativeBookModules={name:'native-book-modules',configureServer(server){server.middlewares.use(async(req,res,next)=>{const pathname=new URL(req.url,'http://localhost').pathname;if(!pathname.startsWith('/vendor/'))return next();const root=resolve('public/vendor');const file=resolve('public',decodeURIComponent(pathname.slice(1)));if(!file.startsWith(root+sep))return next();try{const bytes=await readFile(file);res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':'text/plain');res.end(bytes);}catch{next();}});}};
export default defineConfig({plugins:[nativeBookModules],server:{allowedHosts:['terminal.local']},build:{chunkSizeWarningLimit:650}});
