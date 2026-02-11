import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  createRawMaterial,
  updateRawMaterial,
} from "../features/rawMaterials/rawMaterialSlice";

export default function RawMaterialForm({ material, onCancel, onSave  }) {
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});


  const [form, setForm] = useState({
    code: "",
    name: "",
    quantityInStock: 0,
  });

  // Preencher form ao editar
  useEffect(() => {
    if (material) {
      setForm({
        code: material.code || "",
        name: material.name || "",
        quantityInStock: material.quantityInStock ?? 0,
      });
    } else {
      setForm({ code: "", name: "", quantityInStock: 0 });
    }
  }, [material]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantityInStock" ? Number(value) : value,
    }));
  }

function validateForm() {
  const errs = {};
  if (!form.code) errs.code = "Code is required";
  if (!form.name) errs.name = "Name is required";
  if (form.quantityInStock <= 0)
    errs.quantity = "Quantity must be greater than zero";

  setErrors(errs);
  return Object.keys(errs).length === 0;
}

function handleSubmit(e) {
  e.preventDefault();

  // Valida o form
  if (!validateForm()) return;

  const rawMaterialData = {
    code: form.code,
    name: form.name,
    quantityInStock: form.quantityInStock,
  };

  // Se tiver onSave passado (modo teste/mocked), usa ele
  if (onSave) {
    onSave(rawMaterialData);
  } 
  // Senão, dispatch normal (backend ou redux real)
  else if (material?.id) {
    dispatch(updateRawMaterial({ id: material.id, rawMaterial: rawMaterialData }));
  } else {
    dispatch(createRawMaterial(rawMaterialData));
  }

  // Limpa form
  setForm({ code: "", name: "", quantityInStock: 0 });
  setErrors({});

  // Chama onCancel se houver
  onCancel?.();

}



function handleCancel() {
  setForm({ code: "", name: "", quantityInStock: 0 });
  setErrors({});
  onCancel?.();
}


  return (
    <form onSubmit={handleSubmit} className="item-form">
      <div className="form-grid">
        <div className="form-field">
          <label>Code</label>
          <input name="code" value={form.code} onChange={handleChange} data-cy="raw-code"/>
        {errors.code && <p data-cy="error-code">{errors.code}</p>}
        </div>

        <div className="form-field">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} data-cy="raw-name"/>
        {errors.name && <p data-cy="error-name">{errors.name}</p>}
        </div>

        <div className="form-field">
          <label>Quantity</label>
          <input
            type="text"
            placeholder="0"
            data-cy="raw-quantity"
            value={form.quantityInStock === 0 ? "" : form.quantityInStock}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "");
              setForm({ ...form, quantityInStock: Number(v) });
            }}
          />
          {errors.quantity && <p data-cy="error-quantity">{errors.quantity}</p>}
        </div>
      </div>

      <div className="form-actions">
<button
  type="button"
  onClick={handleCancel}
  className="btn-secondary"
  data-cy="cancel-raw-button"
>
  Cancel
</button>


        <button type="submit" className="btn-primary" data-cy="save-raw-button">
          {material ? "Update Material" : "Save Material"}
        </button>
      </div>
    </form>
  );
}
