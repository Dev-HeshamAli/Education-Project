// src/pages/TeacherCVPage.jsx
import { useEffect } from "react";

import Footer from "../../components/main/Footer";
import Navbar from "../../components/main/Navbar";

// helper: يرجّع dir / align / padding للقوائم بناءً على اللغة
function dirPropsByLang(lang = "en") {
  const ar = lang === "ar";
  return {
    dir: ar ? "rtl" : "ltr",
    alignClass: ar ? "text-right" : "text-left",
    listPadClass: ar ? "pr-5" : "pl-5",
  };
}

export default function TeacherCVPage() {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = "ar";
    html.dir = "rtl";
    html.classList.add("theme-light");
  }, []);

  const teachers = [
    {
      lang: "en",
      name: "Samar Maher",
      title: "Academic Coordinator / English Teacher",
      image: "/assets/img/samar.png",
      profile:
        "Dedicated teacher with over 17 years of experience. Certified to teach American standardized curriculum, skilled in integrating new technologies, and successful in improving student test scores through engaging lesson plans.",
      education: [
        "Bachelor Degree, English Department - Mansoura University, 2007",
        "TOEFL - Amid east 2017",
      ],
      experience: [
        "El Alsson International School (2024 - Present)",
        "Capital International School (2023 - 2024)",
        "Future Pioneers American School (2021 - 2023)",
      ],
      skills: [
        "Online Teaching & Classroom Management",
        "Literacy Program Development",
        "Critical Thinking & Problem Solving",
      ],
    },
    {
      lang: "en",
      name: "Farida Hussein Abd El-Hamed",
      title: "Principal Assistant & Coordinator",
      image: "/assets/img/farida.jpg",
      profile:
        "Passionate and results-oriented educational professional with many years of experience in administration and science teaching. Proven ability to manage complex tasks and cultivate positive learning environments.",
      currentRole: [
        "Principal Assistant & Coordinator at Sakkara Language School Maadi (Since 2021)",
      ],
      education: [
        "Bachelor of Science in Geology and Chemistry - Ain Shams University, 2012",
      ],
      skills: ["Educational Administration & School Accreditation", "Fluent in English and Arabic"],
    },
    {
      lang: "ar",
      name: "كرم محمد",
      title: "معلم لغة عربية وتربية إسلامية",
      image: "/assets/img/karam.png",
      profile:
        "خبرة تمتد لـ 20 عامًا في مجال تدريس اللغة العربية والتربية الإسلامية في كبرى المدارس الدولية.",
      education: ["ليسانس دار العلوم - جامعة القاهرة، ١٩٩٨"],
      experience: ["مدرسة منارة المعادي الدولية للغات", "مدرسة الملكة للغات بفيصل"],
      skills: ["إجادة الخط العربي و استخدام الكمبيوتر"],
    },
    {
      lang: "en",
      name: "Salwa Abd El Hamid",
      title: "Math & Science Teacher",
      image: "/assets/img/salma.png",
      profile:
        "A certified and experienced teacher specializing in Mathematics and Sciences (Chemistry) for middle and high school grades in American and Bilingual curriculum schools.",
      education: ["B.Sc of Chemical Engineering - Alexandria University, Egypt"],
      certifications: [
        "Advanced International Teaching Diploma from the U.S.A (Silver & Gold Star Certificates)",
      ],
      experience: [
        "Manarat El Maadi American School (Math Teacher): 7 years",
        "Al Amal School (Chemistry Teacher): 2 years",
      ],
    },
    {
      lang: "en",
      name: "Shahd Abd El Khalek",
      title: "MIS Officer / Teacher",
      image: "/assets/img/shahd.jpeg",
      profile:
        "A finance and investment graduate with experience in both corporate roles (MIS, compliance) and teaching English and French at the nursery level. Multilingual with strong organizational skills.",
      education: [
        "Finance and Investment - Georgia State University joint program with Cairo University.",
      ],
      skills: ["Social organizing & Teamwork", "Fluent in English & French (Delf B2)"],
    },
    {
      lang: "en",
      name: "Reham ElSherbiny",
      title: "English Language Teacher",
      image: "/assets/img/reham.png",
      profile:
        "Experienced English teacher and TESOL certificate holder with experience as a freelance translator and nursery teacher. Lived in the UK for three years, bringing a broad cultural perspective.",
      education: [
        "College Diploma in Arts, English department - Alexandria University.",
        "TESOL certificate holder since 2018.",
      ],
      experience: [
        "English language teacher at Riada Language School",
        "Nursery and Preschool teacher at Alexandria Montessori",
      ],
    },
    {
      lang: "en",
      name: "Basma Adel Ezzat",
      title: "Reading English Teacher",
      image: "/assets/img/basma.png",
      profile:
        "An articulate and qualified English teacher with a proven ability to teach, motivate, and direct students. Experienced in planning and delivering engaging reading lessons aligned with curriculum standards.",
      education: [
        "Bachelor of Foreign languages and translation - Masr University For Science and Technology.",
      ],
      experience: [
        "Reading English Teacher at Manhattan International British School (Current)",
        "English Teacher (KG) at Future Rise Language School",
      ],
    },
  ];

  return (
    <>
      <Navbar />

      {/* Page Title */}
      <section className="relative py-12" style={{ fontFamily: "Calibri, sans-serif" }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/assets/img/page-title-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[#ff6b6b] opacity-95" />
        <div className="relative container mx-auto text-center">
          <h2 className="text-white text-4xl md:text-5xl font-bold">اعرف فريق معلميك</h2>
        </div>
      </section>

      {/* Teachers grid */}
      <section className="py-10" style={{ fontFamily: "Calibri, sans-serif" }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {teachers.map((t, i) => {
            const lang = t.lang;
            const isAr = lang === "ar";
            const nameDir = dirPropsByLang(lang);
            const bodyDir = dirPropsByLang(lang);

            const headings =
              lang === "ar"
                ? {
                    profile: "النبذة",
                    education: "المؤهل الدراسي",
                    experience: "أماكن العمل السابقة",
                    skills: "المهارات الذاتية",
                    certifications: "الشهادات",
                    currentRole: "المنصب الحالي",
                  }
                : {
                    profile: "Profile",
                    education: "Education",
                    experience: "Work Experience",
                    skills: "Key Skills",
                    certifications: "Certifications",
                    currentRole: "Current Role",
                  };

            return (
              <article
                key={i}
                className="bg-white rounded-2xl shadow-[0_5px_25px_rgba(0,0,0,0.08)] p-6 md:p-7 hover:-translate-y-2 hover:shadow-[0_10px_35px_rgba(0,0,0,0.12)] transition"
              >
                {/* Header: نتحكم في مكان الصورة عبر dir فقط */}
                <header
                  dir={isAr ? "rtl" : "ltr"}
                  className="flex items-center border-b pb-5 mb-5"
                >
                  <img
                    src={t.image}
                    alt={t.name}
                    className={`w-24 h-24 rounded-full object-cover border-4 border-[#f0f5ff] ${
                      isAr ? "ml-5" : "mr-5"
                    }`}
                  />
                  <div className="min-w-0">
                    <h3
                      className={`text-2xl font-bold text-[#051441] mb-1 break-words ${nameDir.alignClass}`}
                      dir={nameDir.dir}
                    >
                      {t.name}
                    </h3>
                    <span
                      className={`text-[#e52e71] font-semibold block ${nameDir.alignClass}`}
                      dir={nameDir.dir}
                    >
                      {t.title}
                    </span>
                  </div>
                </header>

                {/* Body */}
                <div className="space-y-5 text-[15px] leading-7">
                  {t.profile && (
                    <section>
                      <h4
                        className={`block w-full text-[#051441] font-bold border-b-2 border-[#ff6b6b] pb-2 ${bodyDir.alignClass}`}
                        dir={bodyDir.dir}
                      >
                        {headings.profile}
                      </h4>
                      <p className={`mt-2 ${bodyDir.alignClass}`} dir={bodyDir.dir}>
                        {t.profile}
                      </p>
                    </section>
                  )}

                  {t.currentRole && (
                    <section>
                      <h4
                        className={`block w-full text-[#051441] font-bold border-b-2 border-[#ff6b6b] pb-2 ${bodyDir.alignClass}`}
                        dir={bodyDir.dir}
                      >
                        {headings.currentRole}
                      </h4>
                      <ul
                        className={`mt-3 list-disc ${dirPropsByLang(lang).listPadClass}`}
                        dir={bodyDir.dir}
                      >
                        {t.currentRole.map((x, idx) => (
                          <li key={idx} className={bodyDir.alignClass}>
                            {x}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {t.education && (
                    <section>
                      <h4
                        className={`block w-full text-[#051441] font-bold border-b-2 border-[#ff6b6b] pb-2 ${bodyDir.alignClass}`}
                        dir={bodyDir.dir}
                      >
                        {headings.education}
                      </h4>
                      <ul
                        className={`mt-3 list-disc ${dirPropsByLang(lang).listPadClass}`}
                        dir={bodyDir.dir}
                      >
                        {t.education.map((x, idx) => (
                          <li key={idx} className={bodyDir.alignClass}>
                            {x}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {t.certifications && (
                    <section>
                      <h4
                        className={`block w-full text-[#051441] font-bold border-b-2 border-[#ff6ب6b] pb-2 ${bodyDir.alignClass}`}
                        dir={bodyDir.dir}
                      >
                        {headings.certifications}
                      </h4>
                      <ul
                        className={`mt-3 list-disc ${dirPropsByLang(lang).listPadClass}`}
                        dir={bodyDir.dir}
                      >
                        {t.certifications.map((x, idx) => (
                          <li key={idx} className={bodyDir.alignClass}>
                            {x}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {t.experience && (
                    <section>
                      <h4
                        className={`block w-full text-[#051441] font-bold border-b-2 border-[#ff6b6b] pb-2 ${bodyDir.alignClass}`}
                        dir={bodyDir.dir}
                      >
                        {headings.experience}
                      </h4>
                      <ul
                        className={`mt-3 list-disc ${dirPropsByLang(lang).listPadClass}`}
                        dir={bodyDir.dir}
                      >
                        {t.experience.map((x, idx) => (
                          <li key={idx} className={bodyDir.alignClass}>
                            {x}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {t.skills && (
                    <section>
                      <h4
                        className={`block w-full text-[#051441] font-bold border-b-2 border-[#ff6b6b] pb-2 ${bodyDir.alignClass}`}
                        dir={bodyDir.dir}
                      >
                        {headings.skills}
                      </h4>
                      <ul
                        className={`mt-3 list-disc ${dirPropsByLang(lang).listPadClass}`}
                        dir={bodyDir.dir}
                      >
                        {t.skills.map((x, idx) => (
                          <li key={idx} className={bodyDir.alignClass}>
                            {x}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <Footer />

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
    </>
  );
}
