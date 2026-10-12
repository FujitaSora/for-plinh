import {env} from 'cloudflare:workers';
import {isAdmin,adminCookie,passwordMatches,cookieHeader,sameOrigin} from '../../../lib/admin-auth';
export const dynamic='force-dynamic';
export async function GET(req:Request){return Response.json({admin:await isAdmin(req)},{headers:{'Cache-Control':'no-store'}})}
export async function POST(req:Request){
 if(!sameOrigin(req))return Response.json({error:'Yêu cầu không hợp lệ.'},{status:403});
 if(!env.ADMIN_PASSWORD||env.ADMIN_PASSWORD.length<16)return Response.json({error:'Chưa thiết lập mật khẩu quản trị trên máy chủ.'},{status:503});
 const input=await req.json().catch(()=>null) as {password?:unknown}|null;
 if(typeof input?.password!=='string'||input.password.length>256)return Response.json({error:'Mật khẩu không hợp lệ.'},{status:400});
 if(!await passwordMatches(input.password))return Response.json({error:'Mật khẩu chưa đúng.'},{status:401});
 return Response.json({admin:true},{headers:{'Set-Cookie':cookieHeader(req,await adminCookie(),8*60*60),'Cache-Control':'no-store'}});
}
export async function DELETE(req:Request){if(!sameOrigin(req))return new Response(null,{status:403});return Response.json({admin:false},{headers:{'Set-Cookie':cookieHeader(req,'',0)}})}
