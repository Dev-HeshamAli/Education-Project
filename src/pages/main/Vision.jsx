import { useEffect } from "react";
import Footer from "../../components/main/Footer";
import Navbar from "../../components/main/Navbar";

export default function Vision() {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = "ar";
    html.dir = "rtl";
    html.classList.add("theme-light");
  }, []);

  return (
    <main className="bg-gray-100 ">
    <Navbar/>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <img src="/assets/img/Logoo.png" alt="Edu-Smart Logo" className="mx-auto max-h-32 mb-6" />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-[#e52e71] border-b pb-2 mb-4">الرؤية</h3>
            <p className="leading-8 text-gray-800">
              أن تكون edu-smart.ai أول أكاديمية تعليمية تستخدم مميزات الذكاء الاصطناعى فى أليات التعليم...
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-[#e52e71] border-b pb-2 mb-4">الرسالة</h3>
            <p className="leading-8 text-gray-800 mb-4">
              edu-smart.ai وُلدت من قلب الحنين، من لهفة أمهات وآباء عايشين برّه...
            </p>
            <p className="leading-8 text-gray-800 mb-4">
              علشان أولادنا يتعلموا، يتطوروا، ويكبروا وهما متمسكين بهويتهم...
            </p>
            <h4 className="text-lg font-semibold mt-6 mb-3">النقاط الأساسية لرسالتنا</h4>
            <ul className="list-none pr-0 space-y-3">
              {["الفكرة: تعليم مصري يصل لأولادنا بالخارج بدون غربة.", "الأسلوب: مدرسة عن بُعد بروح مصرية...", "التقنية: الذكاء الاصطناعي لتخصيص...", "المهارات: أنشطة تفاعلية لتنمية...", "التأهيل: استعداد للامتحانات...", "الهوية: بيت مصري صغير في الغربة..."]
                .map((item, i) => (
                  <li key={i} className="relative pr-12 text-gray-700">
                    <span className="absolute right-0 top-0 w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-600 text-white rounded-full flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-[#e52e71] border-b pb-2 mb-4">الأهداف</h3>
            <p className="leading-8 text-gray-800 mb-4">نهدف فى edu-smart.ai إلى:</p>
            <ul className="list-none pr-0 space-y-3">
              {["تقديم تعليم مصري مبتكر يناسب طبيعة أبنائنا...", "استخدام الذكاء الاصطناعي والتقنيات الحديثة...", "إعداد الطلاب أكاديميًا وتربويًا للنجاح...", "تنمية المهارات المستقبلية والشخصية...", "بناء جسر تربوي وثقافي يصل بين مصر..."]
                .map((item, i) => (
                  <li key={i} className="relative pr-12 text-gray-700">
                    <span className="absolute right-0 top-0 w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-600 text-white rounded-full flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
            </ul>
          </div>

          <div className="bg-[#fff9e6] border-r-4 border-yellow-400 rounded-xl shadow p-8">
            <h3 className="text-xl font-bold text-yellow-700 mb-4">من أين بدأت الفكرة؟</h3>
            <p className="leading-8 text-gray-800">
              بدأت edu-smart.ai وإحنا عايشين برّه مصر. من لحظة احتياج صادق حسّينا بيه...
            </p>
          </div>
        </div>
      </section>
      <Footer />
      {/* End of HomePage */}
      <div className="bg-gray-900 py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-200">
            <p>
              حقوق النشر © 2025 Edu-Smart. جميع الحقوق محفوظة بواسطة{" "}
              <a
                href="https://edu-smart.ai"
                className="text-orange-600 hover:underline"
              >
               Edu-Smart.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
