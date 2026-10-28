import {sha256} from '@noble/hashes/sha2.js';
const DB_NAME='dobra-pixel';const VERSION=2;let connection;
const request=r=>new Promise((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
export async function db(){if(connection)return connection;connection=await new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,VERSION);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('books'))r.result.createObjectStore('books',{keyPath:'id'});if(!r.result.objectStoreNames.contains('files'))r.result.createObjectStore('files',{keyPath:'id'});if(!r.result.objectStoreNames.contains('settings'))r.result.createObjectStore('settings');};r.onsuccess=()=>{r.result.onversionchange=()=>{r.result.close();connection=null;};resolve(r.result);};r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('Feche as outras abas do Dobra Pixel e tente novamente.'));});return connection;}
export async function allBooks(){const d=await db();return request(d.transaction('books').objectStore('books').getAll());}
export async function getBook(id){const d=await db();return request(d.transaction('books').objectStore('books').get(id));}
export async function getFile(id){const d=await db();return (await request(d.transaction('files').objectStore('files').get(id)))?.file;}
function done(tx){return new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error||new Error('A gravação foi interrompida.'));tx.onerror=()=>reject(tx.error);});}
export async function addBook(book,file){const d=await db();const tx=d.transaction(['books','files'],'readwrite');const p=done(tx);tx.objectStore('books').add(book);tx.objectStore('files').add({id:book.id,file});await p;}
// Read + patch in one transaction: concurrent page/scroll saves cannot overwrite each other.
export async function patchBook(id,patch){const d=await db();const tx=d.transaction('books','readwrite');const p=done(tx);let updated;const r=tx.objectStore('books').get(id);r.onsuccess=()=>{if(r.result){updated={...r.result,...patch};tx.objectStore('books').put(updated);}};await p;return updated;}
export async function deleteBook(id){const d=await db();const tx=d.transaction(['books','files'],'readwrite');const p=done(tx);tx.objectStore('books').delete(id);tx.objectStore('files').delete(id);await p;}
export async function fingerprint(file){const bytes=new Uint8Array(await file.arrayBuffer());const hash=globalThis.crypto?.subtle?new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)):sha256(bytes);return Array.from(hash,b=>b.toString(16).padStart(2,'0')).join('');}
export async function requestPersistence(){try{return await navigator.storage?.persist?.();}catch{return false;}}

export async function getSetting(key){const d=await db();return request(d.transaction('settings').objectStore('settings').get(key));}
export async function setSetting(key,value){const d=await db();const tx=d.transaction('settings','readwrite');const p=done(tx);tx.objectStore('settings').put(value,key);await p;}
