import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Footer() {
  const location = useLocation();

  // ===== مودال السياسات =====
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState(null);

  // ===== لايت بوكس المعرض =====
  const GALLERY = [1, 2, 3, 4, 5, 6].map((n) => ({
    src: `assets/img/footer-gallery/${n}.JPG`,
    alt: `gallery-${n}`,
  }));
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (idx) => {
    setCurrentIndex(idx);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const nextImg = () => setCurrentIndex((i) => (i + 1) % GALLERY.length);
  const prevImg = () =>
    setCurrentIndex((i) => (i - 1 + GALLERY.length) % GALLERY.length);

  // تعطيل سكرول الصفحة وقت فتح اللايت بوكس + مفاتيح الكيبورد
  useEffect(() => {
    if (lightboxOpen) {
      const onKey = (e) => {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") nextImg();
        if (e.key === "ArrowLeft") prevImg();
      };
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    }
  }, [lightboxOpen]);

  const handlePricing = (e) => {
    if (location.pathname !== "/home") return;
    e.preventDefault();
    const el = document.querySelector("#pricing");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.location.hash !== "#pricing")
      history.replaceState(null, "", "#pricing");
  };

  // فتح مودال السياسات
  const openPolicy = (title, body) => {
    setModalTitle(title);
    setModalBody(body);
    setModalOpen(true);
  };

  return (
    <section
      id="footer"
      className="footer-area pt-20 pb-16 bg-gray-950"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Top blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-right">
          {/* Logo + desc + socials */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              <span className="cursor-default">Edu-Smart.ai</span>
            </h2>
            <p className="text-white/85 mb-4 text-sm">
              منصة تعليمية رائدة للمصريين في الخارج، نقدم المنهج المصري بحب
              وشغف.
            </p>
            <ul className="flex justify-start gap-4 text-xl text-white ">
              <li>
                <a
                  href="https://www.tiktok.com/@edu_smart.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                >
                  <i className="bx bxl-tiktok"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61581102207607"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <i className="bx bxl-facebook"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/Edu_SmartAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                >
                  <i className="bx bxl-twitter"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/edusmart.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <i className="bx bxl-instagram"></i>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              تواصل معنا
            </h3>
            <ul className="text-white space-y-2 text-sm">
              <li>
                <i className="bx bxl-whatsapp ml-2" />
                <span className="font-medium">واتساب:</span>{" "}
                <a
                  href="https://wa.me/201021355543"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-500"
                >
                  <bdi dir="ltr">+20 01021355543</bdi>
                </a>
              </li>
              <li>
                <i className="bx bx-envelope ml-2" />
                <span className="font-medium">البريد الإلكتروني:</span>{" "}
                <a
                  href="mailto:Edu-smart@gmail.com"
                  className="hover:text-orange-500"
                >
                  Info@edu-smart.ai
                </a>
              </li>
              <li>
                <i className="bx bxs-phone ml-2" />
                <span className="font-medium">الهاتف:</span>{" "}
                <a href="tel:+201031165004" className="hover:text-orange-500">
                  <bdi dir="ltr">+20 0103 116 5004</bdi>
                </a>
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
            <h3 className="text-xl font-semibold text-white mb-4">
              روابط سريعة
            </h3>
            <ul className="space-y-2 text-white text-sm">
              <li>
                <Link to="/vision" className="hover:text-orange-500">
                  الرؤية والرسالة
                </Link>
              </li>
              <li>
                <a
                  href="/home#pricing"
                  onClick={handlePricing}
                  className="hover:text-orange-500"
                >
                  الرسوم الدراسية
                </a>
              </li>
              <li>
                <Link to="/teachers" className="hover:text-orange-500">
                  اعرف معلمك
                </Link>
              </li>
            </ul>
          </div>

          {/* Photo Gallery */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              معرض الصور
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {GALLERY.map((item, idx) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => openLightbox(idx)}
                  className="relative group overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                  aria-label={`عرض ${item.alt} بحجم كبير`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-20 object-cover transition duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <span className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <h3 className="text-xl font-bold text-white mb-3 text-right">
            السياسات
          </h3>
          <div className="flex flex-wrap gap-3 justify-start">
            <button
              onClick={() =>
                openPolicy(
                  "سياسة الاسترجاع والاستبدال",
                  <div className="space-y-2 leading-8">
                    <p>
                      نحن نقدر ثقتكم. الرسوم المدفوعة مقابل الدورات الإلكترونية
                      أو المواد الرقمية أو الاشتراكات تعتبر غير قابلة للاسترداد
                      بعد منح صلاحية الدخول. ومع ذلك، قد يتم النظر في الاسترداد
                      في حالات خاصة (مثل الدفع المكرر أو وجود مشاكل تقنية تمنع
                      الوصول).
                    </p>
                    <ul className="list-disc mr-5">
                      <li>
                        يجب تقديم طلب الاسترداد خلال <strong>7 أيام</strong> من
                        عملية الدفع.
                      </li>
                      <li>لا يتم استرداد الرسوم بعد بدء الدخول إلى الدورة.</li>
                      <li>
                        يمكن استبدال الدورة بأخرى إذا تم الطلب قبل بدء الدخول
                        إلى المحتوى.
                      </li>
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
                    <p>
                      بما أننا مدرسة تعليمية إلكترونية، لا يتم شحن منتجات مادية.
                    </p>
                    <ul className="list-disc mr-5">
                      <li>
                        يتم منح صلاحية الوصول إلى الدورات مباشرة بعد تأكيد
                        الدفع.
                      </li>
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
                      <li>
                        عدم مشاركة أو إعادة بيع أو توزيع محتوى الدورات دون إذن.
                      </li>
                      <li>احترام حقوق الملكية الفكرية للمنصة والمدربين.</li>
                      <li>
                        قبول أن أي مخالفة قد تؤدي إلى إيقاف أو إلغاء الحساب.
                      </li>
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
                    <p>
                      نقوم بجمع الحد الأدنى من المعلومات الشخصية (الاسم، البريد
                      الإلكتروني، بيانات الدفع) لتقديم الخدمة.
                    </p>
                    <ul className="list-disc mr-5">
                      <li>
                        لن نقوم أبداً ببيع بياناتك أو مشاركتها مع أطراف خارجية
                        دون موافقتك.
                      </li>
                      <li>
                        نستخدم بوابات دفع آمنة وتقنيات التشفير لحماية معلوماتك.
                      </li>
                      <li>
                        يمكنك طلب حذف حسابك وبياناتك الشخصية في أي وقت عبر
                        التواصل معنا.
                      </li>
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

      {/* ===== Modal السياسات ===== */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full p-5 text-right overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-gray-900">{modalTitle}</h4>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-600 hover:text-black text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="text-gray-800 text-sm">{modalBody}</div>
          </div>
        </div>
      )}

      {/* ===== Lightbox معرض الصور ===== */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
          aria-modal="true"
          role="dialog"
        >
          <button
            className="absolute top-4 left-4 text-white/90 hover:text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="إغلاق"
          >
            ×
          </button>

          {/* أزرار التنقل */}
          <button
            dir="ltr"
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            onClick={(e) => {
              e.stopPropagation();
              prevImg();
            }}
            aria-label="السابق"
          >
            {/* سهم لليسار (SVG ثابت) */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            dir="ltr"
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            onClick={(e) => {
              e.stopPropagation();
              nextImg();
            }}
            aria-label="التالي"
          >
            {/* سهم لليمين (SVG ثابت) */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* الصورة */}
          <div
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={GALLERY[currentIndex].src}
              alt={GALLERY[currentIndex].alt}
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              loading="eager"
            />
            <div className="mt-3 text-center text-white/80 text-sm">
              {currentIndex + 1} / {GALLERY.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
