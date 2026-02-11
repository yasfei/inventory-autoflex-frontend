import { useEffect, useState } from "react";

export default function ProductRawMaterialsList() {
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssociations = async () => {
      try {
        // Se você tiver um endpoint global de todas associações
        const res = await fetch("http://localhost:8080/products/raw-materials");
        if (!res.ok) throw new Error("Failed to fetch associations");
        const data = await res.json();

        // Adaptar para seu formato de exibição
        // data pode ter: id, rawMaterialId, rawMaterialName, requiredQuantity, productId, productName
        const list = data.map((assoc) => ({
          id: assoc.id,
          productId: assoc.productId,
          productName: assoc.productName || `Product ${assoc.productId}`,
          materialId: assoc.rawMaterialId,
          materialName: assoc.rawMaterialName,
          quantityNeeded: assoc.requiredQuantity,
        }));

        setAssociations(list);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssociations();
  }, []);

  if (loading) return <p>Loading associations...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-4 border rounded">
      <h2 className="font-semibold mb-2 text-gray-700">Product Associations</h2>
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1 text-gray-500">Product</th>
            <th className="px-2 py-1 text-gray-500">Material</th>
            <th className="px-2 py-1 text-gray-500">Quantity Needed</th>
          </tr>
        </thead>
        <tbody>
          {associations.map((assoc) => (
            <tr key={assoc.id}>
              <td className="px-2 py-1">{assoc.productName}</td>
              <td className="px-2 py-1">{assoc.materialName}</td>
              <td className="px-2 py-1">{assoc.quantityNeeded}</td>
            </tr>
          ))}
          {associations.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center py-2 text-gray-500">
                No associations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
