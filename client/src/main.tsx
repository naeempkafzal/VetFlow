import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Appointments from "./pages/appointments"; // Adjusted import path
import Records from "./pages/records"; // Adjusted import path
import Vaccinations from "./pages/vaccinations"; // Adjusted import path
import Inventory from "./pages/inventory"; // Adjusted import path
import Outbreaks from "./pages/outbreaks"; // Adjusted import path
import SymptomChecker from "./pages/symptom-checker"; // Adjusted import path
import PetWelfare from "./pages/petwelfare"; // Adjusted import path (case sensitivity)
import "./index.css"; // Adjusted if index.css is elsewhere

// Placeholder components for missing pages
const FarmCalculator = () => <div>Farm Calculator (Not Implemented)</div>;
const AMRAssessment = () => <div>AMR Assessment (Not Implemented)</div>;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Appointments />} /> {/* Default route */}
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/records" element={<Records />} />
        <Route path="/vaccinations" element={<Vaccinations />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/outbreaks" element={<Outbreaks />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/farm-calculator" element={<FarmCalculator />} />
        <Route path="/pet-welfare" element={<PetWelfare />} />
        <Route path="/amr-assessment" element={<AMRAssessment />} />
        <Route path="*" element={<div>Page Not Found</div>} />{" "}
        {/* Fallback for undefined routes */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
