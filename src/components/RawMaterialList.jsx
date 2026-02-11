import RawMaterialItem from "./RawMaterialItem";

export default function RawMaterialList({ rawMaterials, onEdit, onDelete }) {
  if (!rawMaterials.length) {
    return (
      <p className="empty-message">
        No raw materials registered
      </p>
    );
  }

  return (
    <ul className="item-list">
      {rawMaterials.map((material) => (
        <RawMaterialItem
          key={material.id}
          material={material}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
