const loadModule=path=>import(/* @vite-ignore */path);
import * as pdfjs from 'pdfjs-dist';
import workerURL from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {fileKind} from './model.js';
pdfjs.GlobalWorkerOptions.workerSrc=workerURL;
export const openPDF = async file => {
 const task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,cMapUrl:'/pdfjs/cmaps/',cMapPacked:true,standardFontDataUrl:'/pdfjs/standard_fonts/',wasmUrl:'/pdfjs/wasm/'});
 task.onPassword=()=>task.destroy();
 try{return await task.promise;}catch(e){if(/destroy/i.test(e.message))throw new Error('PDF protegido por senha.');throw e;}
};
export async function pdfCover(pdf){const page=await pdf.getPage(1);const vp=page.getViewport({scale:1});const viewport=page.getViewport({scale:360/vp.width});const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);await page.render({canvas,canvasContext:canvas.getContext('2d'),viewport}).promise;const url=canvas.toDataURL('image/jpeg',.85);canvas.width=canvas.height=0;page.cleanup();return url;}
export async function mobiBook(file){
 const head=new DataView(await file.slice(0,86).arrayBuffer());
 if(head.byteLength<86)throw new Error('Invalid AZW3 header');
 const offset=head.getUint32(78);const palm=new DataView(await file.slice(offset,offset+16).arrayBuffer());
 if(palm.byteLength<16)throw new Error('Invalid AZW3 header');
 if(palm.getUint16(12)!==0)throw new Error('Livro protegido por DRM.');
 const {MOBI,isMOBI}=await loadModule('/vendor/foliate/mobi.js');
 if(!await isMOBI(file))throw new Error('Invalid AZW3 format');
 const {unzlibSync}=await loadModule('/vendor/foliate/vendor/fflate.js');
 return new MOBI({unzlib:unzlibSync}).open(file);
}
const metadataText=value=>typeof value==='string'?value:Array.isArray(value)?value.map(metadataText).join(', '):value?.name||Object.values(value||{})[0]||'';
const imageData=async blob=>{if(!blob?.size)return null;const url=URL.createObjectURL(blob);try{const image=new Image();image.src=url;await image.decode();const scale=Math.min(1,360/image.width);const canvas=document.createElement('canvas');canvas.width=image.width*scale;canvas.height=image.height*scale;canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/jpeg',.85);}finally{URL.revokeObjectURL(url);}};
export async function inspectBook(file){const format=fileKind(file.name);const fallback=file.name.replace(/\.(pdf|azw3)$/i,'').replace(/_/g,' ');if(format==='pdf'){const pdf=await openPDF(file);try{const {info}=await pdf.getMetadata().catch(()=>({info:{}}));return {title:info.Title?.trim()||fallback,author:info.Author?.trim()||'Autor não informado',total:pdf.numPages,cover:await pdfCover(pdf),format};}finally{await pdf.destroy();}}const book=await mobiBook(file);try{return {title:metadataText(book.metadata?.title)||fallback,author:metadataText(book.metadata?.author)||'Autor não informado',total:book.sections.length,cover:await imageData(await book.getCover?.()).catch(()=>null),format};}finally{book.destroy?.();}}
// Book HTML stays untrusted: remove active content before the renderer loads a section.
export function safeBook(book){const urls=new Set();for(const section of book.sections){const original=section.load.bind(section);let cached;section.load=async()=>{if(cached)return cached;const raw=await original();const html=await (await fetch(raw)).text();const doc=new DOMParser().parseFromString(html,'text/html');doc.querySelectorAll('script,iframe,object,embed,base,form,meta[http-equiv],link[rel="import"],svg foreignObject').forEach(el=>el.remove());for(const el of doc.querySelectorAll('*')){for(const attr of Array.from(el.attributes)){if(/^on/i.test(attr.name)||['srcdoc','formaction'].includes(attr.name)||(['href','src','xlink:href'].includes(attr.name)&&/^\s*(?:javascript:|vbscript:|https?:|\/\/)/i.test(attr.value)))el.removeAttribute(attr.name);}}cached=URL.createObjectURL(new Blob(['<!doctype html>'+doc.documentElement.outerHTML],{type:'text/html'}));urls.add(cached);return cached;};}return {book,cleanup:()=>{urls.forEach(URL.revokeObjectURL);book.destroy?.();}};}
