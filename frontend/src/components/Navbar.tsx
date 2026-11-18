
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">
        SkillGap AI
      </h1>

      <Link
        to="/career"
        className="font-medium hover:text-blue-600"
      >
        Career Planner
      </Link>
    </div>
  );
}
