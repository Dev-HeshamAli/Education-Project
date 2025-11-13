// src/pages/student/TranslatePage.jsx
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../api/BASE_URL";
import { selectActiveCourseDetailId } from "../../store/dataIDs/dataIDsSlice";

const ACCENT = "#e76f2e";
const ACCENT_HOVER = "#cf5f1f";
const NAVY = "#1c2431";

export default function TranslatePage() {
  const navigate = useNavigate();
  const token = useSelector((s) => s.auth.token);

  // ✅ بدل useParams: ID من الريدكس
  const courseDetailId = useSelector(selectActiveCourseDetailId);

  const [status, setStatus] = useState("idle"); // idle | preparing | ready | translating | done
  const [error, setError] = useState("");

  const [uploadedFilePath, setUploadedFilePath] = useState("");
  const [languagesMap, setLanguagesMap] = useState({});
  const [selectedLanguageCode, setSelectedLanguageCode] = useState("");
  const [translation, setTranslation] = useState("");
  const [detectedLanguageInfo, setDetectedLanguageInfo] = useState(null);
  const [transliteration, setTransliteration] = useState(null);

  const retriedRef = useRef(false);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: BASE_URL,
      headers: { "Content-Type": "application/json" },
    });
    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        const st = err?.response?.status;
        if (st === 401 || st === 403) navigate("/login");
        return Promise.reject(err);
      }
    );
    return instance;
  }, [token, navigate]);

  const extractErr = (e) =>
    e?.response?.data
      ? typeof e.response.data === "string"
        ? e.response.data
        : JSON.stringify(e.response.data)
      : e?.message || "Unknown error";

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
    return data;
  };
  const startTranslate = async (payload) =>
    (await api.post(`/api/Ai/Start-Translate`, payload)).data || {};

  useEffect(() => {
    (async () => {
      // 🛡️ لو مفيش ID من الريدكس
      if (!courseDetailId) {
        setError("لا يمكن فتح الترجمة مباشرة. ارجع لتفاصيل المادة واختر الحصة ثم ادخل هنا.");
        setStatus("idle");
        return;
      }
      try {
        if (!token) {
          setError("هذه الخدمة تتطلب تسجيل الدخول.");
          setStatus("idle");
          return;
        }
        setStatus("preparing");
        setError("");
        await prepareAI();
        await newTranslate();
        setStatus("ready");
      } catch (e) {
        setError(`تعذّر تهيئة خدمة الترجمة.\n${extractErr(e)}`);
        setStatus("idle");
      }
    })();
  }, [courseDetailId, token]); // ⛳️ مابقاش في useParams

  const handleTranslate = async () => {
    if (!selectedLanguageCode) {
      setError("اختر لغة للترجمة أولًا.");
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
      const text = data.translation || "";

      const looksLikePathError =
        /could not find a part of the path/i.test(text) || /an error occurred/i.test(text);

      if (looksLikePathError && !retriedRef.current) {
        retriedRef.current = true;
        await prepareAI();
        const fresh = await newTranslate();
        const retryPayload = {
          uploadedFilePath: fresh.uploadedFilePath,
          selectedLanguageCode,
          languages: fresh.languages || languagesMap,
          translation: null,
          detectedLanguageInfo: null,
          transliteration: null,
        };
        const retryData = await startTranslate(retryPayload);
        setTranslation(retryData.translation || text);
        setDetectedLanguageInfo(retryData.detectedLanguageInfo || null);
        setTransliteration(retryData.transliteration || null);
        setStatus("done");
        return;
      }

      setTranslation(text);
      setDetectedLanguageInfo(data.detectedLanguageInfo || null);
      setTransliteration(data.transliteration || null);
      setStatus("done");
    } catch (e) {
      setError(`تعذّر تنفيذ الترجمة.\n${extractErr(e)}`);
      setStatus("ready");
    }
  };

  const handleReset = async () => {
    try {
      setStatus("preparing");
      setError("");
      setTranslation("");
      retriedRef.current = false;
      await prepareAI();
      await newTranslate();
      setStatus("ready");
    } catch (e) {
      setError(`تعذّر تهيئة جلسة جديدة.\n${extractErr(e)}`);
      setStatus("idle");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translation || "");
    } catch {}
  };

  const handleDownload = () => {
    const blob = new Blob([translation || ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translation-${courseDetailId || "lecture"}-${selectedLanguageCode || "xx"}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const languageEntries = getLanguageEntries(languagesMap);

  return (
    <div className="min-h-screen p-6 bg-white" dir="rtl">
      <div className="max-w-3xl mx-auto p-6 space-y-6 rounded-3xl border-4 shadow-xl" style={{ borderColor: ACCENT }}>
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-bold" style={{ color: NAVY }}> مترجم الحصص</h1>
        </div>

        {(!courseDetailId || error) && (
          <div className="whitespace-pre-wrap p-4 rounded-3xl border-2 shadow-md"
               style={{ background: "#fff4ef", color: ACCENT, borderColor: ACCENT }}>
            ⚠️ {error || "لا يمكن فتح الترجمة مباشرة."}
            {!courseDetailId && (
              <div className="mt-3 text-center">
                <button
                  onClick={() => navigate("/student/course-details", { replace: true })}
                  className="rounded-lg bg-gray-800 text-white px-4 py-2"
                >
                  الرجوع لتفاصيل المادة
                </button>
              </div>
            )}
          </div>
        )}

        {/* باقي الواجهة كما هي */}
        <div className="grid sm:grid-cols-3 gap-4 items-end">
          <div className="sm:col-span-2 p-4 rounded-3xl border-2"
               style={{ background: "#fdf7f3", borderColor: "#f7c9ab" }}>
            <label className="block text-lg font-bold mb-3" style={{ color: NAVY }}>🌍 اختر لغتك المفضلة</label>
            <select
              value={selectedLanguageCode}
              onChange={(e) => setSelectedLanguageCode(e.target.value)}
              className="w-full rounded-2xl px-4 py-3 text-lg font-semibold bg-white border focus:outline-none"
              disabled={!languageEntries.length}
              style={{ borderColor: ACCENT, color: NAVY }}
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
            <div className="text-sm mt-2 font-medium" style={{ color: NAVY }}>
              ✨ سأكتشف لغة النص وأترجمها للغة التي تريدها!
            </div>
          </div>

          <div className="flex gap-3 flex-row-reverse">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-2xl font-bold disabled:opacity-50 shadow-md"
              style={{ background: "#e5e7eb", color: NAVY }}
              disabled={status === "preparing" || !courseDetailId}
            >
              🔄 ابدأ من جديد
            </button>
            <button
              onClick={handleTranslate}
              className="px-6 py-3 rounded-2xl text-white font-bold disabled:opacity-50 shadow-md"
              style={{ background: ACCENT, border: `2px solid ${ACCENT}` }}
              onMouseOver={(e) => (e.currentTarget.style.background = ACCENT_HOVER)}
              onMouseOut={(e) => (e.currentTarget.style.background = ACCENT)}
              disabled={status === "translating" || status === "preparing" || !selectedLanguageCode || !courseDetailId}
            >
              {status === "translating" ? "⏳ أترجم الآن..." : "🪄 ترجم!"}
            </button>
          </div>
        </div>

        {/*(detectedLanguageInfo || transliteration) && (
          <div className="rounded-3xl border-2 p-5 text-sm shadow-md"
               style={{ background: "#fffefb", borderColor: "#fde7d7", color: NAVY }}>
            {detectedLanguageInfo && (
              <div className="flex items-center gap-2">
                <span className="font-bold" style={{ color: ACCENT }}>🔍 اللغة المكتشفة:</span>{" "}
                <span className="px-3 py-1 rounded-full font-semibold"
                      style={{ background: "#fff4ef", color: ACCENT, border: `1px solid ${ACCENT}` }}>
                  {typeof detectedLanguageInfo === "string" ? detectedLanguageInfo : JSON.stringify(detectedLanguageInfo)}
                </span>
              </div>
            )}
            {transliteration && (
              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold" style={{ color: ACCENT }}>📝 النطق:</span>{" "}
                <span className="px-3 py-1 rounded-full font-semibold"
                      style={{ background: "#fff4ef", color: ACCENT, border: `1px solid ${ACCENT}` }}>
                  {typeof transliteration === "string" ? transliteration : JSON.stringify(transliteration)}
                </span>
              </div>
            )}
          </div>
        )*/}

        <div className="min-h-[200px] rounded-3xl p-6 border-2"
             style={{ background: "#fafafa", borderColor: ACCENT }}>
          {translation ? (
            <p className="leading-8 whitespace-pre-wrap text-lg rounded-xl p-4 border shadow-inner"
               style={{ color: NAVY, background: "#fff", borderColor: "#eee" }}>
              {translation}
            </p>
          ) : (
            <div className="text-center" style={{ color: NAVY }}>
              <div className="text-xl font-bold">
                {status === "preparing" ? "🔄 أجهز الترجمة..." : " ستظهر الترجمة هنا!"}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 flex-row-reverse">
          <button
            onClick={handleCopy}
            className="px-6 py-3 rounded-2xl text-white font-bold disabled:opacity-50 shadow-md"
            style={{ background: ACCENT }}
            onMouseOver={(e) => (e.currentTarget.style.background = ACCENT_HOVER)}
            onMouseOut={(e) => (e.currentTarget.style.background = ACCENT)}
            disabled={!translation}
          >
            📋 انسخ النص
          </button>
          <button
            onClick={handleDownload}
            className="px-6 py-3 rounded-2xl text-white font-bold disabled:opacity-50 shadow-md"
            style={{ background: NAVY }}
            disabled={!translation}
          >
            💾 احفظ في ملف
          </button>
        </div>
      </div>
    </div>
  );
}
