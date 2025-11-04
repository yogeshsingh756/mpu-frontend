import api from "../axios";

export const getBootstrap = () => api.get("/api/academics/bootstrap");
