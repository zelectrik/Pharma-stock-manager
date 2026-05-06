import { useEffect, useState } from "react";
import {
  getInventoryWithAlerts,
  getMedicineProducts,
} from "./api/medicinesApi";
import type {
  InventoryItemWithAlerts,
  MedicineProduct,
} from "./types/medicine";
import ProductForm from "./components/ProductForm";
import BatchForm from "./components/BatchForm";
import InventoryTable from "./components/InventoryTable";
import "./App.css";

type ActiveTab = "inventory" | "alerts" | "product" | "batch";

function App() {
  const [products, setProducts] = useState<MedicineProduct[]>([]);
  const [inventory, setInventory] = useState<InventoryItemWithAlerts[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("inventory");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const inventoryWithAlertsOnly = inventory.filter(
    (item) => item.alerts.length > 0,
  );

  const refreshDashboard = async () => {
    setError(null);

    const [productsData, inventoryData] = await Promise.all([
      getMedicineProducts(),
      getInventoryWithAlerts(),
    ]);

    setProducts(productsData);
    setInventory(inventoryData);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        await refreshDashboard();
      } catch {
        setError("Unable to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="eyebrow">Pharmacy inventory dashboard</p>
          <h1>Pharma Stock Manager</h1>
          <p className="subtitle">
            Manage medicine products, stock batches, expiration dates and
            inventory alerts.
          </p>
        </div>
      </section>

      <nav className="tabs">
        <button
          className={activeTab === "inventory" ? "active" : ""}
          onClick={() => setActiveTab("inventory")}
        >
          Inventory
        </button>

        <button
          className={activeTab === "alerts" ? "active" : ""}
          onClick={() => setActiveTab("alerts")}
        >
          Alerts
        </button>

        <button
          className={activeTab === "product" ? "active" : ""}
          onClick={() => setActiveTab("product")}
        >
          Add product
        </button>

        <button
          className={activeTab === "batch" ? "active" : ""}
          onClick={() => setActiveTab("batch")}
        >
          Add batch
        </button>
      </nav>

      {activeTab === "inventory" && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Inventory</h2>
              <p>
                All medicine products with aggregated quantities and batch
                details.
              </p>
            </div>
          </div>

          {loading && <p className="state">Loading inventory...</p>}
          {error && <p className="state error">{error}</p>}

          {!loading && !error && <InventoryTable inventory={inventory} />}
        </section>
      )}

      {activeTab === "alerts" && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Products with alerts</h2>
              <p>
                Medicine products requiring attention due to stock or expiration
                risks.
              </p>
            </div>
          </div>

          {loading && <p className="state">Loading alerts...</p>}
          {error && <p className="state error">{error}</p>}

          {!loading && !error && (
            <InventoryTable inventory={inventoryWithAlertsOnly} />
          )}
        </section>
      )}

      {activeTab === "product" && (
        <section className="single-form-panel">
          <ProductForm onCreated={refreshDashboard} />
        </section>
      )}

      {activeTab === "batch" && (
        <section className="single-form-panel">
          <BatchForm products={products} onCreated={refreshDashboard} />
        </section>
      )}
    </main>
  );
}

export default App;
