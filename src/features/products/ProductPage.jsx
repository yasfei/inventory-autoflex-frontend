import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "./productSlice";
import { fetchRawMaterials } from "../rawMaterials/rawMaterialSlice";
import ProductForm from "../../components/ProductForm";
import ProductList from "../../components/ProductList";

function ProductPage() {
  const dispatch = useDispatch();

  // Redux states
  const { products, loading, error } = useSelector((state) => state.products);
  const rawMaterials = useSelector((state) => state.rawMaterials.rawMaterials);

  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products and raw materials once
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  // Reset editingProduct if it was deleted
  useEffect(() => {
    if (editingProduct && !products.find((p) => p.id === editingProduct.id)) {
      setEditingProduct(null);
    }
  }, [products, editingProduct]);

  // Cria um objeto de stock: { rawMaterialId: quantidadeDisponível }
  const rawMaterialsStock = useMemo(() => {
    return rawMaterials.reduce((acc, rm) => {
      acc[rm.id] = rm.quantityInStock ?? 0;
      return acc;
    }, {});
  }, [rawMaterials]);

  // Combina stock com rawMaterials de cada produto
const productsWithStock = useMemo(() => {
  return products.map((product) => {
    const rawMaterialsWithAvailable = (product.rawMaterials || []).map((rm) => ({
      ...rm,
      available: rawMaterialsStock[rm.rawMaterialId] ?? 0,
    }));
    return {
      ...product,
      rawMaterials: rawMaterialsWithAvailable,
    };
  });
}, [products, rawMaterialsStock]);


  // Handlers
  function handleEdit(product) {
    setEditingProduct(product);
    // sobe a tela para o topo da página
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDelete(id) {
    if (window.confirm("Delete this product?")) {
      dispatch(deleteProduct(id));
      if (editingProduct?.id === id) setEditingProduct(null);
    }
  }

  return (
    <div className="page">
      <div className="page-container">
        <h1 className="page-title">Products</h1>

        <section className="card card-form">
          <ProductForm
            product={editingProduct}
            onCancel={() => setEditingProduct(null)}
          />
        </section>

        <section className="card">
          {loading && <p className="page-loading">Loading products...</p>}
          {error && <p className="page-error">{error}</p>}

          {!loading && !error && rawMaterials.length > 0 && (
            <ProductList
              products={productsWithStock} // produtos com stock já cruzado
              stock={rawMaterialsStock}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default ProductPage;
