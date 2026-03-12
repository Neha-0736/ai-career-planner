import { useState, useEffect } from "react";
import { api } from "../services/api";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

export default function CareerPlanPage() {

  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {

    if (!token) {
      navigate("/login");
    }

  }, []);

  const generatePlan = async () => {

    setLoading(true);

    try {

      const res = await api.post("/ai/career-plan", {
        role,
        jobDescription
      });

      console.log("AI RESPONSE:", res.data);

      setResult(res.data?.aiPlan || {});

    } catch (error) {

      console.error("Error generating plan:", error);
      alert("Failed to generate career plan");

    }

    setLoading(false);

  };

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4">
        AI Career Planner
      </h2>

      {!isLoggedIn && (

        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded mb-4">
          You are using guest mode.  
          Your results will not be saved.
        </div>

      )}

      <input
        className="border p-2 rounded w-full"
        placeholder="Target Role"
        value={role}
        onChange={(e)=>setRole(e.target.value)}
      />

      <br /><br />

      <textarea
        className="border p-2 rounded w-full"
        placeholder="Job Description (optional)"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <br /><br />

      <button
        onClick={generatePlan}
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded mt-3 flex items-center gap-2 disabled:opacity-50"
      >

        Generate Plan

        {loading && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}

      </button>

      {result && (

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <Card
            title="Required Skills"
            items={result?.requiredSkills || []}
          />

          <Card
            title="Missing Skills"
            items={result?.missingSkills || []}
          />

          <Card
            title="Learning Roadmap"
            items={
              result?.learningRoadmap?.map((r:any)=>
                `${r?.skill} - ${r?.duration}`
              ) || []
            }
          />

          <Card
            title="Courses"
            items={
              result?.courses?.map((c:any)=>
                `${c?.skill} - ${c?.course}`
              ) || []
            }
          />

          <Card
            title="YouTube Tutorials"
            items={
              result?.youtubeTutorials?.map((y:any)=>
                `${y?.skill} - ${y?.tutorial}`
              ) || []
            }
          />

          <Card title="Projects" items={ 
            result?.projects?.map((p:any)=>
            `${p.skill}: ${p.project}` ) || [] } />

          <Card
title="Tools"
items={[
  ...new Set(
    (result?.tools || []).map((t:any) =>
      typeof t === "string" ? t : t.tool
    )
  )
]}
/>


          <div className="bg-white shadow-md rounded-xl p-5">
            <h3 className="font-semibold mb-2">Timeline</h3>
            <p>{result?.timeline}</p>
          </div>

        </div>

      )}

    </div>

  );

}