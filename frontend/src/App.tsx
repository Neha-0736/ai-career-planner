import { Routes,Route } from "react-router-dom";
import CareerPlanPage from "./pages/CareerPlanPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import Navbar from "./components/Navbar";
import SkillsPage from "./pages/SkillsPage";

export default function App(){

  return(

    <div>

      <Navbar/>

      <Routes>

        <Route
 path="/career"
 element={<CareerPlanPage/>}
/>

        <Route
          path="/login"
          element={<LoginPage/>}
        />

        <Route
          path="/register"
          element={<RegisterPage/>}
        />

        <Route path="/skills" element={<SkillsPage />} />

      </Routes>

    </div>

  );

}