import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

interface Skill {
  id: number;
  name: string;
  currentLevel: number;
  targetLevel: number;
}

export default function SkillsPage() {

  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState("");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(5);
  const [gap, setGap] = useState<any[]>([]);

  const navigate = useNavigate();

useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  loadSkills();
  loadGap();

}, []);

  const loadSkills = async () => {
    const res = await api.get("/skills");
    setSkills(res.data);
  };

  const loadGap = async () => {
    const res = await api.get("/skills/gap");
    setGap(res.data);
  };

  useEffect(() => {
    loadSkills();
    loadGap();
  }, []);

  const addSkill = async () => {

    if (!name) return alert("Enter skill name");

    await api.post("/skills", {
      name,
      currentLevel,
      targetLevel
    });

    setName("");
    setCurrentLevel(1);
    setTargetLevel(5);

    loadSkills();
    loadGap();
  };

  const deleteSkill = async (id: number) => {

    await api.delete(`/skills/${id}`);
    loadSkills();
    loadGap();

  };

  const levelUp = async (skill: Skill) => {

    await api.put(`/skills/${skill.id}`, {
      currentLevel: skill.currentLevel + 1
    });

    loadSkills();
    loadGap();

  };

  return (

    <div style={{
      maxWidth: "900px",
      margin: "auto",
      padding: "30px"
    }}>

      <h1 style={{ marginBottom: 20 }}>Skill Manager</h1>

      {/* Add Skill Card */}

      <div style={{
        background: "#f8f9fa",
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}>

        <h2>Add Skill</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 120px 120px 120px",
          gap: 10,
          marginTop: 10
        }}>

          <input
            placeholder="Skill name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            value={currentLevel}
            onChange={(e) =>
              setCurrentLevel(Number(e.target.value))
            }
          />

          <input
            type="number"
            value={targetLevel}
            onChange={(e) =>
              setTargetLevel(Number(e.target.value))
            }
          />

          <button onClick={addSkill}>
            Add Skill
          </button>

        </div>

      </div>

      {/* Skills Table */}

      <div style={{
        background: "#ffffff",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        marginBottom: 30
      }}>

        <h2>Your Skills</h2>

        <table style={{
          width: "100%",
          marginTop: 15,
          borderCollapse: "collapse"
        }}>

          <thead>

            <tr style={{ background: "#f1f3f5" }}>
              <th style={{ padding: 10 }}>Skill</th>
              <th>Current</th>
              <th>Target</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {skills.map(skill => (

              <tr key={skill.id} style={{
                textAlign: "center",
                borderTop: "1px solid #eee"
              }}>

                <td style={{ padding: 10 }}>
                  {skill.name}
                </td>

                <td>{skill.currentLevel}</td>

                <td>{skill.targetLevel}</td>

                <td>

                  <button
                    onClick={() => levelUp(skill)}
                    style={{
                      marginRight: 10
                    }}
                  >
                    Level Up
                  </button>

                  <button
                    onClick={() => deleteSkill(skill.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Skill Gap */}

      <div style={{
        background: "#f8f9fa",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}>

        <h2>Skill Gap</h2>

        {gap.length === 0 && <p>No skill gaps</p>}

        {gap.map((g: any, index) => (

          <div key={index} style={{
            marginTop: 10,
            padding: 10,
            background: "white",
            borderRadius: 6
          }}>

            <b>{g.name}</b>

            <p>Gap: {g.gap}</p>

          </div>

        ))}

      </div>

      <div style={{ marginTop: 30 }}>

  <button
    onClick={() => navigate("/career")}
    style={{
      padding: "10px 18px",
      fontSize: "16px"
    }}
  >
    Continue to Career Planner →
  </button>

</div>

    </div>

  );
}