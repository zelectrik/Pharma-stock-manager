import { useState } from "react";
import { createPharmacyMedicine } from "../api/medicinesApi";

type Props = {
  onCreated: () => Promise<void> | void;
};

export default function PharmacyMedicineForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [threshold, setThreshold] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createPharmacyMedicine({
        name,
        threshold,
      });

      setName("");
      setThreshold(10);
      setSuccess("Medicine product created");
      await onCreated();
    } catch {
      setError("Unable to create medicine product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-header">
        <div>
          <h3>Add pharmacy medicine</h3>
          <p>Create a medicine reference with its alert threshold.</p>
        </div>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Medicine name</span>
          <input
            placeholder="Example: Doliprane"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Alert threshold</span>
          <input
            type="number"
            min="0"
            placeholder="Example: 10"
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
            required
          />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create product"}
        </button>
      </div>

      {error && <p className="form-message error">{error}</p>}
      {success && <p className="form-message success">{success}</p>}
    </form>
  );
}
