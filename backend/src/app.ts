import express from "express";
import cors from "cors";
import medicineRoutes from "./routes/medicine.routes";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "pharma-stock-api",
  });
});

app.use("/medicines", medicineRoutes);
