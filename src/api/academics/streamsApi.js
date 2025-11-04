import api from "../axios";

export const getStreams = () => api.get("/api/academics/streams");
export const saveStream = (payload) => api.post("/api/academics/streams", payload);
export const deleteStream = (id) => api.delete(`/api/academics/streams/${id}`);