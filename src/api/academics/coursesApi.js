import api from "../axios";

export const getCourses = (q) => api.get("/api/academics/courses", { params:{ q }});
export const saveCourse = (payload) => api.post("/api/academics/courses", payload);
export const deleteCourse = (id) => api.delete(`/api/academics/courses/${id}`);
export const lookupCourses = (q, take=20) => api.get("/api/academics/courses/lookup", { params:{ q, take }});
