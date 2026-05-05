import { useEffect, useState } from "react";
import { getMedicines, getAlerts } from "./api/medicinesApi";
import type { Medicine, MedicineAlert } from "./types/medicine";
import MedicineForm from "./components/MedicineForm";
import "./App.css";

function App() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [alerts, setAlerts] = useState<MedicineAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);

    try {
      const [medicinesData, alertsData] = await Promise.all([
        getMedicines(),
        getAlerts(),
      ]);

      setMedicines(medicinesData);
      setAlerts(alertsData);
    } catch {
      setError("Unable to refresh data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [medicinesData, alertsData] = await Promise.all([
          getMedicines(),
          getAlerts(),
        ]);

        setMedicines(medicinesData);
        setAlerts(alertsData);
      } catch {
        setError("Unable to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const totalMedicines = medicines.length;
  const totalStock = medicines.reduce(
    (sum, medicine) => sum + medicine.stock,
    0,
  );
  const lowStockCount = medicines.filter((m) => m.stock < m.threshold).length;

  const getMedicineAlerts = (medicineId: string) => {
    const alert = alerts.find((a) => a.id === medicineId);
    return alert ? alert.alerts : [];
  };

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="eyebrow">Pharmacy inventory dashboard</p>
          <h1>Pharma Stock Manager</h1>
          <p className="subtitle">
            Monitor medicine inventory, stock thresholds and expiration risks.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Total medicines</span>
          <strong>{totalMedicines}</strong>
        </article>

        <article className="stat-card">
          <span>Total stock</span>
          <strong>{totalStock}</strong>
        </article>

        <article className="stat-card warning">
          <span>Low stock</span>
          <strong>{lowStockCount}</strong>
        </article>
      </section>

      <section className="panel">
        <MedicineForm onCreated={refresh} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Medicines</h2>
            <p>Current stock overview</p>
          </div>
        </div>

        {loading && <p className="state">Loading medicines...</p>}
        {error && <p className="state error">{error}</p>}

        {!loading && !error && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Stock</th>
                  <th>Expiration</th>
                  <th>Alerts</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine) => {
                  const medicineAlerts = getMedicineAlerts(medicine.id);

                  return (
                    <tr key={medicine.id}>
                      <td>{medicine.name}</td>
                      <td>{medicine.stock}</td>
                      <td>
                        {new Date(medicine.expirationDate).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="badges">
                          {medicineAlerts.length === 0 ? (
                            <span className="badge success">OK</span>
                          ) : (
                            medicineAlerts.map((alert) => (
                              <span
                                key={alert}
                                className={`badge ${alert.toLowerCase()}`}
                              >
                                {alert.replaceAll("_", " ")}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
