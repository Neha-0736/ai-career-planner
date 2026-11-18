
import { useState } from "react";
import { api } from "../services/api";
import Card from "../components/Card";

export default function CareerPlanPage() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePlan = async () => {
    if (!role.trim()) {
      setError("Please enter your target job role.");
      return;
    }

    if (role.trim().length > 100) {
      setError("Target role cannot exceed 100 characters.");
      return;
    }

    const skillList = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    if (skillList.length === 0) {
      setError("Please enter at least one existing skill.");
      return;
    }

    if (skillList.length > 30) {
      setError("You can enter a maximum of 30 skills.");
      return;
    }

    if (skillList.some((skill) => skill.length > 50)) {
      setError("Each skill cannot exceed 50 characters.");
      return;
    }

    if (jobDescription.length > 5000) {
      setError("Job description cannot exceed 5000 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.post("/api/ai/career-plan", {
        role: role.trim(),
        skills: skillList,
        jobDescription
      });

      setResult(res.data?.aiPlan || {});
    } catch (error: any) {
      console.error("Error generating plan:", error);

      setError(
        error.response?.data?.message ||
        "Failed to generate career plan. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        AI Career Planner
      </h2>

      <div className="space-y-4">
        <input
          className="border p-3 rounded w-full"
          placeholder="Target Role (e.g. Software Developer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <textarea
          className="border p-3 rounded w-full"
          placeholder="Enter your existing skills, separated by commas (e.g. C, Python, SQL, HTML, CSS)"
          rows={3}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <textarea
          className="border p-3 rounded w-full"
          placeholder="Job Description (optional)"
          rows={4}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        {error && (
          <p className="text-red-600 bg-red-50 p-3 rounded">
            {error}
          </p>
        )}

        <button
          onClick={generatePlan}
          disabled={loading}
          className="bg-blue-500 text-white p-3 rounded flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Career Plan"}

          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
        </button>
      </div>

      {result && (
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card
            title="Required Skills"
            items={result.requiredSkills || []}
          />

          <Card
            title="Missing Skills"
            items={result.missingSkills || []}
          />

          <Card
            title="Learning Roadmap"
            items={result.learningRoadmap || []}
          />

          <Card
            title="Courses"
            items={result.courses || []}
          />

          <Card
            title="YouTube Tutorials"
            items={result.youtubeTutorials || []}
          />

          <Card
            title="Projects"
            items={result.projects || []}
          />

          <Card
            title="Tools"
            items={result.tools || []}
          />

          {result.timeline && (
            <div className="bg-white shadow-md rounded-xl p-5">
              <h3 className="font-semibold mb-2">Timeline</h3>
              <p>{result.timeline}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
