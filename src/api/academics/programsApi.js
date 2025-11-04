import api from "../axios";

export const searchPrograms = (params) => api.get("/api/academics/programs/search", { params });
export const getPrograms = (disciplineId) => api.get("/api/academics/programs", { params:{ disciplineId }});
export const saveProgram = (payload) => api.post("/api/academics/programs", payload);
export const deleteProgram = (id) => api.delete(`/api/academics/programs/${id}`);
export const getSyllabus = (programId) => api.get(`/api/academics/program-courses/programs/${programId}/syllabus`);
export const copySyllabus = (fromId, toId) => api.post(`/api/academics/programs/${fromId}/copy-syllabus/${toId}`); // (optional if you add backend)
