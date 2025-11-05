import axios from 'axios';
const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_BASE || 'https://mpublp-api.abhiworld.in'
})
api.interceptors.request.use((config)=>{ const t=localStorage.getItem('token'); if(t) config.headers.Authorization=`Bearer ${t}`; return config; })
api.interceptors.response.use(r=>r, err=>{ if(err.response?.status===401){ localStorage.removeItem('token'); window.location.href='/login' } return Promise.reject(err) })
export default api
