import api from "./axios";

export const getOrganizations = () => api.get("/api/organizations");
export const saveOrganization = (payload) => api.post("/api/organizations", payload);
export const deleteOrganization = (id) => api.delete(`/api/organizations/${id}`);