import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import { fetchRawMaterials } from "../features/rawMaterials/rawMaterialSlice";
import toast from "react-hot-toast";

export default function AssociationsPage() {
  const dispatch = useDispatch();

const products = useSelector((state) => state.products.products || []);
const rawMaterials = useSelector((state) => state.rawMaterials.rawMaterials || []);

  const [associations, setAssociations] = useState([]);
  const [form, setForm] = useState({
    id: null,
    productId: "",
    rawMaterialId: "",
    quantity: "",
  });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  useEffect(() => {
    async function loadAssociations() {
      if (!products?.length) return;

      try {
        const all = [];

        for (const product of products) {
          const res = await fetch(
            `http://localhost:8080/products/${product.id}/raw-materials`
          );
          const data = await res.json();

          data.forEach((a) => {
            all.push({
              id: a.id,
              productId: product.id,
              productName: product.name,
              rawMaterialId: a.rawMaterialId,
              rawMaterialName: a.rawMaterialName,
              quantity: a.requiredQuantity,
            });
          });
        }

        setAssociations(all);
      } catch (err) {
        console.error(err);
        toast.error("Error loading associations");
      }
    }

    loadAssociations();
  }, [products]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.productId || !form.rawMaterialId || !form.quantity) {
      toast.error("Fill all fields");
      return;
    }

    const product = products.find(p => p.id === Number(form.productId));
    const material = rawMaterials.find(rm => rm.id === Number(form.rawMaterialId));

    if (!product || !material) return;

    if (form.id) {
      setAssociations(prev =>
        prev.map(a =>
          a.id === form.id
            ? {
                ...a,
                productId: product.id,
                productName: product.name,
                rawMaterialId: material.id,
                rawMaterialName: material.name,
                quantity: Number(form.quantity),
              }
            : a
        )
      );
      toast.success("Association updated");
    } else {
      setAssociations(prev => [
        ...prev,
        {
          id: Math.random(),
          productId: product.id,
          productName: product.name,
          rawMaterialId: material.id,
          rawMaterialName: material.name,
          quantity: Number(form.quantity),
        },
      ]);
      toast.success("Association created");
    }

    setForm({ id: null, productId: "", rawMaterialId: "", quantity: "" });
  }

  function handleEdit(a) {
    setForm({
      id: a.id,
      productId: a.productId,
      rawMaterialId: a.rawMaterialId,
      quantity: a.quantity,
    });
    // sobe a tela para o topo da página
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDelete(id) {
    setAssociations(prev => prev.filter(a => a.id !== id));
    toast.success("Association removed");
  }

  return (
    <div className="page">
      <div className="page-container">
        <h1 className="page-title">Associations</h1>

        {/* FORM */}
        <div className="card card-form">
          <form onSubmit={handleSubmit} className="association-form">
            <select
              name="productId"
              value={form.productId}
              onChange={handleChange}
              data-cy="assoc-product"
              disabled={!products?.length} // desabilita até ter dados
            >
              <option value="">Select product</option>
              {products.map(p => (
                <option key={p.id} value={String(p.id)}>{p.name}</option>
              ))}
            </select>

            <select
              name="rawMaterialId"
              value={form.rawMaterialId}
              onChange={handleChange}
              data-cy="assoc-material"
              disabled={!rawMaterials?.length} // desabilita até ter dados
            >
              <option value="">Select raw material</option>
              {rawMaterials.map(rm => (
                <option key={rm.id} value={String(rm.id)}>{rm.name}</option>
              ))}
            </select>

            <input
              type="number"
              name="quantity"
              placeholder="Required quantity"
              value={form.quantity}
              onChange={handleChange}
               data-cy="assoc-quantity"
            />

            <button className="btn-primary" data-cy="assoc-submit">
              {form.id ? "Update" : "Add"}
            </button>
          </form>
        </div>

        {/* LIST */}
        <div className="card">
          {associations.length === 0 ? (
            <p className="empty-message">No associations registered</p>
          ) : (
            <ul className="item-list">
              {associations.map(a => (
                <li key={a.id} className="item-item">
                  <div className="item-info">
                    <p className="item-name">{a.productName}</p>
                    <p className="item-code">
                      {a.rawMaterialName}
                    </p>
                    <p className="item-meta">
                      Quantity: {a.quantity}
                    </p>
                  </div>

                  <div className="item-actions">
                    <button
                      className="btn-primary btn-sm"
                      onClick={() => handleEdit(a)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(a.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
