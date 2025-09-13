import Footer from "../../components/main/Footer";
import MainBanner from "./MainBanner";
import Navbar from "../../components/main/Navbar";
import PricingSection from "./PricingSection";
import Testimonials from "./Testimonials";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function HomePage() {
  const pricingRef = useRef(null);
  const location = useLocation();
  const [showTrialBanner, setShowTrialBanner] = useState(true);

  useEffect(() => {
    if (location.hash === "#pricing" && pricingRef.current) {
      pricingRef.current.scrollIntoView({ behavior: "smooth" });
    }
    console.log(location);
    console.log(pricingRef);
  }, [location, pricingRef]);

  const closeBanner = () => {
    setShowTrialBanner(false);
  };

  return (
    <>
      {/* Trial Banner Overlay */}
      {showTrialBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative bg-gradient-to-r from-orange-500/90 to-orange-600/90 backdrop-blur-md rounded-2xl p-8 mx-4 max-w-2xl w-full shadow-2xl border border-orange-300/30">
            {/* Animated Stars */}
            {/*<div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute top-4 left-4 text-yellow-300 animate-pulse">⭐</div>
              <div className="absolute top-6 right-8 text-yellow-300 animate-bounce">⭐</div>
              <div className="absolute bottom-8 left-8 text-yellow-300 animate-pulse">⭐</div>
              <div className="absolute bottom-4 right-4 text-yellow-300 animate-bounce">⭐</div>
              <div className="absolute top-1/2 left-1/4 text-yellow-300 animate-pulse">⭐</div>
              <div className="absolute top-1/3 right-1/4 text-yellow-300 animate-bounce">⭐</div>
            </div>*/}

            {/* Close Button */}
            <button
              onClick={closeBanner}
              className="absolute top-4 right-4 text-white hover:text-orange-200 transition-colors duration-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
            >
              ×
            </button>

            {/* Banner Content */}
            <div className="text-center relative z-10">
              <div className="mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  تشغيل تجريبي
                </h2>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-xl md:text-2xl font-semibold text-white drop-shadow-md">
                    يبدأ التسجيل
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-yellow-300 mt-2 drop-shadow-lg">
                    25-9-2025
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-white/90 text-lg mb-4 drop-shadow-md">
                  كن من أول المستفيدين من منصتنا التعليمية المبتكرة
                </p>
                <button
                  onClick={closeBanner}
                  className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  ابدأ الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navbar />

      {/* Hero Section with enhanced styling */}
      <div className="relative">
        <MainBanner />
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10 pointer-events-none"></div>
      </div>

      {/* Who Are We Section with professional touches */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative">
          {/* Logo section with enhanced styling */}
          <div className="flex justify-center relative">
            <div className="relative w-80 h-80 rounded-full border-8 border-gradient-to-r from-orange-500 to-orange-600 shadow-2xl bg-white flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 animate-pulse"></div>
              <div className="w-64 h-64 rounded-full overflow-hidden relative z-10 shadow-inner">
                <img
                  src="/assets/img/Logoo.png"
                  alt="Edu-Smart Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Floating dots */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full animate-bounce"></div>
              <div
                className="absolute -bottom-2 -left-2 w-3 h-3 bg-orange-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>

          {/* Content section with enhanced typography */}
          <div className="text-right space-y-6">
            <div className="inline-flex items-center bg-orange-100 px-4 py-2 rounded-full">
              <span className="text-orange-600 font-bold text-lg">من نحن</span>
            </div>

            <h3 className="text-4xl font-bold text-[#051441] leading-tight">
              نحن <span className="text-orange-600">edu-smart.ai</span>
            </h3>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg font-medium">
                أكاديمية تعليمية رقمية تأسست على يد مجموعة من الخبراء
                والإستشاريين المتخصصين في التعليم قبل الجامعي وبعده، لنربط
                أولادنا المصريين في الخارج بجذورهم من خلال تجربة تعليمية عصرية
                ومرنة.
              </p>

              <p className="text-gray-700 leading-relaxed text-lg">
                نعتمد الذكاء الاصطناعي والتقنيات التفاعلية لنقدّم مناهج مصرية
                معتمدة بأسلوب يُنمي الشخصية ويؤهّل قادة المستقبل.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-orange-100">
              <ul className="text-gray-700 list-inside space-y-3">
                {[
                  "نخبة من الخبراء والاستشاريين في التعليم المصري داخل وخارج مصر.",
                  "أكاديمية تعليم عن بُعد بروح مصرية أصيلة.",
                  "نستخدم الذكاء الاصطناعي لتخصيص المحتوى وتطوير تجربة التعلم.",
                  "نقدم مناهج مصرية معتمدة بأساليب حديثة وتفاعلية.",
                  "نُنمّي المهارات الشخصية ونُهيّئ الطلاب لأداء الإختبارات بالمراحل التعليمية المختلفة داخل مصر وخارجها.",
                  "ممكن للطالب الالتحاق فى أى فصل دراسي.",
                  "المساعدة فى التسجيل بالسفارة المصرية وحتى الحصول على الشهادة.",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-500 font-bold ml-2 mt-1">
                      •
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section with enhanced cards */}
      <section className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-orange-50/30"></div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-orange-100 px-6 py-3 rounded-full mb-4">
              <span className="text-orange-600 font-bold text-lg">
                ماذا نقدم؟
              </span>
            </div>
            <h2 className="text-4xl font-bold text-[#051441] leading-tight">
              تجربة تعليمية متكاملة لأبنائكم
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                img: "/assets/img/class.png",
                title: "فصول افتراضية تفاعلية",
                desc: "لقاءات مباشرة مع المعلمين تتيح للطلاب التفاعل وطرح الأسئلة والمشاركة في النقاشات، تمامًا كما في الفصول الدراسية التقليدية.",
                color: "from-blue-500 to-blue-600",
              },
              {
                img: "/assets/img/robot.png",
                title: "مساعد ذكاء اصطناعي",
                desc: "أداة ذكية لمساعدة الطلاب في حل الواجبات، شرح النقاط الصعبة، وتقديم تمارين إضافية تتناسب مع مستوى كل طالب.",
                color: "from-purple-500 to-purple-600",
              },
              {
                img: "/assets/img/rec.png",
                title: "حصص مسجلة",
                desc: "جميع المحاضرات مسجلة ومتاحة للمشاهدة في أي وقت، مما يسهل على الطلاب مراجعة الدروس والاستعداد للامتحانات.",
                color: "from-green-500 to-green-600",
              },
              {
                img: "/assets/img/film.png",
                title: "أفلام تعليمية ورسوم متحركة",
                desc: "نستخدم أحدث الوسائل البصرية من أفلام ورسوم متحركة لتبسيط المعلومات وجعل عملية التعلم أكثر متعة وتشويقًا.",
                color: "from-red-500 to-red-600",
              },
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 text-right border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2">
                  {/* Top gradient line */}
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} rounded-t-xl`}
                  ></div>

                  <div className="relative overflow-hidden rounded-lg mb-6 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <img
                      src={feature.img}
                      alt={feature.title}
                      className="w-full h-44 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>

                  <h3 className="text-xl font-bold text-orange-600 mb-3 group-hover:text-orange-700 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.desc}
                  </p>

                  {/* Decorative corner */}
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-orange-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section with enhanced wrapper */}
      <section ref={pricingRef} id="pricing" className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
        <div className="relative">
          <PricingSection />
        </div>
      </section>

      {/* Testimonials Section */}
      {/*<Testimonials/>*/}

      {/* Footer with enhanced styling */}
      <div className="relative">
        <Footer />

        {/* Enhanced Copyright Section */}
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 py-6 text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <div
              className="absolute bottom-0 right-1/4 w-1 h-1 bg-orange-400 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="text-center">
              <p className="text-gray-300 text-sm leading-relaxed">
                حقوق النشر © 2024 Edu-Smart. جميع الحقوق محفوظة بواسطة{" "}
                <a
                  href="https://envytheme.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400 transition-colors duration-300 font-semibold hover:underline"
                >
                  Edu-Smart.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
