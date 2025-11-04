import { useEffect, useState } from 'react';
export function useAuth(){ const [token,setToken]=useState(localStorage.getItem('token')); useEffect(()=>{ const f=()=>setToken(localStorage.getItem('token')); window.addEventListener('storage',f); return ()=>window.removeEventListener('storage',f)},[]); return { token, isAuthed: !!token } }
