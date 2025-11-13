// src/pages/student/SummarizePage.jsx

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../api/BASE_URL";

// ✅ هات الـ courseDetailId من الـRedux (بديل الـ URL params)
import { selectActiveCourseDetailId } from "../../store/dataIDs/dataIDsSlice";

export default function SummarizePage() {
  const navigate = useNavigate();

  // 🧠 ID جاي من الريدكس (اللي اتحفظ لما ضغطتي من صفحة التفاصيل)
  const courseDetailId = useSelector(selectActiveCourseDetailId);

  // 🎯 الصفحة بقت لا تعتمد على التوكن (الـ API هنا مش محتاج Authorization)
  // سيبنا التوكن بعيد

  const [status, setStatus] = useState("idle"); // idle | preparing | ready | summarizing | done
  const [error, setError] = useState("");

  const [sourceId, setSourceId] = useState(null);
  const [wordCount, setWordCount] = useState(100); // default
  const [summary, setSummary] = useState("");

  // Axios instance بدون توكن
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: BASE_URL,
      headers: { "Content-Type": "application/json" },
    });
    // لو السيرفر بيرجع 401 لأي سبب، نرجّع المستخدم للّوجين
    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        const st = err?.response?.status;
        if (st === 401 || st === 403) navigate("/login");
        return Promise.reject(err);
      }
    );
    return instance;
  }, [navigate]);

  const extractErr = (e) =>
    e?.response?.data
      ? typeof e.response.data === "string"
        ? e.response.data
        : JSON.stringify(e.response.data)
      : e?.message || "Unknown error";

  // 🔧 API calls (كلها بتستخدم courseDetailId من الريدكس)
  const prepareAI = async () => {
    // كان زمان: /api/Ai/Get-fileCoures/:id
    // فضّلنا نفس النهاية مع الـID من الريدكس
    await api.post(`/api/Ai/Get-fileCoures/${courseDetailId}`, {});
  };

  const newSummarize = async () => {
    const res = await api.get(`/api/Ai/New-Summarize/${courseDetailId}`);
    const data = res.data || {};
    setSourceId(data.sourceId || null);
    if (typeof data.wordCount === "number") setWordCount(data.wordCount);
    setSummary(data.summary || "");
    return data;
  };

  const startSummarize = async (sid, wc) => {
    const payload = { sourceId: sid, wordCount: wc, summary: null };
    const res = await api.post(`/api/Ai/Start-Summarize`, payload);
    return res.data || {};
  };

  // ⛳️ تهيئة الصفحة
  useEffect(() => {
    (async () => {
      // لو دخل مباشرة بدون ما نكون حفظنا الـID في الريدكس
      if (!courseDetailId) {
        setError(
          "لا يمكن فتح صفحة التلخيص مباشرة. من فضلك ارجع إلى تفاصيل المادة واختر الحصة ثم ادخل على التلخيص."
        );
        setStatus("idle");
        return;
      }

      try {
        setStatus("preparing");
        setError("");
        await prepareAI();
        await newSummarize();
        setStatus("ready");
      } catch (e) {
        setError(`تعذّر تهيئة خدمة التلخيص.\n${extractErr(e)}`);
        setStatus("idle");
      }
    })();
  }, [courseDetailId]); // ✅ مابقاش في useParams ولا توكن

  const handleSummarize = async () => {
    if (!sourceId) {
      setError('لم يتم تهيئة جلسة التلخيص بعد. اضغط "تهيئة من جديد".');
      return;
    }

    // ✅ أقل عدد كلمات 20 (وموحّد مع الـinput)
    if (Number(wordCount) < 20) {
      setError("⚠️ لا يمكن إنشاء ملخص بأقل من 20 كلمة. اختر رقم أكبر.");
      return;
    }

    try {
      setStatus("summarizing");
      setError("");
      const data = await startSummarize(sourceId, Number(wordCount) || 100);
      setSummary(data.summary || "");
      setStatus("done");
    } catch (e) {
      const msg = extractErr(e);
      if (String(msg).toLowerCase().includes("expired")) {
        try {
          setStatus("preparing");
          await prepareAI();
          const d = await newSummarize();
          const data = await startSummarize(d.sourceId, Number(wordCount) || 100);
          setSummary(data.summary || "");
          setStatus("done");
          return;
        } catch (re) {
          setError(`تعذّر إعادة التهيئة.\n${extractErr(re)}`);
          setStatus("ready");
          return;
        }
      }
      setError("تعذّر التنفيذ. حاول مرة أخرى.");
      setStatus("ready");
    }
  };

  const handleReset = async () => {
    try {
      setStatus("preparing");
      setError("");
      setSummary("");
      await prepareAI();
      await newSummarize();
      setStatus("ready");
    } catch (e) {
      setError(`تعذّر التهيئة.\n${extractErr(e)}`);
      setStatus("idle");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary || "");
    } catch {}
  };

  const handleDownload = () => {
    const blob = new Blob([summary || ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // اسم الملف مبني على الـID اللي من الريدكس (مش بارامز)
    a.download = `summary-${courseDetailId || "lecture"}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-6 bg-white" dir="rtl">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 border-4 border-[#e76f2e]">
          {/* Error */}
          {error && (
            <div className="whitespace-pre-wrap p-4 text-center rounded-2xl border-2 border-[#e76f2e] bg-[#fff4ef] text-[#e76f2e]">
              <div className="text-2xl mb-2">😔</div>
              <div className="font-bold">عذراً! حدث خطأ</div>
              <div className="mt-2 text-sm">{error}</div>

              {/* زر رجوع لقائمة التفاصيل لو الـID ناقص */}
              {!courseDetailId && (
                <div className="mt-3">
                  <button
                    onClick={() =>
                      navigate("/student/course-details", { replace: true })
                    }
                    className="rounded-lg bg-gray-800 text-white px-4 py-2"
                  >
                    الرجوع لتفاصيل المادة
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="bg-[#fdf7f3] rounded-2xl p-6 border-2 border-[#f7c9ab]">
            <div className="flex items-end gap-4 flex-col md:flex-row">
              <div className="flex-1 w-full">
                <label className="block text-lg font-bold mb-3 text-center text-[#1c2431]">
                  🔢 كم كلمة تريد في الملخص؟
                </label>
                <input
                  type="number"
                  min={20}
                  max={1000}
                  step={10}
                  value={wordCount}
                  onChange={(e) => setWordCount(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 text-lg font-semibold text-center border-2 border-[#e76f2e] focus:outline-none focus:ring-2 focus:ring-[#e76f2e]/50"
                />
                <div className="text-sm text-[#1c2431] mt-2 text-center bg-[#fafafa] rounded-xl p-2 border border-[#eee]">
                  💡 اختر رقم بين 20 و 1000 كلمة
                </div>
              </div>

              <div className="flex gap-3 flex-col md:flex-row w-full md:w-auto">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-2xl bg-gray-300 text-[#1c2431] font-bold hover:bg-gray-400 disabled:opacity-50 transition-all shadow-md"
                  disabled={status === "preparing" || !courseDetailId}
                >
                  🔄 ابدأ من جديد
                </button>
                <button
                  onClick={handleSummarize}
                  className="px-6 py-3 rounded-2xl bg-[#e76f2e] text-white font-bold hover:bg-[#cf5f1f] disabled:opacity-50 transition-all shadow-md"
                  disabled={
                    status === "summarizing" || status === "preparing" || !courseDetailId
                  }
                >
                  {status === "summarizing" ? "⏳ جارٍ العمل..." : "🪄 اصنع الملخص!"}
                </button>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="min-h-[200px] border-2 border-[#e76f2e] rounded-2xl p-6 bg-[#fafafa]">
            {summary ? (
              <div>
                <div className="text-center mb-4">
                  <span className="bg-[#fff4ef] text-[#e76f2e] font-bold px-4 py-2 rounded-full border border-[#e76f2e]">
                    🎉 تم إنشاء الملخص!
                  </span>
                </div>
                <p className="leading-8 whitespace-pre-wrap text-lg text-[#1c2431] bg-white rounded-xl p-4 border border-[#eee] shadow-inner">
                  {summary}
                </p>
              </div>
            ) : (
              <div className="text-center text-[#1c2431] py-12">
                {status === "preparing" ? (
                  <div>
                    <div className="text-4xl mb-4 animate-spin text-[#e76f2e]">📘</div>
                    <div className="text-xl font-bold">جارٍ التحضير... ✨</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-5xl mb-4 text-[#e76f2e]">📚</div>
                    <div className="text-xl font-bold">
                      اضغط على الزر وستظهر النتيجة هنا 🌟
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 flex-col md:flex-row">
            <button
              onClick={handleCopy}
              className="flex-1 px-6 py-4 rounded-2xl bg-[#e76f2e] text-white font-bold hover:bg-[#cf5f1f] disabled:opacity-50 shadow-md"
              disabled={!summary}
            >
              📋 انسخ الملخص
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 px-6 py-4 rounded-2xl bg-[#1c2431] text-white font-bold hover:bg-[#0f1723] disabled:opacity-50 shadow-md"
              disabled={!summary}
            >
              💾 احفظ كملف نصي
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
