import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ChevronDown } from "lucide-react";

const levelColors = {
  kg: {
    main: "from-orange-400 to-orange-600",
    hover: "from-green-50 to-blue-50",
  },
  ig: {
    main: "from-purple-500 to-cyan-500",
    hover: "from-purple-50 to-cyan-50",
  },
  prep: {
    main: "from-pink-600 to-yellow-500",
    hover: "from-pink-50 to-yellow-50",
  },
};

export default function EducationLevelToggle({ lvl }) {
  const currentColors = levelColors[lvl] || levelColors.kg;

  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [selectedLevel, setSelectedLevel] = useState(() => {
    return sessionStorage.getItem("educationLevel") || "kindergarten";
  });

  const levels = [
    {
      id: "kindergarten",
      label: "Kindergarten-primary",
      route: "/",
    },
    { id: "secondary", label: "Prep - Thanaweya Amma", route: "/secondary" },
    { id: "ig", label: "IG - American", route: "/ig-school" },
  ];

  const handleLevelChange = (levelId) => {
    setSelectedLevel(levelId);
    sessionStorage.setItem("educationLevel", levelId);

    const route = levels.find((l) => l.id === levelId)?.route;
    if (route) {
      navigate(route);
    }
    setIsMenuOpen(false);
  };

  const getCurrentLabel = () => {
    return levels.find((l) => l.id === selectedLevel)?.label || "Select Level";
  };

  return (
    <div className="relative w-full max-w-md">
      {/* الزر الرئيسي */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`flex items-center justify-between w-full gap-3 px-6 py-5 rounded-full bg-gradient-to-r ${currentColors.main} text-white shadow-lg hover:shadow-xl font-semibold transition-all duration-300 hover:scale-105`}
      >
        <div className="flex items-center gap-2">
          <GraduationCap size={28} className="flex-shrink-0" />
          <span className="text-sm md:text-base truncate">
            {getCurrentLabel()}
          </span>
        </div>
        <ChevronDown
          size={25}
          className={`flex-shrink-0 transition-transform duration-300 ${
            isMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isMenuOpen && (
        <>
          {/* Overlay للإغلاق عند الضغط خارج المنيو */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* القائمة المنسدلة */}
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100 animate-fadeIn">
            {levels.map((level, index) => (
              <button
                key={level.id}
                onClick={() => handleLevelChange(level.id)}
                className={`
                  w-full px-5 py-4 text-left font-semibold transition-all duration-200 flex items-center gap-3
                  ${
                    selectedLevel === level.id
                      ? `bg-gradient-to-r ${currentColors.main} text-white`
                      : `text-gray-700 hover:bg-gradient-to-r hover:${currentColors.hover}`
                  }
                  ${
                    index !== levels.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }
                `}
              >
                {selectedLevel === level.id && (
                  <div className="w-2 h-2 rounded-full bg-white flex-shrink-0"></div>
                )}
                <span className="text-sm md:text-base">{level.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
