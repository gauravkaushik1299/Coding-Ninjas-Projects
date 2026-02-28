import express from "express";
import cors from "cors";
import empRoutes from "./routes/employee.route.js";

const app = express();

app.use(cors());

app.use("/api/v1/emp", empRoutes);

export default app;
