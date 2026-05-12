import express from "express";
import cors from "cors";
import pharmacyRoutes from "./routes/pharmacy.routes";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "pharma-stock-api",
  });
});

app.use("/pharmacy", pharmacyRoutes);
