import { useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function LoginPage(){

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = async () => {

  const res = await api.post("/auth/login", {
    email,
    password
  });

  localStorage.setItem("token", res.data.token);

  window.location.href = "/skills";

};

  return(

    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-96">

        <h2 className="text-xl font-bold mb-4">
          Login
        </h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-green-500 text-white w-full p-2 rounded"
        >
          Login
        </button>

        <button
 onClick={()=>navigate("/career")}
 className="mt-3 w-full border p-2 rounded"
>
Continue as Guest
</button>

      </div>

    </div>

  );

}