import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EducationLevelToggle() {
  const navigate = useNavigate();

  const [selectedLevel, setSelectedLevel] = useState(() => {
    return sessionStorage.getItem("educationLevel") || "kindergarten";
  });

  const levels = [
    {
      id: "kindergarten",
      label: "Kindergarten-primary",
      route: "/kindergarten-primary",
    },
    { id: "secondary", label: "Secondary", route: "/secondary" },
    { id: "ig", label: "IG", route: "/ig-school" },
  ];

  const handleLevelChange = (levelId) => {
    setSelectedLevel(levelId);
    sessionStorage.setItem("educationLevel", levelId);

    const route = levels.find((l) => l.id === levelId)?.route;
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="inline-flex rounded-lg bg-gray-300 p-1 shadow-sm">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => handleLevelChange(level.id)}
          className={`
            px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
            ${
              selectedLevel === level.id
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }
          `}
        >
          {level.label}
        </button>
      ))}
    </div>
  );
}
