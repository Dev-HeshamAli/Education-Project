// src/pages/KG1.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api/BASE_URL";

const IS_PRIM = true;

// دروس كمثال (تقدري تعدلي الفيديوهات لو تحبي تشتغّل من المودال)
const lessonsArabic = [
  { title: "درس الاول", icon: "\u2B50" , video: "/assets/img/lectures/Arabic_Prime3.mp4" },
  
];

// مسارات فيديوهات المواد (KG)
const SUBJECT_VIDEO = {
  arabic: "/assets/img/subjects/Arabic(Prim1,2,3,4).mp4",
  english: "/assets/img/subjects/English.mp4",
  science: "/assets/img/subjects/Discovery.mp4",
};

// الافتراضي عند فتح KG1 أول مرّة
const DEFAULT_LECTURE_SRC = "/assets/img/subjects/KG.mp4";

const ACCENT = "#e76f2e";
const NAVY = "#1c2431";

/* =======================
   KG1 Page
   ======================= */
export default function Prim3() {
  // video / translate / summarize / chat / quiz
  const [mode, setMode] = useState("video");

  // اختيار المادة
  const [subject, setSubject] = useState("arabic");

  const [modalOpen, setModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");

  const [error, setError] = useState("");
  const [firstCourseDetailId, setFirstCourseDetailId] = useState(null);
  const [fetchingId, setFetchingId] = useState(false);

  const mainVideoRef = useRef(null);
  const lessonVideoRef = useRef(null);

  // axios بدون أي توكن
  const api = useMemo(() => {
    return axios.create({
      baseURL: BASE_URL,
      headers: { Accept: "application/json", "Content-Type": "application/json" },
    });
  }, []);

  // دالة موحّدة لتشغيل فيديو "المحاضرة الرئيسية" (autoplay موثوق)
  const playMainVideo = (src) => {
    const v = mainVideoRef.current;
    if (!v) return;

    try {
      v.pause();
    } catch {}
    if (!src) {
      v.removeAttribute("src");
      v.load();
      return;
    }
    v.muted = true; // ضروري للـ autoplay
    v.setAttribute("muted", "");
    v.playsInline = true;

    v.src = src;
    v.currentTime = 0;
    v.load();

    const onCanPlay = () => {
      v.play?.().catch(() => {});
    };
    v.addEventListener("canplay", onCanPlay, { once: true });
  };

  // أول دخول: شغّل الفيديو الافتراضي
  useEffect(() => {
    playMainVideo(DEFAULT_LECTURE_SRC);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // عند تغيير المادة: بدّل الفيديو
  useEffect(() => {
    const src =
      subject === "arabic"
        ? SUBJECT_VIDEO.arabic
        : subject === "english"
        ? SUBJECT_VIDEO.english
        : subject === "science"
        ? SUBJECT_VIDEO.science
        : DEFAULT_LECTURE_SRC;

    playMainVideo(src);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  // لو رجعنا لمود "المحاضرة" بعد ما كنا في أداة
  useEffect(() => {
    if (mode === "video") {
      // رجّع نفس فيديو المادة الحالية
      const src =
        subject === "arabic"
          ? SUBJECT_VIDEO.arabic
          : subject === "english"
          ? SUBJECT_VIDEO.english
          : subject === "science"
          ? SUBJECT_VIDEO.science
          : DEFAULT_LECTURE_SRC;
      playMainVideo(src);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // أول ما تفتحي أي أداة — هاتِ ID أول حصة بناءً على isPrim=false
  const ensureFirstId = async () => {
    if (firstCourseDetailId) return firstCourseDetailId;
    setFetchingId(true);
    setError("");
    try {
      const res = await api.get(`/api/Course/First-Lecture-CourseDetail/${IS_PRIM}`);
      const id = typeof res.data === "number" ? res.data : Number(res.data?.id ?? res.data);
      if (!id || Number.isNaN(id)) throw new Error("قيمة غير صالحة للـ ID من السيرفر.");
      setFirstCourseDetailId(id);
      return id;
    } catch (e) {
      setError(
        e?.response?.data
          ? typeof e.response.data === "string"
            ? e.response.data
            : JSON.stringify(e.response.data)
          : e?.message || "تعذّر جلب بيانات الحصة الأولى."
      );
      throw e;
    } finally {
      setFetchingId(false);
    }
  };

  const openTool = async (tool) => {
    try {
      await ensureFirstId();
      setMode(tool);
    } catch {
      /* الخطأ ظاهر فوق */
    }
  };

  return (
    <div dir="rtl" className="min-h-screen w-full bg-gradient-to-br from-[#f0f5ff] to-[#e6f7ff] font-[Cairo] p-4">
      {/* Selector المادة أعلى يمين */}
      <div className="w-full max-w-[1600px] mx-auto flex justify-end">
        <div className="xl:fixed xl:top-6 xl:right-6 z-50 flex items-center gap-3 bg-white/90 px-4 py-3 rounded-full shadow-lg">
          <label htmlFor="subjectSelector" className="font-bold text-[#051441] text-xs sm:text-sm">
            اختر المادة
          </label>
          <select
            id="subjectSelector"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-full border border-gray-300 font-bold text-xs sm:text-sm px-3 py-1"
          >
            <option value="arabic">العربية</option>
            <option value="english" disabled>English</option>
            <option value="science" disabled>Discovery</option>
          </select>
        </div>
      </div>

      {/* رسالة خطأ عامة */}
      {error && (
        <div className="max-w-[1200px] mx-auto mb-3">
          <div className="whitespace-pre-wrap p-4 text-center rounded-2xl border-2 border-[#e76f2e] bg-[#fff4ef] text-[#e76f2e] font-bold">
            {error}
          </div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-4 lg:gap-6 xl:gap-10 items-stretch justify-center w-full max-w-[1600px] mx-auto mt-10 lg:mt-14 xl:mt-14">
        {/* الأزرار الجانبية */}
        <div className="flex-none xl:flex-[1] order-2 xl:order-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:flex xl:flex-col gap-3 lg:gap-4 xl:gap-6 justify-center items-center xl:min-w-[360px] py-2 lg:py-4 xl:py-5">
            <Button icon="bx bx-calendar" color="bg-[#5758BB]" onClick={() => window.open("assets/img/kg.pdf", "_blank")}>
              جدول الفصل الدراسي
            </Button>

            <Button  color="bg-gradient-to-r from-[#feca57] to-[#ff9f43]" onClick={() => window.open("assets/img/powerpoint/Prim1.pdf", "_blank")}>
عرض ملف الدرس             </Button>

            <Button onClick={() => openTool("summarize")} icon="bx bx-file-text" color="bg-[#48dbfb]" loading={fetchingId && mode === "summarize"}>
              ملخص الحصة
            </Button>

            <Button onClick={() => openTool("chat")} icon="bx bx-chat" color="bg-[#1dd1a1]" loading={fetchingId && mode === "chat"}>
              تحاور مع الحصة
            </Button>

            <Button onClick={() => openTool("translate")} icon="bx bx-world" color="bg-gradient-to-r from-[#6a11cb] to-[#2575fc]" loading={fetchingId && mode === "translate"}>
              ترجمة الحصة
            </Button>

            <Button onClick={() => openTool("quiz")} icon="bx bx-check-circle" color="bg-[#10ac84]" loading={fetchingId && mode === "quiz"}>
              اختبار على الحصة
            </Button>

          <Button color="bg-gradient-to-r from-[#feca57] to-[#ff9f43]" textSmall onClick={() => setModalOpen(true)} icon="bx bx-film">
              مكتبة الرسوم المتحركة
              <br />
              والأفلام التفاعلية
            </Button>

            <Button to="/home#pricing" icon="bx bx-cart" color="bg-[#ff6b6b]" className="ring-2 ring-white/40">
              اشترك الآن
            </Button>
          </div>
        </div>

        {/* المساحة الرئيسية */}
        <div className="flex-1 xl:flex-[4] order-1 xl:order-2 min-w-0">
          {/* شريط علوي صغير يوضح المود الحالي */}
          <div className="flex items-center justify-between mb-2">
            <div className="font-extrabold text-[#051441]">
              {mode === "video" ? "🎥 مشاهدة المحاضرة" : "🧠 أدوات الذكاء — نفس مكان المحاضرة"}
            </div>
            {mode !== "video" && (
              <button
                onClick={() => setMode("video")}
                className="px-4 py-2 rounded-full text-white font-bold shadow"
                style={{ background: NAVY }}
                title="الرجوع لمشاهدة المحاضرة"
              >
                🎥 مشاهدة المحاضرة
              </button>
            )}
          </div>

          {/* وعاء المحتوى الأبيض */}
          <div className="relative bg-white rounded-2xl p-3 lg:p-4 xl:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border min-h-[320px]">
            {mode === "video" ? (
              <video
                ref={mainVideoRef}
                className="w-full h-full max-h-[55vh] lg:max-h-[65vh] xl:max-h-[72vh] rounded-xl object-contain"
                controls
                controlsList="nodownload"
                autoPlay
                playsInline
                poster="/assets/img/Back.png"
              />
            ) : (
              <div className="space-y-4">
                {/* Tabs داخل نفس الوعاء */}
                <ToolTabs active={mode} onChange={(k) => (k === "video" ? setMode("video") : openTool(k))} />
                <div className="mt-2">
                  {mode === "summarize" && firstCourseDetailId && (
                    <SummarizeInline api={api} courseDetailId={firstCourseDetailId} />
                  )}
                  {mode === "translate" && firstCourseDetailId && (
                    <TranslateInline api={api} courseDetailId={firstCourseDetailId} />
                  )}
                  {mode === "chat" && firstCourseDetailId && (
                    <ChatInline api={api} courseDetailId={firstCourseDetailId} />
                  )}
                  {mode === "quiz" && firstCourseDetailId && (
                    <QuizInline api={api} courseDetailId={firstCourseDetailId} />
                  )}
                  {!firstCourseDetailId && (
                    <div className="text-center py-10 text-[#1c2431]">
                      {fetchingId ? "🔄 بنجهز…" : "اضغطي على أي أداة وسيتم التحضير"}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* مودال اختيار الدروس */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-3 sm:p-6">
          <div className="bg-white p-5 sm:p-8 rounded-3xl w-full max-w-md sm:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#ff6b6b] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xl sm:text-2xl shadow-md hover:bg-[#ff5252] transition-colors"
              aria-label="إغلاق"
            >
              ×
            </button>
            <div className="text-center text-[#5758BB] text-xl sm:text-2xl font-extrabold mb-4 sm:mb-6">
              اختر درساً للمشاهدة
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {lessonsArabic.map((lesson, idx) => (
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
                      <i className={`bx ${lesson.icon} text-xl sm:text-2xl`} />
                    ) : (
                      <span className="text-xl sm:text-2xl">{lesson.icon}</span>
                    )}
                    {lesson.title}
                  </span>
                  <div className="w-[90px] h-[56px] sm:w-[120px] sm:h-[70px] bg-[#e9ecef] rounded-lg flex items-center justify-center text-[#888] text-xl sm:text-2xl">
                    <i className="bx bx-play-circle" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* مشغل فيديو الدرس (مودال) */}
      {videoModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-3 sm:p-6">
          <div className="bg-black p-3 sm:p-5 w-full max-w-xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl relative rounded-xl">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-3 left-3 bg-[#ff6b6b] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xl sm:text-2xl shadow-md hover:bg-[#ff5252] transition-colors z-10"
              aria-label="إغلاق"
            >
              ×
            </button>
            <div className="w-full aspect-video">
              <video ref={lessonVideoRef} className="rounded-xl w-full h-full" controls autoPlay  controlsList="nodownload">
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

/* =======================
   UI Primitives
   ======================= */
function Button({ children, icon, color = "bg-gray-400", textSmall = false, onClick, className = "", to, loading = false }) {
  const baseClasses = `${color} text-white font-extrabold rounded-full shadow-md hover:scale-[1.03] hover:shadow-xl transition duration-300 
    w-full 
    h-11 sm:h-12 lg:h-14 xl:h-[56px] 
    xl:w-[300px] 
    px-3 lg:px-4 
    flex items-center justify-center gap-2 text-center 
    ${textSmall ? "text-[12px] sm:text-[13px] lg:text-[14px] xl:text-[15px] leading-tight" : "text-[13px] sm:text-[14px] lg:text-[15px] xl:text-[16px]"} 
    ${className} ${loading ? "opacity-80 cursor-wait" : ""}`;

  const content = (
    <>
      {icon && <i className={`${icon} text-base sm:text-lg lg:text-xl`}></i>}
      <span className="leading-tight text-center">{children}</span>
      {loading && <i className="bx bx-loader-alt animate-spin text-xl" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses} aria-label={typeof children === "string" ? children : "زر تنقّل"}>
        {content}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={baseClasses} disabled={loading}>
      {content}
    </button>
  );
}

function ToolTabs({ active, onChange }) {
  const Tab = ({ id, label, icon }) => (
    <button
      onClick={() => onChange(id)}
      className={`px-4 sm:px-6 py-2 rounded-full font-bold border transition ${
        active === id
          ? "bg-[#fff4ef] border-[#ffd8c0] text-[#e76f2e]"
          : "bg-white border-[#e5e7eb] text-[#1c2431] hover:bg-[#f9fafb]"
      }`}
    >
      <i className={`bx ${icon} align-[-2px] ml-1`} /> {label}
    </button>
  );
  return (
    <div className="flex flex-wrap gap-2">
      <Tab id="summarize" label="الملخص" icon="bx-file-text" />
      <Tab id="translate" label="الترجمة" icon="bx-world" />
      <Tab id="chat" label="الشات" icon="bx-chat" />
      <Tab id="quiz" label="الكويز" icon="bx-check-circle" />
      <Tab id="video" label="🎥 المحاضرة" icon="bx-play-circle" />
    </div>
  );
}

/* =======================
   Inline Tools
   ======================= */
function SummarizeInline({ api, courseDetailId }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [sourceId, setSourceId] = useState(null);
  const [wordCount, setWordCount] = useState(100);
  const [summary, setSummary] = useState("");

  const extractErr = (e) =>
    e?.response?.data ? (typeof e.response.data === "string" ? e.response.data : JSON.stringify(e.response.data)) : e?.message || "Unknown error";

  const prepareAI = async () => api.post(`/api/Ai/Get-fileCoures/${courseDetailId}`, {});
  const newSummarize = async () => {
    const res = await api.get(`/api/Ai/New-Summarize/${courseDetailId}`);
    const data = res.data || {};
    setSourceId(data.sourceId ?? null);
    if (typeof data.wordCount === "number") setWordCount(data.wordCount);
    setSummary(data.summary || "");
  };
  const startSummarize = async (sid, wc) =>
    (await api.post(`/api/Ai/Start-Summarize`, { sourceId: sid, wordCount: wc, summary: null })).data || {};

  useEffect(() => {
    (async () => {
      try {
        setStatus("preparing");
        setError("");
        await prepareAI();
        await newSummarize();
        setStatus("ready");
      } catch (e) {
        setError(`تعذّر التهيئة.\n${extractErr(e)}`);
        setStatus("idle");
      }
    })();
  }, [courseDetailId]);

  const handleSummarize = async () => {
    if (!sourceId) return;
    if (Number(wordCount) < 20) {
      setError("⚠️ لا يمكن إنشاء ملخص بأقل من 20 كلمة.");
      return;
    }
    try {
      setStatus("summarizing");
      setError("");
      const data = await startSummarize(sourceId, Number(wordCount) || 100);
      setSummary(data.summary || "");
      setStatus("done");
    } catch (e) {
      setError(`تعذّر التنفيذ.\n${extractErr(e)}`);
      setStatus("ready");
    }
  };

  return (
    <div className="rounded-3xl border-2 p-4" style={{ borderColor: ACCENT, background: "#fff" }}>
      <h3 className="font-bold text-xl mb-3" style={{ color: NAVY }}>🪄 صانع الملخص</h3>
      {error && (
        <div className="whitespace-pre-wrap p-3 mb-3 rounded-2xl font-semibold" style={{ background: "#fff4ef", color: ACCENT, border: `1px solid ${ACCENT}` }}>
          {error}
        </div>
      )}
      <div className="grid sm:grid-cols-3 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold mb-1" style={{ color: NAVY }}>كم كلمة؟</label>
          <input
            type="number"
            min={50}
            max={1000}
            step={50}
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value)}
            className="w-full rounded-2xl px-4 py-3 text-lg font-semibold text-center border-2"
            style={{ borderColor: ACCENT }}
          />
          <div className="text-xs mt-1" style={{ color: NAVY }}>اختر بين 20 و 1000 كلمة</div>
        </div>
        <button
          onClick={handleSummarize}
          className="px-6 py-3 rounded-2xl text-white font-bold shadow-md disabled:opacity-50"
          style={{ background: ACCENT }}
          disabled={status === "summarizing" || status === "preparing"}
        >
          {status === "summarizing" ? "⏳ جارٍ..." : "اصنع الملخص"}
        </button>
      </div>

      <div className="mt-4 min-h-[140px] rounded-2xl p-4 border" style={{ background: "#fafafa", borderColor: "#eee", color: NAVY }}>
        {summary ? summary : status === "preparing" ? "🔄 أجهز..." : "سيظهر الملخص هنا"}
      </div>
    </div>
  );
}

function TranslateInline({ api, courseDetailId }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [uploadedFilePath, setUploadedFilePath] = useState("");
  const [languagesMap, setLanguagesMap] = useState({});
  const [selectedLanguageCode, setSelectedLanguageCode] = useState("");
  const [translation, setTranslation] = useState("");
  const [detectedLanguageInfo, setDetectedLanguageInfo] = useState(null);
  const [transliteration, setTransliteration] = useState(null);

  const extractErr = (e) =>
    e?.response?.data ? (typeof e.response.data === "string" ? e.response.data : JSON.stringify(e.response.data)) : e?.message || "Unknown error";

  const getLanguageEntries = (obj) => {
    const entries = Object.entries(obj || {});
    return entries.map(([a, b]) => {
      if (typeof b === "string" && /^[a-z]{2,3}(-[A-Z]{2})?$/.test(b)) return [a, b];
      if (typeof a === "string" && /^[a-z]{2,3}(-[A-Z]{2})?$/.test(a)) return [b, a];
      return [a, String(b)];
    });
  };

  const prepareAI = async () => api.post(`/api/Ai/Get-fileCoures/${courseDetailId}`, {});
  const newTranslate = async () => {
    const res = await api.get(`/api/Ai/New-Translate/${courseDetailId}`);
    const data = res.data || {};
    setUploadedFilePath(data.uploadedFilePath || "");
    setLanguagesMap(data.languages || {});
    const entries = getLanguageEntries(data.languages || {});
    const hasAr = entries.find(([, code]) => code === "ar");
    const hasEn = entries.find(([, code]) => code === "en");
    setSelectedLanguageCode(data.selectedLanguageCode || hasAr?.[1] || hasEn?.[1] || (entries[0]?.[1] || ""));
    setTranslation(data.translation || "");
    setDetectedLanguageInfo(data.detectedLanguageInfo || null);
    setTransliteration(data.transliteration || null);
  };
  const startTranslate = async (payload) => (await api.post(`/api/Ai/Start-Translate`, payload)).data || {};

  useEffect(() => {
    (async () => {
      try {
        setStatus("preparing");
        setError("");
        await prepareAI();
        await newTranslate();
        setStatus("ready");
      } catch (e) {
        setError(`تعذّر التهيئة.\n${extractErr(e)}`);
        setStatus("idle");
      }
    })();
  }, [courseDetailId]);

  const languageEntries = getLanguageEntries(languagesMap);

  const handleTranslate = async () => {
    if (!selectedLanguageCode) {
      setError("اختر لغة أولًا.");
      return;
    }
    try {
      setStatus("translating");
      setError("");
      const payload = {
        uploadedFilePath,
        selectedLanguageCode,
        languages: languagesMap,
        translation: null,
        detectedLanguageInfo: null,
        transliteration: null,
      };
      const data = await startTranslate(payload);
      setTranslation(data.translation || "");
      setDetectedLanguageInfo(data.detectedLanguageInfo || null);
      setTransliteration(data.transliteration || null);
      setStatus("done");
    } catch (e) {
      setError(`تعذّر التنفيذ.\n${extractErr(e)}`);
      setStatus("ready");
    }
  };

  return (
    <div className="rounded-3xl border-2 p-4" style={{ borderColor: ACCENT, background: "#fff" }}>
      <h3 className="font-bold text-xl mb-3" style={{ color: NAVY }}>🌍 مترجم الحصة</h3>
      {error && (
        <div className="whitespace-pre-wrap p-3 mb-3 rounded-2xl font-semibold" style={{ background: "#fff4ef", color: ACCENT, border: `1px solid ${ACCENT}` }}>
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold mb-1" style={{ color: NAVY }}>اختر اللغة</label>
          <select
            value={selectedLanguageCode}
            onChange={(e) => setSelectedLanguageCode(e.target.value)}
            className="w-full rounded-2xl px-4 py-3 font-semibold bg-white border"
            style={{ borderColor: ACCENT, color: NAVY }}
            disabled={!languageEntries.length}
          >
            {languageEntries.length ? (
              languageEntries.map(([label, code]) => (
                <option key={code} value={code}>
                  {label} ({code})
                </option>
              ))
            ) : (
              <option value="">لا توجد لغات متاحة</option>
            )}
          </select>
          <div className="text-xs mt-1" style={{ color: NAVY }}>
            ✨ سنكتشف لغة النص ونترجمها لما اخترته.
          </div>
        </div>
        <button
          onClick={handleTranslate}
          className="px-6 py-3 rounded-2xl text-white font-bold shadow-md disabled:opacity-50"
          style={{ background: ACCENT }}
          disabled={status === "translating" || status === "preparing" || !selectedLanguageCode}
        >
          {status === "translating" ? "⏳ أترجم..." : "ترجم!"}
        </button>
      </div>

      {(detectedLanguageInfo || transliteration) && (
        <div className="rounded-2xl p-3 mt-3 text-sm" style={{ background: "#fffefb", border: "1px solid #fde7d7", color: NAVY }}>
          {detectedLanguageInfo && (
            <div>
              <b style={{ color: ACCENT }}>اللغة المكتشفة:</b>{" "}
              {typeof detectedLanguageInfo === "string" ? detectedLanguageInfo : JSON.stringify(detectedLanguageInfo)}
            </div>
          )}
          {transliteration && (
            <div className="mt-1">
              <b style={{ color: ACCENT }}>النطق:</b>{" "}
              {typeof transliteration === "string" ? transliteration : JSON.stringify(transliteration)}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 min-h-[140px] rounded-2xl p-4 border" style={{ background: "#fafafa", borderColor: "#eee", color: NAVY }}>
        {translation ? translation : status === "preparing" ? "🔄 أجهز..." : "ستظهر الترجمة هنا"}
      </div>
    </div>
  );
}

function ChatInline({ api, courseDetailId }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [sourceId, setSourceId] = useState(null);
  const [chat, setChat] = useState([]);
  const [userInput, setUserInput] = useState("");

  const listRef = useRef(null);

  const extractErr = (e) =>
    e?.response?.data ? (typeof e.response.data === "string" ? e.response.data : JSON.stringify(e.response.data)) : e?.message || "Unknown error";

  const prepareAI = async () => api.post(`/api/Ai/Get-fileCoures/${courseDetailId}`, {});
  const newChat = async () => {
    const res = await api.get(`/api/Ai/New-chat/${courseDetailId}`);
    const data = res.data || {};
    setSourceId(data.sourceId ?? null);
    setChat(Array.isArray(data.messages) ? data.messages : []);
  };
  const startChat = async (payload) => (await api.post(`/api/Ai/Start-chat`, payload)).data || {};

  useEffect(() => {
    (async () => {
      try {
        setStatus("preparing");
        setError("");
        await prepareAI();
        await newChat();
        setStatus("ready");
      } catch (e) {
        setError(`تعذّر بدء الجلسة.\n${extractErr(e)}`);
        setStatus("idle");
      }
    })();
  }, [courseDetailId]);

  const handleSend = async () => {
    const text = (userInput || "").trim();
    if (!text || !sourceId || status === "sending") return;
    try {
      setStatus("sending");
      setError("");
      const optimistic = [...chat, { role: "user", content: text }];
      setChat(optimistic);
      setUserInput("");

      const payload = { sourceId, messages: chat, newMessage: text };
      const data = await startChat(payload);
      const msgs = Array.isArray(data.messages) ? data.messages : [];
      const lastServer = msgs[msgs.length - 1];
      setChat(lastServer ? [...optimistic, lastServer] : optimistic);
      setStatus("ready");

      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 50);
    } catch (e) {
      setError(`تعذّر الإرسال.\n${extractErr(e)}`);
      setStatus("ready");
    }
  };

  return (
    <div className="rounded-3xl border-2 p-4" style={{ borderColor: ACCENT, background: "#fff" }}>
      <h3 className="font-bold text-xl mb-3" style={{ color: NAVY }}>🤖💬 تحاور مع الحصة</h3>
      {error && (
        <div className="whitespace-pre-wrap p-3 mb-3 rounded-2xl font-semibold" style={{ background: "#fff4ef", color: ACCENT, border: `1px solid ${ACCENT}` }}>
          {error}
        </div>
      )}

      <div ref={listRef} className="h-[300px] overflow-y-auto space-y-3 p-3 rounded-2xl border" style={{ background: "#fafafa", borderColor: "#eee" }}>
        {chat.map((m, i) => {
          const mine = m.role === "user";
          return (
            <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className="px-4 py-3 rounded-2xl max-w-[75%] shadow border font-semibold"
                style={{
                  background: mine ? "#eaf2ff" : "#fff4ef",
                  color: mine ? NAVY : ACCENT,
                  borderColor: mine ? "#cfe2ff" : "#ffd8c0",
                }}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        {status === "sending" && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-2xl text-sm font-semibold" style={{ background: "#fff4ef", color: ACCENT, border: `1px solid ${ACCENT}` }}>
              ⏳ يكتب الآن...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          type="text"
          className="flex-1 rounded-2xl px-4 py-3 border"
          style={{ borderColor: "#e5e7eb", color: NAVY }}
          placeholder={status === "preparing" ? "⏳ جاري التحضير..." : "اسأل عن الحصة..."}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={status !== "ready"}
        />
        <button
          onClick={handleSend}
          className="px-6 py-3 rounded-2xl text-white font-bold shadow-md disabled:opacity-50"
          style={{ background: ACCENT }}
          disabled={status !== "ready" || !userInput.trim() || !sourceId}
        >
          إرسال
        </button>
      </div>
    </div>
  );
}

function QuizInline({ api, courseDetailId }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [mcq, setMcq] = useState([]);
  const [tfq, setTfq] = useState([]);
  const [answersMcq, setAnswersMcq] = useState({});
  const [answersTfq, setAnswersTfq] = useState({});
  const [result, setResult] = useState(null);

  const extractErr = (e) =>
    e?.response?.data ? (typeof e.response.data === "string" ? e.response.data : JSON.stringify(e.response.data)) : e?.message || "Unknown error";

  const normMcq = (q) => {
    const Options = Array.isArray(q?.Options ?? q?.options) ? (q?.Options ?? q?.options) : [];
    const ca = q?.CorrectAnswer ?? q?.correctAnswer ?? q?.correct_answer ?? "";
    return { Question: q?.Question ?? q?.question ?? "", Options, CorrectAnswer: String(ca) };
  };
  const normTf = (q) => ({
    Question: q?.Question ?? q?.question ?? "",
    CorrectAnswer:
      typeof (q?.CorrectAnswer ?? q?.correctAnswer ?? q?.correct_answer) === "boolean"
        ? (q?.CorrectAnswer ?? q?.correctAnswer ?? q?.correct_answer)
        : false,
  });

  const loadQuiz = async () => {
    try {
      setStatus("preparing");
      setError("");
      try {
        await api.post(`/api/Ai/Get-fileCoures/${courseDetailId}`, {});
      } catch {}
      const res = await api.get(`/api/Ai/New-Quiz/${courseDetailId}`);
      const data = res.data || {};
      const rawMcq = data.mcqQuestions ?? data.McqQuestions ?? [];
      const rawTf = data.trueFalseQuestions ?? data.TrueFalseQuestions ?? [];
      setMcq(rawMcq.map(normMcq));
      setTfq(rawTf.map(normTf));
      setAnswersMcq({});
      setAnswersTfq({});
      setResult(null);
      setStatus("ready");
    } catch (e) {
      setError(`تعذّر إنشاء الكويز.\n${extractErr(e)}`);
      setStatus("idle");
    }
  };

  const gradeLocally = () => {
    let score = 0;
    mcq.forEach((q, i) => (String(answersMcq[i]) === String(q.CorrectAnswer) ? score++ : 0));
    tfq.forEach((q, i) => (answersTfq[i] === q.CorrectAnswer ? score++ : 0));
    return { score, total: mcq.length + tfq.length };
  };

  const handleSubmit = () => {
    const missMcq = mcq.findIndex((_, i) => !(i in answersMcq));
    const missTf = tfq.findIndex((_, i) => !(i in answersTfq));
    if (missMcq !== -1 || missTf !== -1) {
      setError("أجب على جميع الأسئلة أولًا.");
      return;
    }
    setError("");
    setResult(gradeLocally());
    setStatus("done");
  };

  return (
    <div className="rounded-3xl border-2 p-4" style={{ borderColor: ACCENT, background: "#fff" }}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl" style={{ color: NAVY }}>🎯 كويز سريع</h3>
        <button
          onClick={loadQuiz}
          className="px-5 py-2 rounded-2xl text-white font-bold shadow-md disabled:opacity-50"
          style={{ background: ACCENT }}
          disabled={status === "preparing"}
        >
          {status === "preparing" ? "🔄 أحضّر..." : "🚀 ابدأ الكويز"}
        </button>
      </div>

      {error && (
        <div className="whitespace-pre-wrap p-3 mt-3 rounded-2xl font-semibold" style={{ background: "#fff4ef", color: ACCENT, border: `1px solid ${ACCENT}` }}>
          {error}
        </div>
      )}

      {(status === "ready" || status === "done") && mcq.length + tfq.length > 0 && (
        <div className="mt-4 space-y-4">
          {mcq.map((q, i) => (
            <div key={`m-${i}`} className="rounded-2xl border p-3" style={{ borderColor: "#e5e7eb", background: "#fff" }}>
              <div className="font-bold mb-3" style={{ color: NAVY }}>
                {i + 1}. {q.Question}
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {q.Options.map((opt, j) => {
                  const id = `mcq-${i}-${j}`;
                  return (
                    <label key={id} htmlFor={id} className="flex items-center gap-2 p-3 rounded-xl border cursor-pointer hover:shadow" style={{ borderColor: "#e5e7eb" }}>
                      <input
                        id={id}
                        type="radio"
                        name={`mcq-${i}`}
                        className="w-5 h-5 accent-[#e76f2e]"
                        disabled={status === "done"}
                        checked={answersMcq[i] === opt}
                        onChange={() => setAnswersMcq((p) => ({ ...p, [i]: opt }))}
                      />
                      <span style={{ color: NAVY }}>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {tfq.map((q, i) => (
            <div key={`t-${i}`} className="rounded-2xl border p-3" style={{ borderColor: "#e5e7eb", background: "#fff" }}>
              <div className="font-bold mb-3" style={{ color: NAVY }}>
                {mcq.length + i + 1}. {q.Question}
              </div>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 p-3 rounded-xl border cursor-pointer hover:shadow min-w-[120px] justify-center" style={{ borderColor: "#e5e7eb" }}>
                  <input
                    type="radio"
                    name={`tf-${i}`}
                    className="w-5 h-5 accent-[#22c55e]"
                    disabled={status === "done"}
                    checked={answersTfq[i] === true}
                    onChange={() => setAnswersTfq((p) => ({ ...p, [i]: true }))}
                  />
                  <span>✅ صح</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-xl border cursor-pointer hover:shadow min-w-[120px] justify-center" style={{ borderColor: "#e5e7eb" }}>
                  <input
                    type="radio"
                    name={`tf-${i}`}
                    className="w-5 h-5 accent-[#ef4444]"
                    disabled={status === "done"}
                    checked={answersTfq[i] === false}
                    onChange={() => setAnswersTfq((p) => ({ ...p, [i]: false }))}
                  />
                  <span>❌ خطأ</span>
                </label>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            {result ? (
              <div className="font-bold" style={{ color: NAVY }}>
                نتيجتك:{" "}
                <span className="px-3 py-1 rounded-lg" style={{ background: "#fafafa", border: "1px solid #eee" }}>
                  {result.score} / {result.total}
                </span>
              </div>
            ) : (
              <div className="text-sm" style={{ color: NAVY }}>
                أجب على كل الأسئلة ثم أرسل النتيجة
              </div>
            )}
            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-2xl text-white font-bold shadow-md disabled:opacity-50"
              style={{ background: ACCENT }}
              disabled={
                status !== "ready" ||
                Object.keys(answersMcq).length + Object.keys(answersTfq).length !== mcq.length + tfq.length
              }
              title={
                Object.keys(answersMcq).length + Object.keys(answersTfq).length !== mcq.length + tfq.length
                  ? "أجب على جميع الأسئلة أولًا"
                  : ""
              }
            >
              🏁 إرسال
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
