import { useState } from "react";
import { Toaster } from "react-hot-toast";

import ProductPage from "./features/products/ProductPage";
import RawMaterialPage from "./features/rawMaterials/RawMaterialPage";
import AssociationsPage from "./components/AssociationsPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toasts */}
      <Toaster position="top-right" />

      {/* Header */}
<header className="app-header">
  <h1 className="header-title">Inventory Autoflex</h1>
  <nav className="nav-buttons">
    <button
      className={`nav-button ${activeTab === "products" ? "active" : ""}`}
      onClick={() => setActiveTab("products")}
    >
      Products
    </button>
    <button
      className={`nav-button ${activeTab === "rawMaterials" ? "active" : ""}`}
      onClick={() => setActiveTab("rawMaterials")}
    >
      Raw Materials
    </button>
    <button
      className={`nav-button ${activeTab === "associations" ? "active" : ""}`}
      onClick={() => setActiveTab("associations")}
    >
      Associations
    </button>
  </nav>
</header>



      {/* Conteúdo principal */}
      <main className="p-6">
        {activeTab === "products" && <ProductPage />}
        {activeTab === "rawMaterials" && <RawMaterialPage />}
        {activeTab === "associations" && <AssociationsPage />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        Inventory Autoflex &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
