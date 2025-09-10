import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const lessonsArabic = [
  { title: "درس الحروف الأبجدية", icon: "\u2B50" },
  { title: "درس الأشكال الهندسية", icon: "\u2696" },
  { title: "درس الألوان الأساسية", icon: "\uD83C\uDFA8" },
  { title: "درس أسماء الحيوانات", icon: "\uD83D\uDC31" },
];

const lessonsDiscovery = [
  { title: "The World Around Me", icon: "bxs-planet", video: "assets/img/kg1/lec1.mp4" },
  { title: "Who Am I", icon: "bxs-user-pin", video: "assets/img/kg1/lec2.mp4" },
  { title: "العالم من حولي", icon: "bxs-planet", video: "assets/img/kg1/lec3.mp4" },
];

export default function Prim2() {
  const [subject, setSubject] = useState("intro-arabic");
  const [modalOpen, setModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [showAccentTest, setShowAccentTest] = useState(false);

  const mainVideoRef = useRef(null);
  const lessonVideoRef = useRef(null);

  useEffect(() => {
    if (!mainVideoRef.current) return;
    if (subject === "intro-arabic") {
      mainVideoRef.current.src = "assets/img/Prime2.mp4";
    } else if (subject === "intro-english") {
      // تأكدي من اسم الملف بالضبط (المسافات في الاسم لازم تكون موجودة فعليًا)
      mainVideoRef.current.src = "assets/img/Prime2 Enghlish .mp4";
    } else {
      mainVideoRef.current.src = "assets/img/Back.png";
    }
    setShowAccentTest(subject === "english");
  }, [subject]);

  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-gradient-to-br from-[#f0f5ff] to-[#e6f7ff] font-[Cairo] flex flex-col items-center justify-start p-4 md:p-5"
    >
      {/* Subject Selector */}
      <div className="w-full max-w-[1600px] flex justify-end">
        <div className="md:fixed md:top-6 md:right-6 z-50 flex items-center gap-3 bg-white/90 px-4 py-3 rounded-full shadow-lg">
          <label htmlFor="subjectSelector" className="font-bold text-[#051441] text-xs sm:text-sm">
            اختر المادة
          </label>
          <select
            id="subjectSelector"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-full border border-gray-300 font-bold text-xs sm:text-sm px-3 py-1"
          >
            <option value="intro-arabic">تعريفي عربي</option>
            <option value="intro-english">تعريفي انجليزي</option>
            <option value="arabic">العربية</option>
            <option value="english">English</option>
            <option value="math">الرياضيات</option>
            <option value="science">discovery</option>
          </select>
        </div>
      </div>

      {/* لوحة المحتوى */}
      <div className="flex flex-col md:flex-row flex-nowrap gap-6 md:gap-10 items-stretch justify-center w-full max-w-[1600px] h-auto md:h-[85vh] mt-2 md:mt-10">
        {/* Buttons Column */}
        <div className="flex-[1] flex flex-col justify-center items-center gap-4 md:gap-6 min-w-full md:min-w-[350px] py-4 md:py-5 md:ml-5">
          <Button icon="bx bx-calendar" color="bg-[#5758BB]" onClick={() => window.open("assets/img/prim2.pdf", "_blank")}>
            جدول الفصل الدراسي
          </Button>

          <Button onClick={() => navigate("/login")} icon="bx bx-file-text" color="bg-[#48dbfb]">
            ملخص الحصه
          </Button>

          <Button onClick={() => navigate("/login")} icon="bx bx-chat" color="bg-[#1dd1a1]">
            تحاور مع الحصه
          </Button>

          <Button onClick={() => navigate("/login")} icon="bx bx-world" color="bg-[#ff6b6b]">
            ترجمة الحصة
          </Button>

          {showAccentTest && (
            <Button onClick={() => navigate("/login")} icon="bx bxs-microphone-alt" color="bg-[#5758BB]">
              اختبر نطقك
            </Button>
          )}

          <Button
            color="bg-gradient-to-r from-[#feca57] to-[#ff9f43]"
            textSmall
            onClick={() => {
              setModalOpen(true);
              navigate("/login");
            }}
          >
            مكتبة الرسوم المتحركة
            <br />
            والأفلام التفاعلية
          </Button>
        </div>

        {/* Video Section */}
        <div className="flex-[4] min-w-0 md:min-w-[500px] flex items-center justify-center">
          <div className="relative bg-white rounded-2xl p-3 md:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border w-full h-auto md:h-full flex items-center justify-center">
            <video
              ref={mainVideoRef}
              className="w-full h-full max-h-[60vh] md:max-h-[75vh] rounded-xl object-contain"
              controls
              controlsList="nodownload"
            />
          </div>
        </div>
      </div>

      {/* Lessons Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-3 sm:p-6">
          <div className="bg-white p-5 sm:p-8 rounded-3xl w-full max-w-md sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#ff6b6b] text-white w-8 sm:w-10 h-8 sm:h-10 rounded-full text-xl sm:text-2xl shadow-md"
            >
              ×
            </button>
            <div className="text-center text-[#5758BB] text-xl sm:text-2xl font-extrabold mb-4 sm:mb-6">
              اختر درساً للمشاهدة
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {(subject === "science" ? lessonsDiscovery : lessonsArabic).map((lesson, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between bg-[#f8f9fa] px-4 sm:px-5 py-3 sm:py-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 sm:hover:-translate-y-1 hover:scale-[1.01] sm:hover:scale-[1.02] transition cursor-pointer"
                  onClick={() => {
                    if (lesson.video) {
                      setSelectedVideo(lesson.video);
                      setVideoModalOpen(true);
                      setModalOpen(false);
                    }
                  }}
                >
                  <span className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-bold text-[#333]">
                    {lesson.icon?.startsWith?.("bx") ? (
                      <i className={`bx ${lesson.icon} text-xl sm:text-2xl`} />
                    ) : (
                      <span className="text-xl sm:text-2xl">{lesson.icon}</span>
                    )}
                    {lesson.title}
                  </span>
                  <div className="w-[90px] h-[56px] sm:w-[120px] sm:h-[70px] bg-[#e9ecef] rounded-lg flex items-center justify-center text-[#888] text-xl sm:text-2xl">
                    <i className="bx bx-play-circle" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-3 sm:p-6">
          <div className="bg-black p-3 sm:p-5 w-full max-w-xl sm:max-w-2xl md:max-w-3xl relative rounded-xl">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-3 left-3 bg-[#ff6b6b] text-white w-8 sm:w-10 h-8 sm:h-10 rounded-full text-xl sm:text-2xl shadow-md"
            >
              ×
            </button>
            <div className="w-full aspect-video">
              <video ref={lessonVideoRef} className="rounded-xl w-full h-full" controls controlsList="nodownload" autoPlay>
                <source src={selectedVideo} type="video/mp4" />
                المتصفح لا يدعم تشغيل الفيديو
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Button({ children, icon, color = "bg-gray-400", textSmall = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white font-extrabold rounded-full shadow-md hover:scale-[1.03] hover:shadow-xl transition duration-300 w-full md:w-[300px] h-12 sm:h-[56px] px-4 flex items-center justify-center gap-2 text-center ${
        textSmall ? "text-[14px] sm:text-[15px] leading-snug" : "text-[15px] sm:text-[16px]"
      }`}
    >
      {icon && <i className={`${icon} text-lg sm:text-xl`}></i>}
      <span className="leading-snug text-center">{children}</span>
    </button>
  );
}
