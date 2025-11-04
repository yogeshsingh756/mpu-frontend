import api from "../axios";

export const getSyllabus = (programId) => api.get(`/api/academics/program-courses/programs/${programId}/syllabus`);
export const saveMapping = (payload) => api.post("/api/academics/program-courses", payload);
export const deleteMapping = (programCourseId) => api.delete(`/api/academics/program-courses/${programCourseId}`);
