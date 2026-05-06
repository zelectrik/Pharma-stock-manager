import { useState } from "react";
import { createMedicine } from "../api/medicinesApi";

type Props = {
  onCreated: () => void;
};

export default function MedicineForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [stock, setStock] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const [expirationDate, setExpirationDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createMedicine({
        name,
        stock,
        threshold,
        expirationDate,
      });
      setName("");
      setStock(0);
      setThreshold(0);
      setExpirationDate("");
      onCreated();
    } catch {
      setError("Failed to create medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Add medicine</h3>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        placeholder="Stock"
        type="number"
        value={stock}
        onChange={(e) => setStock(parseInt(e.target.value) || 0)}
        required
      />
      <input
        placeholder="Threshold"
        type="number"
        value={threshold}
        onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
        required
      />
      <input
        type="date"
        value={expirationDate}
        onChange={(e) => setExpirationDate(e.target.value)}
        required
      />
      {error && <p className="form-error">{error}</p>}

      <button disabled={loading}>{loading ? "Creating..." : "Add"}</button>
    </form>
  );
}
