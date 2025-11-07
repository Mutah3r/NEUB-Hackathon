import api from "./apiClient";

export function authorityLogin({ email, password }) {
  return api.post("/authority/login", { email, password });
}

export function getVaccines() {
  return api.get("/vaccine");
}

export function createVaccine({ name, description }) {
  return api.post("/vaccine", { name, description });
}

export function deleteVaccine(id) {
  return api.delete(`/vaccine/${id}`);
}

export default { authorityLogin, getVaccines, createVaccine, deleteVaccine };