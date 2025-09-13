import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const lessonsArabic = [
  { title: "درس الحروف الأبجدية", icon: "\u2B50" },
  { title: "درس الأشكال الهندسية", icon: "\u2696" },
  { title: "درس الألوان الأساسية", icon: "\uD83C\uDFA8" },
  { title: "درس أسماء الحيوانات", icon: "\uD83D\uDC31" },
];

const lessonsDiscovery = [
  {
    title: "The World Around Me",
    icon: "bxs-planet",
    video: "assets/img/kg1/lec1.mp4",
  },
  { title: "Who Am I", icon: "bxs-user-pin", video: "assets/img/kg1/lec2.mp4" },
  {
    title: "العالم من حولي",
    icon: "bxs-planet",
    video: "assets/img/kg1/lec3.mp4",
  },
];

export default function Prim1() {
  const [subject, setSubject] = useState("arabic");
  const [modalOpen, setModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [showAccentTest, setShowAccentTest] = useState(false);

  const mainVideoRef = useRef(null);
  const lessonVideoRef = useRef(null);

  useEffect(() => {
    if (!mainVideoRef.current) return;
    if (subject === "arabic") {
      mainVideoRef.current.src = "assets/img/subjects/Arabic.mp4";
    } else if (subject === "english") {
      mainVideoRef.current.src = "assets/img/subjects/English.mp4";
    } else if (subject === "science") {
      mainVideoRef.current.src = "assets/img/subjects/Discovery.mp4";
    } else {
      mainVideoRef.current.src = "assets/img/Back.png";
    }
    setShowAccentTest(subject === "english");
  }, [subject]);

  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-gradient-to-br from-[#f0f5ff] to-[#e6f7ff] font-[Cairo] flex flex-col items-center justify-start p-4"
    >
      {/* Subject Selector */}
      <div className="w-full max-w-[1600px] flex justify-end">
        <div className="xl:fixed xl:top-6 xl:right-6 z-50 flex items-center gap-3 bg-white/90 px-4 py-3 rounded-full shadow-lg ">
          <label
            htmlFor="subjectSelector"
            className="font-bold text-[#051441] text-xs sm:text-sm"
          >
            اختر المادة
          </label>
          <select
            id="subjectSelector"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-full border border-gray-300 font-bold text-xs sm:text-sm px-3 py-1"
          >
            <option value="arabic">العربية</option>
            <option value="english">English</option>
            <option value="science">discovery</option>
          </select>
        </div>
      </div>

      {/* لوحة المحتوى مع تحسينات للتابلت */}
      <div className="flex flex-col xl:flex-row gap-4 lg:gap-6 xl:gap-10 items-stretch justify-center w-full max-w-[1600px] mt-2 lg:mt-6 xl:mt-10">
        {/* الأزرار - تخطيط محسن للتابلت */}
        <div className="flex-none xl:flex-[1] order-2 xl:order-1 mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:flex xl:flex-col gap-3 lg:gap-4 xl:gap-6 justify-center items-center xl:min-w-[350px] py-2 lg:py-4 xl:py-5">
            <Button
              icon="bx bx-calendar"
              color="bg-[#5758BB]"
              onClick={() => window.open("assets/img/prim1.pdf", "_blank")}
            >
              جدول الفصل الدراسي
            </Button>

            <Button
              onClick={() => navigate("/login")}
              icon="bx bx-file-text"
              color="bg-[#48dbfb]"
            >
              ملخص الحصه
            </Button>

            <Button
              onClick={() => navigate("/login")}
              icon="bx bx-chat"
              color="bg-[#1dd1a1]"
            >
              تحاور مع الحصه
            </Button>

            <Button
              onClick={() => navigate("/login")}
              icon="bx bx-world"
              color="bg-[#ff6b6b]"
            >
              ترجمة الحصة
            </Button>

            <Button
              onClick={() => navigate("/login")}
              icon="bx bx-check-circle"
              color="bg-[#10ac84]"
            >
              اختبار على الحصة
            </Button>

            {showAccentTest && (
              <Button
                onClick={() => navigate("/login")}
                icon="bx bxs-microphone-alt"
                color="bg-[#5758BB]"
              >
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
        </div>

        {/* الفيديو الرئيسي */}
        <div className="flex-1 xl:flex-[4] order-1 xl:order-2 min-w-0">
          <div className="relative bg-white rounded-2xl p-3 lg:p-4 xl:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border h-full flex items-center justify-center">
            <video
              ref={mainVideoRef}
              className="w-full h-full max-h-[50vh] sm:max-h-[55vh] lg:max-h-[65vh] xl:max-h-[75vh] rounded-xl object-contain"
              controls
              controlsList="nodownload"
            />
          </div>
        </div>
      </div>

      {/* مودال الدروس */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-3 sm:p-6">
          <div className="bg-white p-5 sm:p-8 rounded-3xl w-full max-w-md sm:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#ff6b6b] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xl sm:text-2xl shadow-md hover:bg-[#ff5252] transition-colors"
            >
              ×
            </button>
            <div className="text-center text-[#5758BB] text-xl sm:text-2xl font-extrabold mb-4 sm:mb-6">
              اختر درساً للمشاهدة
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {(subject === "science" ? lessonsDiscovery : lessonsArabic).map(
                (lesson, idx) => (
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
                        <i
                          className={`bx ${lesson.icon} text-xl sm:text-2xl`}
                        />
                      ) : (
                        <span className="text-xl sm:text-2xl">
                          {lesson.icon}
                        </span>
                      )}
                      {lesson.title}
                    </span>
                    <div className="w-[90px] h-[56px] sm:w-[120px] sm:h-[70px] bg-[#e9ecef] rounded-lg flex items-center justify-center text-[#888] text-xl sm:text-2xl">
                      <i className="bx bx-play-circle" />
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}

      {/* مشغل فيديو الدرس */}
      {videoModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-3 sm:p-6">
          <div className="bg-black p-3 sm:p-5 w-full max-w-xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl relative rounded-xl">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-3 left-3 bg-[#ff6b6b] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xl sm:text-2xl shadow-md hover:bg-[#ff5252] transition-colors z-10"
            >
              ×
            </button>
            <div className="w-full aspect-video">
              <video
                ref={lessonVideoRef}
                className="rounded-xl w-full h-full"
                controls
                controlsList="nodownload"
                autoPlay
              >
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

function Button({
  children,
  icon,
  color = "bg-gray-400",
  textSmall = false,
  onClick,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white font-extrabold rounded-full shadow-md hover:scale-[1.03] hover:shadow-xl transition duration-300 
        w-full 
        h-11 sm:h-12 lg:h-14 xl:h-[56px] 
        xl:w-[300px] 
        px-3 lg:px-4 
        flex items-center justify-center gap-1 sm:gap-2 text-center 
        ${
          textSmall
            ? "text-[12px] sm:text-[13px] lg:text-[14px] xl:text-[15px] leading-tight"
            : "text-[13px] sm:text-[14px] lg:text-[15px] xl:text-[16px]"
        } 
        ${className}`}
    >
      {icon && <i className={`${icon} text-base sm:text-lg lg:text-xl`}></i>}
      <span className="leading-tight text-center">{children}</span>
    </button>
  );
}
