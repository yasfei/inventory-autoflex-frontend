import api from "../../services/api";

const getAllProducts = () =>  {
  return api.get("/products")
    .then(res => res.data);
}


const createProduct = (product) => {
  return api.post("/products", product)
    .then(res => res.data);
};

const updateProduct = (id, product) => {
  console.log("Sending PUT payload:", product);
  return api.put(`/products/${id}`, product)
    .then(res => res.data);
};


const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    return id;
};

export const productService = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};
