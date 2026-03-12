import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5000",
    "X-Title": "AI Skill Gap Planner"
  }
});

export const generateCareerPlan = async (
  role: string,
  jobDescription: string,
  skills: any[]
) => {

  const skillSummary = skills
  .map((s) => s.name)
  .join(", ");

  const prompt = `
A developer wants to become a ${role}.

User current skills:
${skillSummary}

Job description:
${jobDescription || "Not provided"}

Instructions:

1. Identify the top 8 skills required for the role.
2. Compare them with the user's skills.
3. Missing skills must be calculated as:
   missingSkills = requiredSkills - userSkills
4. Generate a learning roadmap for all the required skills.
5. Recommend YouTube playlists or tutorials or atleast search prompt for each required skill.
6. Display each tool only once. Avoid displaying same tool again and again even if it used for multiple skills.

Return ONLY valid JSON.
Do NOT include explanations, headings, or markdown.

Use exactly this structure:

{
 "requiredSkills": [],
 "missingSkills": [],
 "learningRoadmap": [],
 "courses": [],
 "youtubeTutorials": [],
 "projects": [],
 "tools": [],
 "timeline": ""
}

Important rules:
- Base recommendations on current software industry trends.
- Missing skills must be calculated by comparing requiredSkills with userSkills.
- Do NOT include userSkills in missingSkills.

`;

  try {

    const response = await client.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    });

    const aiText = response.choices[0].message?.content || "{}";

    // Debug log (optional)
    console.log("AI RAW RESPONSE:", aiText);

    // Remove markdown blocks if AI returns ```json
    let cleaned = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Extract JSON if extra text exists
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      cleaned = cleaned.substring(start, end + 1);
    }

    const parsed = JSON.parse(cleaned);

    return parsed;

  } catch (error) {

    console.error("AI JSON parse failed:", error);

    return {
      requiredSkills: [],
      missingSkills: [],
      learningRoadmap: [],
      courses: [],
      youtubeTutorials: [],
      projects: [],
      tools: [],
      timeline: "Unable to generate structured plan"
    };

  }
};