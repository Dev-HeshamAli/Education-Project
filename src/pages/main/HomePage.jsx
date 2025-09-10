import Footer from "../../components/main/Footer";
import MainBanner from "./MainBanner";
import Navbar from "../../components/main/Navbar";
import PricingSection from "./PricingSection";
import Testimonials from "./Testimonials";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
export default function HomePage() {
  const pricingRef = useRef(null);
  const location = useLocation();

useEffect(() => {
  if (location.hash === "#pricing" && pricingRef.current) {
    pricingRef.current.scrollIntoView({ behavior: "smooth" });
  }
  console.log(location);
  console.log(pricingRef);
}, [location,pricingRef]);
  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <MainBanner/>
      {/* Who Are We Section */}
      {/* Who Are We Section (مطابق للتصميم القديم بالتفصيل) */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* صورة لوجو بشكل دائري */}
            <div className="flex justify-center">
              <div className="relative w-72 h-72 rounded-full border-8 border-orange-600 flex items-center justify-center">
                <div className="w-56 h-56 rounded-full overflow-hidden">
                  <img src="/assets/img/Logoo.png" alt="Edu-Smart Logo" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            {/* محتوى النص */}
            <div className="text-right">
              <span className="text-orange-600 font-bold text-lg">من نحن</span>
              <h3 className="text-3xl font-bold text-[#051441] mt-2 mb-4">نحن edu-smart.ai</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                أكاديمية تعليمية رقمية تأسست على يد مجموعة من الخبراء والإستشاريين المتخصصين في التعليم قبل الجامعي وبعده، لنربط أولادنا المصريين في الخارج بجذورهم من خلال تجربة تعليمية عصرية ومرنة.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                نعتمد الذكاء الاصطناعي والتقنيات التفاعلية لنقدّم مناهج مصرية معتمدة بأسلوب يُنمي الشخصية ويؤهّل قادة المستقبل.
              </p>
              <ul className="text-gray-700 list-inside list-decimal space-y-2">
                <li>نخبة من الخبراء والاستشاريين في التعليم المصري داخل وخارج مصر.</li>
                <li>أكاديمية تعليم عن بُعد بروح مصرية أصيلة.</li>
                <li>نستخدم الذكاء الاصطناعي لتخصيص المحتوى وتطوير تجربة التعلم.</li>
                <li>نقدم مناهج مصرية معتمدة بأساليب حديثة وتفاعلية.</li>
                <li>نُنمّي المهارات الشخصية ونُهيّئ الطلاب لأداء الإختبارات بالمراحل التعليمية المختلفة داخل مصر وخارجها.</li>
                <li>ممكن للطالب الالتحاق فى أى فصل دراسي.</li>
                <li>المساعدة فى التسجيل بالسفارة المصرية وحتى الحصول على الشهادة.</li>
              </ul>
            </div>
          </div>
        </section>


     {/* What We Offer Section - نسخة مطورة من القديمة */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <span className="text-orange-600 font-bold text-lg">ماذا نقدم؟</span>
            <h2 className="text-3xl font-bold text-[#051441] mt-2">تجربة تعليمية متكاملة لأبنائكم</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow hover:shadow-lg transition-all text-right">
              <img src="/assets/img/class.png" alt="فصول افتراضية" className="w-full h-44 mb-4 object-fit-cover " />
              <h3 className="text-lg font-bold text-orange-600 mb-2">فصول افتراضية تفاعلية</h3>
              <p className="text-gray-600 text-sm">
                لقاءات مباشرة مع المعلمين تتيح للطلاب التفاعل وطرح الأسئلة والمشاركة في النقاشات، تمامًا كما في الفصول الدراسية التقليدية.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow hover:shadow-lg transition-all text-right">
              <img src="/assets/img/robot.png" alt="مساعد ذكاء اصطناعي" className="w-full h-44 mb-4 object-fit-cover" />
              <h3 className="text-lg font-bold text-orange-600 mb-2">مساعد ذكاء اصطناعي</h3>
              <p className="text-gray-600 text-sm">
                أداة ذكية لمساعدة الطلاب في حل الواجبات، شرح النقاط الصعبة، وتقديم تمارين إضافية تتناسب مع مستوى كل طالب.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow hover:shadow-lg transition-all text-right">
              <img src="/assets/img/rec.png" alt="حصص مسجلة" className="w-full h-44 mb-4 object-fit-cover" />
              <h3 className="text-lg font-bold text-orange-600 mb-2">حصص مسجلة</h3>
              <p className="text-gray-600 text-sm">
                جميع المحاضرات مسجلة ومتاحة للمشاهدة في أي وقت، مما يسهل على الطلاب مراجعة الدروس والاستعداد للامتحانات.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow hover:shadow-lg transition-all text-right">
              <img src="/assets/img/film.png" alt="أفلام تعليمية" className="w-full h-44 mb-4 object-fit-cover" />
              <h3 className="text-lg font-bold text-orange-600 mb-2">أفلام تعليمية ورسوم متحركة</h3>
              <p className="text-gray-600 text-sm">
                نستخدم أحدث الوسائل البصرية من أفلام ورسوم متحركة لتبسيط المعلومات وجعل عملية التعلم أكثر متعة وتشويقًا.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Pricing Section */}
      <section ref={pricingRef} id="pricing">
           <PricingSection/>
      </section>
      
      {/* Testimonials Section */}
      {/*<Testimonials/>*/}

      {/* Footer */}
      <Footer />

      {/* End of HomePage */}
      <div className="bg-gray-900 py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-200">
            <p>
              حقوق النشر © 2024 Edu-Smart. جميع الحقوق محفوظة بواسطة{" "}
              <a
                href="https://envytheme.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
               Edu-Smart.ai
              </a>
            </p>
          </div>
        </div>
      </div>

    </>
  );
}
