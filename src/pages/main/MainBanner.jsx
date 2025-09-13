import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function MainBanner() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const videoRef = useRef(null);

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

  return (
    <div className="relative overflow-hidden bg-gray-200 px-4 ">
      {/* الزينة المتحركة */}
      <img src="/assets/img/dida.png" alt="dida" className="absolute right-4 bottom-32 w-24 animate-bounce" />
      <img src="/assets/img/bini.png" alt="bini" className="absolute right-5 top-8 w-24 animate-slideLeft" />
      <img src="/assets/img/booy.png" alt="booy" className="absolute right-[670px] bottom-20 w-24 animate-bounce" />
      {/*<img src="/assets/img/teacher.png" alt="teacher" className="absolute right-14 top-12 w-12 md:w-16" />*/}

      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        {/* النصوص */}
        <div className="w-full lg:w-1/2 text-right space-y-4 px-10">
          <div className="pointer-container text-gray-800 mt-4 flex items-center justify-center gap-2">
            <p className="text-sm md:text-base font-bold mb-1">اضغط علي الفصل الدراسي الخاص بالطالب</p>
            <i className="bx bxs-hand-down text-3xl text-red-400 animate-bounce"></i>
          </div>




          {/* النجوم */}
         {/* <div className="flex justify-center flex-wrap gap-3">
            {["KG1", "KG2", "Prim1", "Prim2", "Prim3", "Prim4"].map((stage, i) => (
              <a
                key={stage}
                href={`/${stage.toLowerCase()}`}
                className="w-20 h-20 animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <radialGradient id={`grad-${i}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fca17d" />
                      <stop offset="100%" stopColor="#ff6b6b" />
                    </radialGradient>
                    <filter id={`glow-${i}`}>
                      <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <polygon
                    points="100,10 120,75 190,75 135,115 155,180 100,140 45,180 65,115 10,75 80,75"
                    fill={`url(#grad-${i})`}
                    filter={`url(#glow-${i})`}
                  />
                  <text
                    x="100"
                    y="115"
                    fontSize="28"
                    fontWeight="bold"
                    fill="#fff"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {stage}
                  </text>
                </svg>
              </a>
            ))}

            
          </div>
          */}
               <div className="flex justify-center flex-wrap gap-3">
              {["KG1"].map((stage, i) => (
        <Link
          key={`${stage}-${i}`}
          to={"/kg1"}
          className="w-20 h-20 animate-bounce"
          style={{ animationDelay: `${1 * 0.2}s` }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <radialGradient id={`grad-${stage}-${i}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fca120" />
                <stop offset="100%" stopColor="#ff9900" />
              </radialGradient>
              <filter id={`glow-${stage}-${i}`}>
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <polygon
              points="100,10 120,75 190,75 135,115 155,180 100,140 45,180 65,115 10,75 80,75"
              fill={`url(#grad-${stage}-${i})`}
              filter={`url(#glow-${stage}-${i})`}
            />
            <text
              x="100"
              y="115"
              fontSize="38"
              fontWeight="bold"
              fill="#fff"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {stage}
            </text>
          </svg>
        </Link>
              ))}

              {["KG2"].map((stage, i) => (
                <Link
                  key={`${stage}-${i}`}
                  to={"/kg2"}
                  className="w-20 h-20 animate-bounce"
                  style={{ animationDelay: `${2 * 0.2}s` }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <radialGradient id={`grad-${stage}-${i}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#2da9f7" />
                        <stop offset="100%" stopColor="#4eaaff" />
                      </radialGradient>
                      <filter id={`glow-${stage}-${i}`}>
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <polygon
                      points="100,10 120,75 190,75 135,115 155,180 100,140 45,180 65,115 10,75 80,75"
                      fill={`url(#grad-${stage}-${i})`}
                      filter={`url(#glow-${stage}-${i})`}
                    />
                    <text
                      x="100"
                      y="115"
                      fontSize="38"
                      fontWeight="bold"
                      fill="#fff"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {stage}
                    </text>
                  </svg>
                </Link>
              ))}

              {["Prim1"].map((stage, i) => (
                <Link
                  key={`${stage}-${i}`}
                  to={"/prim1"}
                  className="w-20 h-20 animate-bounce"
                  style={{ animationDelay: `${3 * 0.2}s` }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <radialGradient id={`grad-${stage}-${i}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#52e65f" />
                        <stop offset="100%" stopColor="#52e65f" />
                      </radialGradient>
                      <filter id={`glow-${stage}-${i}`}>
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <polygon
                      points="100,10 120,75 190,75 135,115 155,180 100,140 45,180 65,115 10,75 80,75"
                      fill={`url(#grad-${stage}-${i})`}
                      filter={`url(#glow-${stage}-${i})`}
                    />
                    <text
                      x="100"
                      y="115"
                      fontSize="34"
                      fontWeight="bold"
                      fill="#fff"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {stage}
                    </text>
                  </svg>
                </Link>
              ))}

              {["Prim2"].map((stage, i) => (
                <Link
                  key={`${stage}-${i}`}
                  to={"/prim2"}
                  className="w-20 h-20 animate-bounce"
                  style={{ animationDelay: `${4 * 0.2}s` }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <radialGradient id={`grad-${stage}-${i}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#A84CFF" />
                        <stop offset="100%" stopColor="#A84CFF" />
                      </radialGradient>
                      <filter id={`glow-${stage}-${i}`}>
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <polygon
                      points="100,10 120,75 190,75 135,115 155,180 100,140 45,180 65,115 10,75 80,75"
                      fill={`url(#grad-${stage}-${i})`}
                      filter={`url(#glow-${stage}-${i})`}
                    />
                    <text
                      x="100"
                      y="115"
                      fontSize="34"
                      fontWeight="bold"
                      fill="#fff"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {stage}
                    </text>
                  </svg>
                </Link>
              ))}

              {["Prim3"].map((stage, i) => (
                <Link
                  key={`${stage}-${i}`}
                  to={"/prim3"}
                  className="w-20 h-20 animate-bounce"
                  style={{ animationDelay: `${5 * 0.2}s` }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <radialGradient id={`grad-${stage}-${i}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FF4C4C" />
                        <stop offset="100%" stopColor="#FF4C4C" />
                      </radialGradient>
                      <filter id={`glow-${stage}-${i}`}>
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <polygon
                      points="100,10 120,75 190,75 135,115 155,180 100,140 45,180 65,115 10,75 80,75"
                      fill={`url(#grad-${stage}-${i})`}
                      filter={`url(#glow-${stage}-${i})`}
                    />
                    <text
                      x="100"
                      y="115"
                      fontSize="34"
                      fontWeight="bold"
                      fill="#fff"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {stage}
                    </text>
                  </svg>
                </Link>
              ))}

              {["Prim4"].map((stage, i) => (
                <Link
                  key={`${stage}-${i}`}
                  to={"/prim4"}
                  className="w-20 h-20 animate-bounce"
                  style={{ animationDelay: `${6 * 0.2}s` }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <radialGradient id={`grad-${stage}-${i}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fca17d" />
                        <stop offset="100%" stopColor="#ff6b6b" />
                      </radialGradient>
                      <filter id={`glow-${stage}-${i}`}>
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <polygon
                      points="100,10 120,75 190,75 135,115 155,180 100,140 45,180 65,115 10,75 80,75"
                      fill={`url(#grad-${stage}-${i})`}
                      filter={`url(#glow-${stage}-${i})`}
                    />
                    <text
                      x="100"
                      y="115"
                      fontSize="34"
                      fontWeight="bold"
                      fill="#fff"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {stage}
                    </text>
                  </svg>
                </Link>
              ))}

          </div>





          {/* العنوان والفقرات */}
         <h1 className="text-[2.5rem] font-extrabold text-black mb-[5px] leading-[1.4] text-center font-cairo">
            منصة تعليم أبنائنا المصريين بالخارج بدعم كامل من الذكاء الاصطناعي
          </h1>
          <div className="space-y-2 text-center">
            <p className="max-w-[750px] text-[1.05rem] bg-gradient-to-br from-[#f78ca0] to-[#f9748f] text-white p-3 rounded-lg">
               تحويل محاضرة الفيديو إلى نص مكتوب بعد المحاضرة
               <br/>
            <p>يمكن للطالب التعامل مع المحاضرة المكتوبة بعد إنتهاء المحاضرة</p>
            </p>

         <p className="max-w-[750px] text-[1.05rem] bg-gradient-to-br from-[#84fab0] to-[#8fd3f4] text-gray-800 p-3 rounded-lg">
            التعامل يشمل بنوك أسئلة واختبارات تقييم<br />
            مواد تفاعلية بالرسوم المتحركة والأفلام التوضيحية والمعامل الافتراضية
          </p>

          <p className="max-w-[900px] text-[1.05rem] bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb] text-gray-800 p-3 rounded-lg">
            محاضرون أونلاين على أعلى مستوى<br />
            تقوم المنصة بتقييم الطالب وتحلل له نجاحة عند تعلم الدرس
          </p>

          </div>
        </div>

        <div className="relative w-full lg:w-1/2 flex justify-center">
          <img src="/assets/img/main-banner/education-girl.png" alt="girl" className="w-full" />
        <button
          onClick={openVideo}
          className="group absolute top-[30%] right-[8%] z-10 flex items-center gap-2"
        >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center border-[3px] border-white text-white text-[30px]
                          shadow-[0_0_25px_rgba(0,0,0,0.3)] transition-all duration-300
                          bg-[rgba(255,107,107,0.85)] group-hover:scale-110 group-hover:bg-[#ff6b6b]
                          animate-[pulse-animation_2s_infinite]"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.5 5.5v9l7-4.5-7-4.5z" clipRule="evenodd" />
                </svg>
              </div>

              <span
                className=" text-[15px] font-bold text-[#333] transition-colors duration-300 ease-in-out
                          group-hover:text-black"
                style={{ textShadow: "0px 1px 3px rgba(255, 255, 255, 0.7)" }}
              >
                شاهد الفيديو التوضيحي
              </span>
         </button>

            </div>
          </div>

      {/* ✅ الفيديو داخل مودال */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full relative">
            <button
              onClick={closeVideo}
              className="absolute top-2 left-2 text-2xl text-red-500 font-bold "
            >
              {/**bg-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-100 */}
              ×
            </button>
              <video ref={videoRef} controls controlsList="nodownload" className="w-full rounded-lg">

              <source src="/assets/img/1840.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
