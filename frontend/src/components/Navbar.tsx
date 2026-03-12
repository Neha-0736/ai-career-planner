import { Link,useNavigate } from "react-router-dom";

export default function Navbar(){

  const navigate = useNavigate();

  const logout = ()=>{

    localStorage.removeItem("token");

    navigate("/login");

  };


  return(

    <div className="bg-white shadow-md p-4 flex justify-between">

      <h1 className="font-bold text-lg">
        SkillGap AI
      </h1>

      <div className="space-x-4">

        <Link to="/career">Career Planner</Link>

        <Link to="/register">Register</Link>

        <Link to="/login">Login</Link>

        <button
          onClick={logout}
          className="text-red-500"
        >
          Logout
        </button>

      </div>

    </div>

  );

}