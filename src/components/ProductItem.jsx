function ProductItem({ product, onEdit, onDelete, blocked = false }) {
  const hasProduction =
    product.rawMaterials && product.rawMaterials.length > 0;

  return (
    <li className={`item-item ${blocked ? "item-blocked" : ""}`}>
      <div className="item-info">
        <p className="item-name" data-cy="list-product-name">{product.name}</p>
        <p className="item-code" data-cy="list-product-cod">Code: {product.code}</p>

        <p className="item-meta" data-cy="list-product-value">
          Unit: R$ {Number(product.value).toFixed(2)}
        </p>

        {hasProduction && !blocked ? (
          <>
            <p className="item-meta" data-cy="list-product-max-value">
              Max units: {product.maxQuantity}
            </p>
            <p className="item-meta" data-cy="list-product-total-value">
              Total value: R$ {product.totalValue.toFixed(2)}
            </p>
          </>
        ) : (
        <p className="item-blocked-text">
            No materials associated
          </p>
        )}
      </div>

      <div className="item-actions">
        <button
          onClick={() => onEdit(product)}
          className="btn-primary btn-sm"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(product.id)}
          className="btn-danger btn-sm"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default ProductItem;
