
import { Routes, Route, Navigate } from "react-router-dom";

import CareerPlanPage from "./pages/CareerPlanPage";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/career" replace />} />
        <Route path="/career" element={<CareerPlanPage />} />
        <Route path="*" element={<Navigate to="/career" replace />} />
      </Routes>
    </div>
  );
}
