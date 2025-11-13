import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import ToggleButtonSelector from "../../components/landingPage/ToggleButton";

export default function MainBanner() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const videoRef = useRef(null);
  const [videoNumber, setVideoNumber] = useState(0);

  const VIDEOS = {
    1: { title: "كلمة أحد خبرائنا", src: "/assets/img/experience.mp4" },
    2: { title: "الفيديو التوضيحي", src: "/assets/img/intro3.mp4" },
    3: { title: "رحلاتنا ومغامرتنا", src: "/assets/img/moghamar.mp4" },
  };

  const openVideo = () => {
    setShowVideoModal(true);
    setTimeout(() => {
      videoRef.current?.play();
    }, 200);
  };

  const closeVideo = () => {
    setShowVideoModal(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // بيانات النجوم (زي ما هي)
  const starsData = [
    { stage: "KG1", route: "/kg1", colors: ["#fca120", "#ff9900"], delay: 1 },
    { stage: "KG2", route: "/kg2", colors: ["#2da9f7", "#4eaaff"], delay: 2 },
    {
      stage: "Prim1",
      route: "/prim1",
      colors: ["#52e65f", "#52e65f"],
      delay: 3,
    },
    {
      stage: "Prim2",
      route: "/prim2",
      colors: ["#A84CFF", "#A84CFF"],
      delay: 4,
    },
    {
      stage: "Prim3",
      route: "/prim3",
      colors: ["#FF4C4C", "#FF4C4C"],
      delay: 5,
    },
    {
      stage: "Prim4",
      route: "/prim4",
      colors: ["#fca17d", "#ff6b6b"],
      delay: 6,
    },
    {
      stage: "Prim5",
      route: "/prim5",
      colors: ["#9893DA", "#9893DA"],
      delay: 7,
    },
    {
      stage: "Prim6",
      route: "/prim6",
      colors: ["#C13333", "#C13333"],
      delay: 8,
    },
  ];

  // زر عام يعاد استخدامه (Icon + Label) علشان نحافظ على نفس الشكل
  const VideoBtn = ({ label, onClick, className = "" }) => (
    <button
      onClick={onClick}
      className={
        "group z-10 flex items-center gap-3 rounded-full px-3 py-2 transition-all duration-300 " +
        className
      }
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center border-[3px] border-white text-white text-[30px] shadow-[0_0_30px_rgba(0,0,0,0.4)] transition-all duration-300 bg-[rgba(255,107,107,0.9)] group-hover:scale-110 group-hover:bg-[#ff6b6b] animate-[pulse-animation_2s_infinite]">
        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M6.5 5.5v9l7-4.5-7-4.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <span className="text-[13px] sm:text-[14px] md:text-[15px] font-bold text-[#282727] transition-colors duration-300 ease-in-out group-hover:text-black px-2 py-1 rounded">
        {label}
      </span>
    </button>
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 px-0 pb-2">
      {/* <Box
        sx={{
          position: "absolute",
          top: "30px",
          left: "75%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
      >
        <ToggleButtonSelector />
      </Box> */}
      {/* زخارف */}
      <img
        src="/assets/img/dida.png"
        alt="dida"
        className="absolute z-10 right-4 bottom-32 w-20 sm:w-24 animate-bounce drop-shadow-lg hidden 2xl:block"
      />
      <img
        src="/assets/img/bini.png"
        alt="bini"
        className="absolute z-10 right-5 top-[5px] w-20 sm:w-24 animate-slideLeft drop-shadow-lg block xl:hidden 2xl:block"
      />
      <img
        src="/assets/img/booy.png"
        alt="booy"
        className="absolute z-10 right-[40%] md:right-[55%] lg:right-[670px] bottom-20 w-20 sm:w-24 animate-bounce drop-shadow-lg hidden 2xl:block"
      />

      <div className="flex flex-col-reverse xl:flex-row items-center justify-between gap-0">
        {/* النصوص */}
        <div className="w-full lg:w-1/2 text-right space-y-4 px-4 sm:px-8 lg:px-2">
          <div className="pointer-container text-gray-800 mt-4 flex items-center justify-center gap-2 px-4 py-2">
            <p className="text-sm md:text-base font-bold mb-1">
              اضغط علي الفصل الدراسي الخاص بالطالب
            </p>
            <i className="bx bxs-hand-down text-3xl text-red-400 animate-bounce"></i>
          </div>

          {/* النجوم */}
          <div className="flex justify-center flex-wrap gap-1">
            {starsData.map((star, i) => (
              <Link
                key={`${star.stage}-${i}`}
                to={star.route}
                className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] animate-bounce hover:scale-110 transition-transform duration-300"
                style={{ animationDelay: `${star.delay * 0.2}s` }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 200 200"
                  className="w-full h-full drop-shadow-xl"
                >
                  <defs>
                    <radialGradient
                      id={`grad-${star.stage}-${i}`}
                      cx="50%"
                      cy="50%"
                      r="50%"
                    >
                      <stop offset="0%" stopColor={star.colors[0]} />
                      <stop offset="100%" stopColor={star.colors[1]} />
                    </radialGradient>
                    <filter id={`glow-${star.stage}-${i}`}>
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <polygon
                    points="100,10 125,75 190,75 140,115 160,180 100,140 40,180 60,115 10,75 75,75"
                    fill={`url(#grad-${star.stage}-${i})`}
                    filter={`url(#glow-${star.stage}-${i})`}
                  />

                  <text
                    x="100"
                    y="115"
                    fontSize={star.stage.length > 4 ? "32" : "34"}
                    fontWeight="900"
                    fill="#ffffff"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    stroke="#000000"
                    strokeWidth="1"
                    fontFamily="Arial Black, sans-serif"
                  >
                    {star.stage}
                  </text>
                </svg>
              </Link>
            ))}
          </div>

          {/* عنوان وفقرات */}
          <h1 className="text-[2rem] sm:text-[2.3rem] lg:text-[2.5rem] font-extrabold text-black mb-[5px] leading-[1.4] text-center font-cairo drop-shadow-sm">
            منصة تعليم أبنائنا المصريين بالخارج بدعم كامل من الذكاء الاصطناعي
          </h1>

          <div className="space-y-3 text-center">
            <p className="mx-auto max-w-[750px] text-[1.02rem] sm:text-[1.05rem] bg-gradient-to-br from-[#f78ca0] to-[#f9748f] text-white p-4 rounded-lg shadow-lg backdrop-blur-sm border border-pink-300/30">
              تحويل محاضرة الفيديو إلى نص مكتوب بعد المحاضرة
              <br />
              <span className="text-sm opacity-90">
                يمكن للطالب التعامل مع المحاضرة المكتوبة بعد إنتهاء المحاضرة
              </span>
            </p>

            <p className="mx-auto max-w-[750px] text-[1.02rem] sm:text-[1.05rem] bg-gradient-to-br from-[#84fab0] to-[#8fd3f4] text-gray-800 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-green-300/30">
              التعامل يشمل بنوك أسئلة واختبارات تقييم
              <br />
              <span className="text-sm">
                مواد تفاعلية بالرسوم المتحركة والأفلام التوضيحية والمعامل
                الافتراضية
              </span>
            </p>

            <p className="mx-auto max-w-[750px] text-[1.02rem] sm:text-[1.05rem] bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb] text-gray-800 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-blue-300/30">
              محاضرون أونلاين على أعلى مستوى
              <br />
              <span className="text-sm ">
                تقوم المنصة بتقييم الطالب وتحلل له نجاحة عند تعلم الدرس
              </span>
            </p>
          </div>
        </div>

        {/* الصورة + أزرار الفيديو */}
        <div className="relative w-full xl:w-1/2 flex flex-col items-center">
          <img
            src="/assets/img/main-banner/education-girl.png"
            alt="girl"
            className="w-full object-contain drop-shadow-2xl"

          />

          {/* === أزرار Overlay على الشاشات المتوسطة فما فوق === */}
          <div className="hidden md:block">
            {/* زر 1 */}
            <div className="absolute md:top-[18%] md:right-[6%] lg:top-[15%] lg:right-[8%]">
              <VideoBtn
                label="كلمة أحد خبرائنا"
                onClick={() => {
                  setVideoNumber(1);
                  openVideo();
                }}
              />
            </div>

            {/* زر 2 */}
            <div className="absolute md:top-[30%] md:right-[6%] lg:top-[25%] lg:right-[8%]">
              <VideoBtn
                label="شاهد الفيديو التوضيحي"
                onClick={() => {
                  setVideoNumber(2);
                  openVideo();
                }}
              />
            </div>

            {/* زر 3 (جديد) */}
            <div className="absolute md:top-[43%] md:right-[6%] lg:top-[35%] lg:right-[8%]">
              <VideoBtn
                label="رحلاتنا ومغامرتنا"
                onClick={() => {
                  setVideoNumber(3);
                  openVideo();
                }}
              />
            </div>
          </div>

          {/* === لوحة أزرار Responsive للموبايل (تحت الصورة) === */}
          <div className="md:hidden mt-4 w-full max-w-md">
            <div className="grid grid-cols-1 gap-3 px-2">
              <VideoBtn
                label="كلمة أحد خبرائنا"
                onClick={() => {
                  setVideoNumber(1);
                  openVideo();
                }}
                className="w-full justify-center"
              />
              <VideoBtn
                label="شاهد الفيديو التوضيحي"
                onClick={() => {
                  setVideoNumber(2);
                  openVideo();
                }}
                className="w-full justify-center"
              />
              <VideoBtn
                label="رحلاتنا ومغامرتنا"
                onClick={() => {
                  setVideoNumber(3);
                  openVideo();
                }}
                className="w-full justify-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* مودال الفيديو */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-4xl w-[95%] md:w-full relative border border-gray-200">
            <button
              onClick={closeVideo}
              className="absolute -top-4 -left-4 md:top-4 md:left-4 z-20 bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg hover:bg-red-600 hover:scale-110 transition-all duration-300"
              aria-label="إغلاق الفيديو"
              title="إغلاق"
            >
              ×
            </button>

            <div className="text-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                {VIDEOS[videoNumber]?.title || ""}
              </h3>
            </div>

            <div className="relative">
              <video
                ref={videoRef}
                controls
                controlsList="nodownload"
                className="w-full rounded-xl shadow-lg"
                style={{ maxHeight: "70vh" }}
              >
                <source src={VIDEOS[videoNumber]?.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
