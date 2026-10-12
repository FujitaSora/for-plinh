import { env } from 'cloudflare:workers';
const encoder=new TextEncoder();
const cookieName='love_admin';
async function key(){
 const password=env.ADMIN_PASSWORD;
 if(!password||password.length<16)throw new Error('ADMIN_PASSWORD must contain at least 16 characters');
 return crypto.subtle.importKey('raw',encoder.encode(password),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
}
export async function passwordMatches(input:string){
 if(!env.ADMIN_PASSWORD||env.ADMIN_PASSWORD.length<16)return false;
 const k=await key();const signature=await crypto.subtle.sign('HMAC',k,encoder.encode(env.ADMIN_PASSWORD));
 return crypto.subtle.verify('HMAC',k,signature,encoder.encode(input));
}
export async function adminCookie(){
 const expires=String(Date.now()+8*60*60*1000);
 const sig=await crypto.subtle.sign('HMAC',await key(),encoder.encode(expires));
 return expires+'.'+Array.from(new Uint8Array(sig),b=>b.toString(16).padStart(2,'0')).join('');
}
export async function isAdmin(req:Request){
 const token=req.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='))?.slice(cookieName.length+1);
 if(!token)return false;
 const [expires,sig]=token.split('.');
 if(!/^\d+$/.test(expires)||Number(expires)<Date.now()||Number(expires)>Date.now()+8*60*60*1000||!/^[a-f0-9]{64}$/.test(sig??''))return false;
 try{return await crypto.subtle.verify('HMAC',await key(),new Uint8Array(sig.match(/../g)!.map(s=>parseInt(s,16))),encoder.encode(expires))}catch{return false}
}
export function cookieHeader(req:Request,value:string,maxAge:number){return `${cookieName}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${new URL(req.url).protocol==='https:'?'; Secure':''}`}
export function sameOrigin(req:Request){return req.headers.get('origin')===new URL(req.url).origin}
