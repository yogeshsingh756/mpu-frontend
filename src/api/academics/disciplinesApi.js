import api from "../axios";

export const getDisciplines = (streamId) => api.get("/api/academics/disciplines", { params:{ streamId }});
export const saveDiscipline = (payload) => api.post("/api/academics/disciplines", payload);
export const deleteDiscipline = (id) => api.delete(`/api/academics/disciplines/${id}`);
