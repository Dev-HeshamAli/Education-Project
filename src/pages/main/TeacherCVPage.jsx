// src/pages/TeacherCVPage.jsx
import { useEffect } from "react";

import Navbar from "../../components/main/Navbar";
import Footer from "../../components/main/Footer";

export default function TeacherCVPage() {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = "ar";
    html.dir = "rtl";
    html.classList.add("theme-light");
  }, []);

  // نفس الأسماء/الأقسام اللي في الـ HTML المرسل
  const teachers = [
    {
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
      skills: [
        "Educational Administration & School Accreditation",
        "Fluent in English and Arabic",
      ],
    },
    {
      name: "كرم محمد",
      title: "معلم لغة عربية وتربية إسلامية",
      image: "/assets/img/karam.png",
      profile:
        "خبرة تمتد لـ 20 عامًا في مجال تدريس اللغة العربية والتربية الإسلامية في كبرى المدارس الدولية.",
      education: ["ليسانس دار العلوم - جامعة القاهرة، ١٩٩٨"],
      experience: [
        "مدرسة منارة المعادي الدولية للغات",
        "مدرسة الملكة للغات بفيصل",
      ],
      skills: ["إجادة الخط العربي و استخدام الكمبيوتر"],
    },
    {
      name: "Salwa Abd El Hamid",
      title: "Math & Science Teacher",
      image: "/assets/img/salma.png",
      profile:
        "A certified and experienced teacher specializing in Mathematics and Sciences (Chemistry) for middle and high school grades in American and Bilingual curriculum schools.",
      education: [
        "B.Sc of Chemical Engineering - Alexandria University, Egypt",
      ],
      certifications: [
        "Advanced International Teaching Diploma from the U.S.A (Silver & Gold Star Certificates)",
      ],
      experience: [
        "Manarat El Maadi American School (Math Teacher): 7 years",
        "Al Amal School (Chemistry Teacher): 2 years",
      ],
    },
    {
      name: "Shahd Abd El Khalek",
      title: "MIS Officer / Teacher",
      image: "/assets/img/shahd.jpeg",
      profile:
        "A finance and investment graduate with experience in both corporate roles (MIS, compliance) and teaching English and French at the nursery level. Multilingual with strong organizational skills.",
      education: [
        "Finance and Investment - Georgia State University joint program with Cairo University.",
      ],
      skills: [
        "Social organizing & Teamwork",
        "Fluent in English & French (Delf B2)",
      ],
    },
    {
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

      {/* Page Title with overlay same as template */}
      <section
        className="relative py-12"
        style={{ fontFamily: "Calibri, sans-serif" }}
      >
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
          <h2 className="text-white text-4xl md:text-5xl font-bold">
            اعرف فريق معلميك
          </h2>
        </div>
      </section>

      {/* Teachers grid */}
      <section className="py-10" style={{ fontFamily: "Calibri, sans-serif" }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {teachers.map((t, i) => (
            <article
              key={i}
              className="bg-white rounded-2xl shadow-[0_5px_25px_rgba(0,0,0,0.08)] p-6 md:p-7 hover:-translate-y-2 hover:shadow-[0_10px_35px_rgba(0,0,0,0.12)] transition"
            >
              {/* Header */}
              <header className="flex items-center border-b pb-5 mb-5">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#f0f5ff] ml-5"
                />
                <div>
                  <h3 className="text-2xl font-bold text-[#051441] mb-1">
                    {t.name}
                  </h3>
                  <span className="text-[#e52e71] font-semibold">
                    {t.title}
                  </span>
                </div>
              </header>

              {/* Body */}
              <div className="space-y-5 text-[15px] leading-7">
                {t.profile && (
                  <section>
                    <h4 className="text-[#051441] font-bold border-b-2 border-[#ff6b6b] pb-2 inline-block">
                      {/[اأإآ]/.test(t.name[0]) || t.title.includes("معلم")
                        ? "النبذة"
                        : "Profile"}
                    </h4>
                    <p className="mt-2">{t.profile}</p>
                  </section>
                )}

                {t.currentRole && (
                  <section>
                    <h4 className="text-[#051441] font-bold border-b-2 border-[#ff6b6b] pb-2 inline-block">
                      Current Role
                    </h4>
                    <ul className="mt-3 list-disc pr-5">
                      {t.currentRole.map((x, idx) => (
                        <li key={idx}>{x}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {t.education && (
                  <section>
                    <h4 className="text-[#051441] font-bold border-b-2 border-[#ff6b6b] pb-2 inline-block">
                      {/[اأإآ]/.test(t.name[0])
                        ? "المؤهل الدراسي"
                        : "Education"}
                    </h4>
                    <ul className="mt-3 list-disc pr-5">
                      {t.education.map((x, idx) => (
                        <li key={idx}>{x}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {t.certifications && (
                  <section>
                    <h4 className="text-[#051441] font-bold border-b-2 border-[#ff6b6b] pb-2 inline-block">
                      Certifications
                    </h4>
                    <ul className="mt-3 list-disc pr-5">
                      {t.certifications.map((x, idx) => (
                        <li key={idx}>{x}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {t.experience && (
                  <section>
                    <h4 className="text-[#051441] font-bold border-b-2 border-[#ff6b6b] pb-2 inline-block">
                      {/[اأإآ]/.test(t.name[0])
                        ? "أماكن العمل السابقة"
                        : "Work Experience"}
                    </h4>
                    <ul className="mt-3 list-disc pr-5">
                      {t.experience.map((x, idx) => (
                        <li key={idx}>{x}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {t.skills && (
                  <section>
                    <h4 className="text-[#051441] font-bold border-b-2 border-[#ff6b6b] pb-2 inline-block">
                      {/[اأإآ]/.test(t.name[0])
                        ? "المهارات الذاتية"
                        : "Key Skills"}
                    </h4>
                    <ul className="mt-3 list-disc pr-5">
                      {t.skills.map((x, idx) => (
                        <li key={idx}>{x}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
      {/* Footer */}
      <Footer />

      {/* End of HomePage */}
      <div className="bg-gray-900 py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-200">
            <p>
              حقوق النشر © 2024 Edu-Smart. جميع الحقوق محفوظة بواسطة
              <a
                href="#"
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
