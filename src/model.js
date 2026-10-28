export const clamp = (n,min,max) => Math.min(max,Math.max(min,Number(n)||0));
export const percent = book => book.status === 'read' ? 100 : Math.min(99,Math.max(0,Math.round((book.progress||0)*100)));
export const statusLabel = book => ({new:'Não iniciado',reading:'Lendo',read:'Lido'})[book.status]||'Não iniciado';
export const normalize = s => String(s||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
export function selectBooks(books,filter='all',query='',sort='recent') {
 const q=normalize(query);
 const list=books.filter(b=>(filter==='all'||b.status===filter)&&(normalize(b.title+' '+b.author).includes(q)));
 return list.sort(sort==='title'?(a,b)=>a.title.localeCompare(b.title,'pt-BR'):sort==='progress'?(a,b)=>percent(b)-percent(a):(a,b)=>(b.lastRead||b.addedAt)-(a.lastRead||a.addedAt));
}
export function pdfPosition(page,total) {const current=clamp(page,1,total);return {page:current,progress:total>1?(current-1)/(total-1):0};}
export function fileKind(name) {const ext=name.split('.').pop().toLowerCase();if(!['pdf','azw3'].includes(ext))throw new Error('Escolha um arquivo PDF ou AZW3.');return ext;}
export function friendlyError(error) {
 const msg=String(error?.message||error);
 if(/quota|storage|disk/i.test(msg)||error?.name==='QuotaExceededError')return 'Não há espaço disponível neste navegador. Remova um livro ou libere espaço e tente novamente.';
 if(/password|senha|encrypted|encryption|DRM/i.test(msg))return 'Este livro está protegido por senha ou DRM. Use uma cópia sem proteção que você tenha autorização para ler.';
 if(/invalid|corrupt|format|header|not found|record/i.test(msg))return 'Não foi possível ler este arquivo. Ele pode estar incompleto ou em um formato incompatível.';
 return msg||'Não foi possível abrir o livro. Tente importar o arquivo novamente.';
}
