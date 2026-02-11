import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRawMaterials, deleteRawMaterial } from "./rawMaterialSlice";
import RawMaterialForm from "../../components/RawMaterialForm";
import RawMaterialList from "../../components/RawMaterialList";

export default function RawMaterialPage() {
  const dispatch = useDispatch();

  const { rawMaterials, loading, error } = useSelector(
    (state) => state.rawMaterials,
  );

  const [editingMaterial, setEditingMaterial] = useState(null);
  //  const { rawMaterials, loading, error } = useSelector(state => state.rawMaterials.rawMaterials ?? []);

  useEffect(() => {
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  // Limpa edição se a matéria-prima for deletada
  useEffect(() => {
    setEditingMaterial(null);
  }, [rawMaterials]);

  function handleEdit(material) {
    setEditingMaterial(material);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDelete(id) {
    if (window.confirm("Delete this raw material?")) {
      dispatch(deleteRawMaterial(id));
    }
  }

  return (
    <div className="page">
      <div className="page-container">
        <h1 className="page-title">Raw Materials</h1>

        <div className="card card-form">
          <RawMaterialForm
            material={editingMaterial}
            onCancel={() => setEditingMaterial(null)}
          />
        </div>

        <div className="card">
          {loading && <p className="loading-text">Loading raw materials...</p>}

          {error && <p className="error-box">{error}</p>}

          {!loading && !error && (
            <RawMaterialList
              rawMaterials={rawMaterials}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
