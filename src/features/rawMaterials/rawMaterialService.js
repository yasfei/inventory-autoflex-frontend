import api from "../../services/api";

const getAllRawMaterials = () => {
  return api.get("/raw-materials")
    .then(res => res.data);
};

const createRawMaterial = (rawMaterial) => {
  return api.post("/raw-materials", rawMaterial)
    .then(res => res.data);
};

const updateRawMaterial = (id, rawMaterial) => {
  return api.put(`/raw-materials/${id}`, rawMaterial)
    .then(res => res.data);
};

const deleteRawMaterial = async (id) => {
  await api.delete(`/raw-materials/${id}`);
  return id;
};

export const rawMaterialService = {
  getAllRawMaterials,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
};
