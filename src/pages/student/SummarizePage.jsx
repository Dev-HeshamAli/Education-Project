// src/pages/student/SummarizePage.jsx
// تعتمد على 3 Endpoints بدون توكن:
// 1) POST /api/Ai/Get-fileCoures/{id}
// 2) GET  /api/Ai/New-Summarize/{id}
// 3) POST /api/Ai/Start-Summarize

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../api/BASE_URL";

export default function SummarizePage() {
  const { id } = useParams(); // CourseDetailId

  const [status, setStatus] = useState("idle"); // idle | preparing | ready | summarizing | done
  const [error, setError] = useState("");

  // بيانات التلخيص
  const [sourceId, setSourceId] = useState(null);
  const [wordCount, setWordCount] = useState(100);
  const [summary, setSummary] = useState("");

  // ===== Helpers =====
  const extractErr = (e) =>
    e?.response?.data
      ? typeof e.response.data === "string"
        ? e.response.data
        : JSON.stringify(e.response.data)
      : e?.message || "Unknown error";

  // لازم يتنفّذ قبل أي خدمة AI
  const prepareAI = async () => {
    await axios.post(`${BASE_URL}/api/Ai/Get-fileCoures/${id}`, {});
  };

  const newSummarize = async () => {
    const res = await axios.get(`${BASE_URL}/api/Ai/New-Summarize/${id}`);
    const data = res.data || {};
    setSourceId(data.sourceId || null);
    if (typeof data.wordCount === "number") setWordCount(data.wordCount);
    setSummary(data.summary || "");
    return data;
  };

  const startSummarize = async (sid, wc) => {
    const payload = { sourceId: sid, wordCount: wc, summary: null };
    const res = await axios.post(`${BASE_URL}/api/Ai/Start-Summarize`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data || {};
  };

  // ===== On mount =====
  useEffect(() => {
    (async () => {
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
  }, [id]);

  // ===== Actions =====
  const handleSummarize = async () => {
    if (!sourceId) {
      setError('لم يتم تهيئة جلسة التلخيص بعد. اضغط "تهيئة من جديد".');
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
      // لو الجلسة منتهية نحاول إعادة التهيئة مرة واحدة
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
          setError(`تعذّر إعادة تهيئة الجلسة.\n${extractErr(re)}`);
          setStatus("ready");
          return;
        }
      }
      setError(`تعذّر تنفيذ التلخيص.\n${msg}`);
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
      setError(`تعذّر تهيئة جلسة جديدة.\n${extractErr(e)}`);
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
    a.download = `summary-course-${id}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 space-y-5">
        <div className="flex items-center justify-between flex-row-reverse">
          <h1 className="text-2xl font-bold">ملخّص الحصة</h1>
          <div className="text-sm text-gray-500">CourseDetailId: {id}</div>
        </div>

        {error && (
          <div className="whitespace-pre-wrap p-3 bg-red-50 text-red-700 rounded-xl">{error}</div>
        )}

        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-700 mb-1">عدد الكلمات التقريبي</label>
            <input
              type="number"
              min={50}
              max={1000}
              step={50}
              value={wordCount}
              onChange={(e) => setWordCount(e.target.value)}
              className="w-full border rounded-xl px-3 py-2"
            />
            <div className="text-xs text-gray-500 mt-1">المدى المقترح 50–1000 كلمة</div>
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
              onClick={handleSummarize}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
              disabled={status === "summarizing" || status === "preparing"}
            >
              {status === "summarizing" ? "⏳ جارٍ التلخيص..." : "🧠 ابدأ التلخيص"}
            </button>
          </div>
        </div>

        <div className="min-h-[160px] border rounded-xl p-4 bg-gray-50 text-right">
          {summary ? (
            <p className="leading-7 whitespace-pre-wrap">{summary}</p>
          ) : (
            <div className="text-gray-500">
              {status === "preparing" ? "جارٍ التهيئة…" : "سيظهر الملخّص هنا بعد التنفيذ."}
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-row-reverse">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50"
            disabled={!summary}
          >
            📋 نسخ الملخص
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
            disabled={!summary}
          >
            💾 تحميل كملف .txt
          </button>
        </div>
      </div>
    </div>
  );
}
