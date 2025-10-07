import express from "express";
import cors from "cors";
import appointmentsRouter from "./routes/appointments";
import recordsRouter from "./routes/records";
import vaccinationsRouter from "./routes/vaccinations";
import inventoryRouter from "./routes/inventory";
import outbreaksRouter from "./routes/outbreaks";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/appointments", appointmentsRouter);
app.use("/api/records", recordsRouter);
app.use("/api/vaccinations", vaccinationsRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/outbreaks", outbreaksRouter);

app.listen(5001, () => console.log("Server running on port 5001"));
