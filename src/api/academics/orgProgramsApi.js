import api from "../axios";

export const getOrgPrograms = (organizationId) => api.get(`/api/academics/organization-programs/${organizationId}`);
export const saveOrgProgram = (payload) => api.post("/api/academics/organization-programs", payload);
export const deleteOrgProgram = (id) => api.delete(`/api/academics/organization-programs/${id}`);
