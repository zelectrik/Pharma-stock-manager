import { useState } from "react";
import { createMedicineBatch } from "../api/medicinesApi";
import type { MedicineProduct } from "../types/medicine";

type Props = {
  products: MedicineProduct[];
  onCreated: () => Promise<void> | void;
};

export default function BatchForm({ products, onCreated }: Props) {
  const [medicineProductId, setMedicineProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [expirationDate, setExpirationDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createMedicineBatch(medicineProductId, {
        quantity,
        expirationDate,
      });

      setQuantity(1);
      setExpirationDate("");
      setSuccess("Batch added");
      await onCreated();
    } catch {
      setError("Unable to add batch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-header">
        <div>
          <h3>Add stock batch</h3>
          <p>Select a product, then add quantity and expiration date.</p>
        </div>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Medicine product</span>
          <select
            value={medicineProductId}
            onChange={(event) => setMedicineProductId(event.target.value)}
            required
          >
            <option value="">Select a medicine product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Batch quantity</span>
          <input
            type="number"
            min="0"
            placeholder="Example: 50"
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            required
          />
        </label>

        <label className="field">
          <span>Expiration date</span>
          <input
            type="date"
            value={expirationDate}
            onChange={(event) => setExpirationDate(event.target.value)}
            required
          />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading || products.length === 0}>
          {loading ? "Adding..." : "Add batch"}
        </button>
      </div>

      {products.length === 0 && (
        <p className="form-message warning">
          Create a medicine product before adding batches.
        </p>
      )}

      {error && <p className="form-message error">{error}</p>}
      {success && <p className="form-message success">{success}</p>}
    </form>
  );
}
