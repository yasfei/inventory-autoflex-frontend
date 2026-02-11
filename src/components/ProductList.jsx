import { useState } from "react";
import ProductItem from "./ProductItem";

function ProductList({ products, stock, onEdit, onDelete }) {
  const [showBlocked, setShowBlocked] = useState(false);

  if (!products.length) {
    return <p className="empty-message">No products registered</p>;
  }

  // ===== util =====
  const getMaxQuantity = (product) => {
    if (
      !product.rawMaterials?.length ||
      !stock ||
      Object.keys(stock).length === 0
    )
      return 0;

    const quantities = product.rawMaterials.map((rm) => {
      const stockAvailable = stock[rm.rawMaterialId] ?? 0;
      const required = rm.requiredQuantity ?? 0;
      return required > 0
        ? Math.floor(stockAvailable / required)
        : 0;
    });

    return Math.min(...quantities);
  };

  // ===== separação =====
  const productsWithMaterials = products.filter(
    (p) => p.rawMaterials && p.rawMaterials.length > 0
  );

  const productsWithoutMaterials = products.filter(
    (p) => !p.rawMaterials || p.rawMaterials.length === 0
  );

  // ===== cálculo =====
  const calculatedProducts = productsWithMaterials
    .map((product) => {
      const maxQuantity = getMaxQuantity(product);
      return {
        ...product,
        maxQuantity,
        totalValue: product.value * maxQuantity,
      };
    })
    .sort((a, b) => b.totalValue - a.totalValue);

const sortedProducts = [...products]
  .map((product) => {
    const hasProduction =
      product.rawMaterials && product.rawMaterials.length > 0;

    const maxQuantity = hasProduction
      ? getMaxQuantity(product, stock)
      : 0;

    return {
      ...product,
      hasProduction,
      maxQuantity,
      totalValue: product.value * maxQuantity,
    };
  })
  .sort((a, b) => b.value - a.value);



return (
  <>
    {/* BOTÃO NO TOPO */}
    {products.some(
      (p) => !p.rawMaterials || p.rawMaterials.length === 0
    ) && (
      <div className="blocked-toggle">
        <button
          className="btn-secondary btn-sm"
          onClick={() => setShowBlocked((prev) => !prev)}
        >
          {showBlocked
            ? "Hide blocked products"
            : "Show blocked products"}
        </button>
      </div>
    )}

    <ul className="item-list">
      {sortedProducts.map((product) => {
        if (!product.hasProduction && !showBlocked) {
          return null;
        }

        return (
          <ProductItem
            key={product.id}
            product={product}
            blocked={!product.hasProduction}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </ul>
  </>
);
}

export default ProductList;
