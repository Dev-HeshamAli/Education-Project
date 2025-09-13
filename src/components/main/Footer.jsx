import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState(null);

  const handlePricing = (e) => {
    if (location.pathname !== "/home") return;
    e.preventDefault();
    const el = document.querySelector("#pricing");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.location.hash !== "#pricing") history.replaceState(null, "", "#pricing");
  };

  // فتح المودال لأي سياسة
  const openPolicy = (title, body) => {
    setModalTitle(title);
    setModalBody(body);
    setModalOpen(true);
  };

  return (
    <section id="footer" className="footer-area pt-20 pb-16 bg-gray-950" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-right">
          {/* Logo + desc + socials */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              <span className="cursor-default">Edu-Smart</span>
            </h2>
            <p className="text-white/85 mb-4 text-sm">
              منصة تعليمية رائدة للمصريين في الخارج، نقدم المنهج المصري بحب وشغف.
            </p>
            <ul className="flex justify-end gap-4 text-xl text-white">
              <li><a href="https://www.tiktok.com/@aprofdrhamdimahmo?lang=en" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><i className="bx bxl-tiktok"></i></a></li>
              <li><a href="https://www.facebook.com/share/1E8kCchNTU/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bx bxl-facebook"></i></a></li>
              <li><a href="https://x.com/EduAi20085" target="_blank" rel="noopener noreferrer" aria-label="X"><i className="bx bxl-twitter"></i></a></li>
              <li><a href="https://www.instagram.com/edusmart.ai/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bx bxl-instagram"></i></a></li>
            </ul>
          </div>

          {/* Contact (رجّعته) */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">تواصل معنا</h3>
            <ul className="text-white space-y-2 text-sm">
              <li>
                <i className="bx bxs-phone ml-2" />
                <span className="font-medium">الهاتف:</span>{" "}
                <a href="tel:+201031165004" className="hover:text-orange-500">
                    <bdi dir="ltr">+20 0103 116 5004</bdi>
                  </a>
              </li>
              <li>
                <i className="bx bx-envelope ml-2" />
                <span className="font-medium">البريد الإلكتروني:</span>{" "}
                <a href="mailto:Edu-smart@gmail.com" className="hover:text-orange-500">Info@edu-smart.ai</a>
              </li>
              <li>
                <i className="bx bxl-whatsapp ml-2" />
                <span className="font-medium">واتساب:</span>{" "}
                <a href="https://wa.me/201021355543" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">01021355543</a>
              </li>
              <li>
                <i className="bx bxs-map ml-2" />
                <span className="font-medium">العنوان:</span>{" "}
                <span className="text-white/85">القاهرة، مصر</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-white text-sm">
              <li><Link to="/vision" className="hover:text-orange-500">الرؤية والرسالة</Link></li>
              <li><a href="/home#pricing" onClick={handlePricing} className="hover:text-orange-500">الرسوم الدراسية</a></li>
              <li><Link to="/teachers" className="hover:text-orange-500">اعرف معلمك</Link></li>
            </ul>
          </div>

          {/* Photo Gallery (رجّعت الست صور) */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">معرض الصور</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6].map((num) => (
                <div key={num} className="relative group overflow-hidden rounded">
                  <img
                    src={`assets/img/footer-gallery/${num}.JPG`}
                    alt={`gallery-${num}`}
                    className="w-full h-20 object-cover transition duration-300 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Policies (روابط تفتح مودال في النص) */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <h3 className="text-xl font-bold text-white mb-3 text-right">السياسات</h3>
          <div className="flex flex-wrap gap-3 justify-start">
            <button
              onClick={() =>
                openPolicy(
                  "سياسة الاسترجاع والاستبدال",
                  <div className="space-y-2 leading-8">
                    <p>نحن نقدر ثقتكم. الرسوم المدفوعة مقابل الدورات الإلكترونية أو المواد الرقمية أو الاشتراكات تعتبر غير قابلة للاسترداد بعد منح صلاحية الدخول. ومع ذلك، قد يتم النظر في الاسترداد في حالات خاصة (مثل الدفع المكرر أو وجود مشاكل تقنية تمنع الوصول).</p>
                    <ul className="list-disc mr-5">
                      <li>يجب تقديم طلب الاسترداد خلال <strong>7 أيام</strong> من عملية الدفع.</li>
                      <li>لا يتم استرداد الرسوم بعد بدء الدخول إلى الدورة.</li>
                      <li>يمكن استبدال الدورة بأخرى إذا تم الطلب قبل بدء الدخول إلى المحتوى.</li>
                    </ul>
                  </div>
                )
              }
              className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/15 text-sm"
            >
              سياسة الاسترجاع والاستبدال
            </button>

            <button
              onClick={() =>
                openPolicy(
                  "سياسة مدة الخدمة/التسليم",
                  <div className="space-y-2 leading-8">
                    <p>بما أننا مدرسة تعليمية إلكترونية، لا يتم شحن منتجات مادية.</p>
                    <ul className="list-disc mr-5">
                      <li>يتم منح صلاحية الوصول إلى الدورات مباشرة بعد تأكيد الدفع.</li>
                      <li>لا نقدم شهادات؛ فجميع خدماتنا تعليمية رقمية فقط.</li>
                    </ul>
                  </div>
                )
              }
              className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/15 text-sm"
            >
              سياسة مدة الخدمة/التسليم
            </button>

            <button
              onClick={() =>
                openPolicy(
                  "الشروط والأحكام",
                  <div className="space-y-2 leading-8">
                    <p>باستخدامك للمنصة فإنك توافق على:</p>
                    <ol className="list-decimal mr-5 space-y-1">
                      <li>إدخال معلومات صحيحة عند التسجيل.</li>
                      <li>استخدام المنصة لأغراض تعليمية فقط.</li>
                      <li>عدم مشاركة أو إعادة بيع أو توزيع محتوى الدورات دون إذن.</li>
                      <li>احترام حقوق الملكية الفكرية للمنصة والمدربين.</li>
                      <li>قبول أن أي مخالفة قد تؤدي إلى إيقاف أو إلغاء الحساب.</li>
                    </ol>
                  </div>
                )
              }
              className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/15 text-sm"
            >
              الشروط والأحكام
            </button>

            <button
              onClick={() =>
                openPolicy(
                  "سياسة الخصوصية",
                  <div className="space-y-2 leading-8">
                    <p>نقوم بجمع الحد الأدنى من المعلومات الشخصية (الاسم، البريد الإلكتروني، بيانات الدفع) لتقديم الخدمة.</p>
                    <ul className="list-disc mr-5">
                      <li>لن نقوم أبداً ببيع بياناتك أو مشاركتها مع أطراف خارجية دون موافقتك.</li>
                      <li>نستخدم بوابات دفع آمنة وتقنيات التشفير لحماية معلوماتك.</li>
                      <li>يمكنك طلب حذف حسابك وبياناتك الشخصية في أي وقت عبر التواصل معنا.</li>
                    </ul>
                  </div>
                )
              }
              className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/15 text-sm"
            >
              سياسة الخصوصية
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4" onClick={() => setModalOpen(false)}>
          <div
            className="bg-white rounded-xl max-w-2xl w-full p-5 text-right overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-gray-900">{modalTitle}</h4>
              <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-black text-xl leading-none">×</button>
            </div>
            <div className="text-gray-800 text-sm">{modalBody}</div>
            
          </div>
        </div>
      )}
    </section>
  );
}
