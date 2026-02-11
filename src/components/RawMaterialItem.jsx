export default function RawMaterialItem({ material, onEdit, onDelete }) {
  return (
    <li className="item-item">
      <div className="item-info">
        <p className="item-name">{material.name}</p>
        <p className="item-code">Code: {material.code}</p>
        <p className="item-meta">
          Quantity: {material.quantityInStock}
        </p>
      </div>

      <div className="item-actions">
        <button
          onClick={() => onEdit(material)}
          className="btn-primary btn-sm"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(material.id)}
          className="btn-danger btn-sm"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
