import {getChatGPTUser} from '../../chatgpt-auth';
import {getDb} from '../../../db';
import {notes} from '../../../db/schema';
import {and,eq,desc} from 'drizzle-orm';
export const dynamic='force-dynamic';
const categories=['Ăn uống','Quà tặng','Hẹn hò','Thói quen','Điều khác'];
async function handle(req:Request){
 try{
 const user=await getChatGPTUser();if(!user)return Response.json({error:'Bạn hãy đăng nhập để mở sổ ghi chú.'},{status:401});
 const db=getDb();const owner=eq(notes.owner,user.userId);
 if(req.method==='GET')return Response.json(await db.select().from(notes).where(owner).orderBy(desc(notes.pinned),desc(notes.created)),{headers:{'Cache-Control':'no-store'}});
 if(req.headers.get('origin')&&req.headers.get('origin')!==new URL(req.url).origin)return Response.json({error:'Yêu cầu không hợp lệ.'},{status:403});
 const raw=await req.json(); if(!raw||typeof raw!=="object")return Response.json({error:"Dữ liệu không hợp lệ"},{status:400}); const x=raw as Record<string,unknown>;
 if(req.method==='DELETE'){if(typeof x.id!=='string')return Response.json({error:'Thiếu ghi chú.'},{status:400});await db.delete(notes).where(and(owner,eq(notes.id,x.id)));return Response.json({ok:true})}
 if(typeof x.title!=='string'||!x.title.trim()||x.title.length>120||typeof x.body!=='string'||x.body.length>4000||(typeof x.category!=="string"||!categories.includes(x.category))||typeof x.pinned!=='boolean')return Response.json({error:'Hãy nhập tiêu đề và chọn nhóm hợp lệ.'},{status:400});
 const values={title:x.title.trim(),body:x.body.trim(),category:x.category,pinned:x.pinned};
 if(req.method==='PUT'){if(typeof x.id!=='string')return Response.json({error:'Thiếu ghi chú.'},{status:400});const rows=await db.update(notes).set(values).where(and(owner,eq(notes.id,x.id))).returning();if(!rows.length)return Response.json({error:'Không tìm thấy ghi chú.'},{status:404});return Response.json(rows[0])}
 const row={...values,id:crypto.randomUUID(),owner:user.userId,created:new Date().toISOString()};await db.insert(notes).values(row);return Response.json(row,{status:201});
 }catch{return Response.json({error:'Chưa lưu được. Bạn thử lại nhé; nội dung đang viết vẫn còn.'},{status:500})}
}
export const GET=handle;export const POST=handle;export const PUT=handle;export const DELETE=handle;

