// src/pages/student/TranslatePage.jsx
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../api/BASE_URL";

export default function TranslatePage() {
  const { id } = useParams(); // CourseDetailId

  const [status, setStatus] = useState("idle"); // idle | preparing | ready | translating | done
  const [error, setError] = useState("");

  const [uploadedFilePath, setUploadedFilePath] = useState("");
  const [languagesMap, setLanguagesMap] = useState({});
  const [selectedLanguageCode, setSelectedLanguageCode] = useState("");
  const [translation, setTranslation] = useState("");
  const [detectedLanguageInfo, setDetectedLanguageInfo] = useState(null);
  const [transliteration, setTransliteration] = useState(null);

  const retriedRef = useRef(false);

  // -------- helpers --------
  const extractErr = (e) =>
    e?.response?.data
      ? typeof e.response.data === "string"
        ? e.response.data
        : JSON.stringify(e.response.data)
      : e?.message || "Unknown error";

  // بعض الـAPIs ترجع لغات بشكل {label: code} أو {code: label}
  const getLanguageEntries = (obj) => {
    const entries = Object.entries(obj || {});
    return entries.map(([a, b]) => {
      // لو القيمة شكل كود (en/ar/..) نخليها code
      if (typeof b === "string" && /^[a-z]{2,3}(-[A-Z]{2})?$/.test(b)) {
        return [a, b]; // [label, code]
      }
      // العكس: المفتاح هو الكود
      if (typeof a === "string" && /^[a-z]{2,3}(-[A-Z]{2})?$/.test(a)) {
        return [b, a]; // [label, code]
      }
      return [a, String(b)];
    });
  };

  // لازم يتنفّذ قبل أي خدمة AI
  const prepareAI = async () => {
    await axios.post(`${BASE_URL}/api/Ai/Get-fileCoures/${id}`, {});
  };

  const newTranslate = async () => {
    const res = await axios.get(`${BASE_URL}/api/Ai/New-Translate/${id}`);
    const data = res.data || {};
    setUploadedFilePath(data.uploadedFilePath || "");
    setLanguagesMap(data.languages || {});
    const entries = getLanguageEntries(data.languages || {});
    // اختيارات افتراضية مع تفضيل ar ثم en
    const hasAr = entries.find(([, code]) => code === "ar");
    const hasEn = entries.find(([, code]) => code === "en");
    setSelectedLanguageCode(
      data.selectedLanguageCode || hasAr?.[1] || hasEn?.[1] || (entries[0]?.[1] || "")
    );
    setTranslation(data.translation || "");
    setDetectedLanguageInfo(data.detectedLanguageInfo || null);
    setTransliteration(data.transliteration || null);
    return data;
  };

  const startTranslate = async (payload) => {
    const res = await axios.post(`${BASE_URL}/api/Ai/Start-Translate`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data || {};
  };

  // on mount
  useEffect(() => {
    (async () => {
      try {
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
  }, [id]);

  // actions
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

      // إعادة تهيئة تلقائية لو في مشكلة مسار
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
    a.download = `translation-course-${id}-${selectedLanguageCode || "xx"}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const languageEntries = getLanguageEntries(languagesMap);

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 space-y-5">
        <div className="flex items-center justify-between flex-row-reverse">
          <h1 className="text-2xl font-bold">ترجمة الحصة</h1>
          <div
            className="text-xs text-gray-500 text-right max-w-[60%] truncate"
            title={uploadedFilePath}
          >
            {uploadedFilePath || "(لم يتم تحديد ملف بعد)"}
          </div>
        </div>

        {error && (
          <div className="whitespace-pre-wrap p-3 bg-red-50 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">اختر اللغة المستهدفة</label>
            <select
              value={selectedLanguageCode}
              onChange={(e) => setSelectedLanguageCode(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 bg-white disabled:opacity-50"
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
            <div className="text-xs text-gray-500 mt-1">
              سيتم الترجمة من لغة المستند المكتشفة إلى اللغة التي تختارها.
            </div>
          </div>

          <div className="flex gap-2 flex-row-reverse">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
              disabled={status === "preparing"}
            >
              🔄 تهيئة من جديد
            </button>
            <button
              onClick={handleTranslate}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 flex items-center gap-2"
              disabled={status === "translating" || status === "preparing" || !selectedLanguageCode}
            >
              {status === "translating" ? "⏳ جارٍ الترجمة..." : "🧠 ابدأ الترجمة"}
            </button>
          </div>
        </div>

        {/* معلومات إضافية إن وُجدت */}
        {(detectedLanguageInfo || transliteration) && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm space-y-2">
            {detectedLanguageInfo && (
              <div>
                <span className="font-semibold">اللغة المكتشفة:</span>{" "}
                {typeof detectedLanguageInfo === "string"
                  ? detectedLanguageInfo
                  : JSON.stringify(detectedLanguageInfo)}
              </div>
            )}
            {transliteration && (
              <div>
                <span className="font-semibold">Transliteration:</span>{" "}
                {typeof transliteration === "string"
                  ? transliteration
                  : JSON.stringify(transliteration)}
              </div>
            )}
          </div>
        )}

        <div className="min-h-[160px] border rounded-xl p-4 bg-gray-50 text-right">
          {translation ? (
            <p className="leading-7 whitespace-pre-wrap">{translation}</p>
          ) : (
            <div className="text-gray-500">
              {status === "preparing" ? "جارٍ التهيئة…" : "ستظهر الترجمة هنا بعد التنفيذ."}
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-row-reverse">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50"
            disabled={!translation}
          >
            📋 نسخ الترجمة
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
            disabled={!translation}
          >
            💾 تحميل كملف .txt
          </button>
        </div>
      </div>
    </div>
  );
}
