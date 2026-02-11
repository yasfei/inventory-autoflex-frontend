import { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  createProduct,
  updateProduct,
} from "../features/products/productSlice";
import { fetchRawMaterials } from "../features/rawMaterials/rawMaterialSlice";

export default function ProductForm({ product, onCancel }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    code: "",
    name: "",
    value: 0,
    rawMaterials: [],
  });

  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [quantityNeeded, setQuantityNeeded] = useState("");

    // **Adicionei aqui**
  const [errors, setErrors] = useState({});

  const rawMaterials = useSelector(
    (state) => state.rawMaterials.rawMaterials ?? [],
    shallowEqual,
  );

  useEffect(() => {
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  useEffect(() => {
    if (!product) {
      setForm({ code: "", name: "", value: 0, rawMaterials: [] });
      return;
    }

    setForm({
      code: product.code || "",
      name: product.name || "",
      value: product.value || 0,
      rawMaterials: [],
    });

    const fetchAssociations = async () => {
      const res = await fetch(
        `http://localhost:8080/products/${product.id}/raw-materials`,
      );
      const data = await res.json();

      setForm((prev) => ({
        ...prev,
        rawMaterials: data.map((rm) => ({
          id: rm.rawMaterialId,
          name: rm.rawMaterialName,
          quantityNeeded: rm.requiredQuantity,
        })),
      }));
    };

    fetchAssociations();
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "value" ? Number(value) : value,
    }));
  };

const handleAddMaterial = () => {
  const qty = Number(quantityNeeded);
  const newErrors = {};

  if (!selectedMaterialId) newErrors.rawMaterialId = "Select a raw material";
  if (!qty || qty <= 0) newErrors.rawMaterialQty = "Quantity must be greater than zero";

  if (Object.keys(newErrors).length > 0) {
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return;
  }

  const material = rawMaterials.find((m) => m.id === Number(selectedMaterialId));
  if (!material) return;

  setForm((prev) => {
    const exists = prev.rawMaterials.find((rm) => rm.id === material.id);
    if (exists) {
      return {
        ...prev,
        rawMaterials: prev.rawMaterials.map((rm) =>
          rm.id === material.id ? { ...rm, quantityNeeded: qty } : rm
        ),
      };
    }
    return {
      ...prev,
      rawMaterials: [...prev.rawMaterials, { id: material.id, name: material.name, quantityNeeded: qty }],
    };
  });

  setSelectedMaterialId("");
  setQuantityNeeded("");
  setErrors((prev) => ({ ...prev, rawMaterialId: null, rawMaterialQty: null }));
};


  const handleRemoveMaterial = (id) => {
    setForm((prev) => ({
      ...prev,
      rawMaterials: prev.rawMaterials.filter((rm) => rm.id !== id),
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const newErrors = {};
  if (!form.code) newErrors.code = "Code is required";
  if (!form.name) newErrors.name = "Name is required";
  if (!form.value || form.value <= 0) newErrors.value = "Value must be greater than zero";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return; // não envia o form
  }

  const payload = {
    code: form.code,
    name: form.name,
    value: form.value,
    rawMaterials: form.rawMaterials.map(({ id, quantityNeeded }) => ({
      rawMaterialId: id,
      requiredQuantity: quantityNeeded,
    })),
  };

  product?.id
    ? dispatch(updateProduct({ id: product.id, product: payload }))
    : dispatch(createProduct(payload));

  setForm({ code: "", name: "", value: 0, rawMaterials: [] });
  setErrors({});
  onCancel?.();
};


  return (
    <form onSubmit={handleSubmit} className="item-form">

      {/* Campos principais */}
      <div className="form-grid">
        <div className="form-field">
          <label>Code</label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            data-cy="form-product-code"
          />
          {errors.code && <p data-cy="error-code">{errors.code}</p>}
        </div>

        <div className="form-field">
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            data-cy="form-product-name"
          />
          {errors.name && <p data-cy="error-name">{errors.name}</p>}
        </div>

        <div className="form-field">
          <label>Value</label>
          <input
            type="text"
            name="value"
            value={
              form.value !== null
                ? form.value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                : ""
            }
            placeholder="R$ 0,00"
            onChange={(e) => {
              let v = e.target.value.replace(/\D/g, "");
              let numberValue = Number(v) / 100;
              setForm({ ...form, value: numberValue });
            }}
            data-cy="form-product-value"
          />
          {errors.value && <p data-cy="error-value">{errors.value}</p>}
        </div>
      </div>

      {/* Associação */}
      <div className="association-box">
        <h3>Associate Raw Materials</h3>

        <div className="association-form">
          <select
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
            data-cy="raw-material-select"
          >
            <option value="">Select a material</option>
            {rawMaterials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          {errors.rawMaterialId && <p data-cy="error-raw-material">{errors.rawMaterialId}</p>}
      

          <input
            type="number"
            min="1"
            step="1"
            placeholder="Required Quantity"
            value={quantityNeeded}
            onChange={(e) => setQuantityNeeded(e.target.value)}
            className="input-number"
            data-cy="raw-material-quantity"
          />
            {errors.rawMaterialQty && <p data-cy="error-raw-material-qty">{errors.rawMaterialQty}</p>}
      

          <button
            type="button"
            className="btn-primary"
            onClick={handleAddMaterial}
            data-cy="add-raw-material"
          >
            Add
          </button>
        </div>


        <table className="association-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Quantity</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {form.rawMaterials.map((rm, index) => (
              <tr key={`${rm.id}-${index}`}>
                <td>{rm.name}</td>
                <td>{rm.quantityNeeded}</td>
                <td>
                  <button
                    type="button"
                    className="btn-delete-sm"
                    onClick={() => handleRemoveMaterial(rm.id)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}

            {!form.rawMaterials.length && (
              <tr>
                <td colSpan="3" className="empty-message">
                  No materials associated yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>




      {/* Ações */}
      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          data-cy="cancel-button"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn-primary"
          data-cy="save-product-button"
        >
          {product ? "Update Product" : "Save Product"}
        </button>

        
      </div>
    </form>
  );
}
