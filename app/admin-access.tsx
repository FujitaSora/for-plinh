'use client';
import {useEffect,useRef,useState} from 'react';
export default function AdminAccess({onChange}:{onChange:(value:boolean)=>void}){
 const [admin,setAdmin]=useState(false),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);const modal=useRef<HTMLDialogElement>(null);
 function update(value:boolean){setAdmin(value);onChange(value)}
 useEffect(()=>{fetch('/api/admin',{cache:'no-store'}).then(r=>r.json()).then((x:any)=>update(x.admin===true)).catch(()=>update(false))},[]);
 async function login(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');try{const r=await fetch('/api/admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});const x:any=await r.json();if(!r.ok)throw Error(x.error);update(true);setPassword('');modal.current?.close()}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 async function logout(){try{const r=await fetch('/api/admin',{method:'DELETE'});if(!r.ok)throw Error();update(false)}catch{setError('Chưa đăng xuất được. Thử lại nhé.');modal.current?.showModal()}}
 return <><button className="private" onClick={()=>admin?logout():modal.current?.showModal()}>{admin?'Đăng xuất quản trị':'🔒 Quản trị'}</button><dialog ref={modal}><form onSubmit={login}><div className="modal-head"><h2>Mở sổ để viết 🎀</h2><button type="button" aria-label="Đóng" onClick={()=>{setPassword('');modal.current?.close()}}>×</button></div><label>Mật khẩu quản trị<input type="password" autoComplete="current-password" required maxLength={256} value={password} onChange={e=>setPassword(e.target.value)}/></label><p role="alert">{error}</p><button className="primary" disabled={busy}>{busy?'Đang kiểm tra…':'Đăng nhập'}</button></form></dialog></>
}
