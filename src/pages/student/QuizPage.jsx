// QuizPage.jsx
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

/**
 * سياسة الإرسال:
 * - عند الضغط على "إرسال الإجابات":
 *   1) POST  /api/Ai/Get-fileCoures/{id}
 *   2) GET   /api/Ai/New-Quiz/{id}   => نحصل على sourceId جديد + نفس الأسئلة غالبًا
 *   3) نعيد مواءمة إجابات الطالب بالاسم (question) لو تغيّر ترتيب الأسئلة
 *   4) POST  /api/Ai/Quiz-Result     (بدون correct_answer)
 *
 * ملاحظات:
 * - كل Endpoints الخاصة بالـ AI لا تحتاج توكن.
 * - لا نرسل correct_answer في الطلب، نخلي السيرفر يقيّم.
 */

const API_BASE = "https://edu-smart.runasp.net/api/Ai";

export default function QuizPage() {
  const { id } = useParams();


  const [status, setStatus] = useState("idle"); // idle | preparing | ready | submitting | done
  const [error, setError] = useState("");

  // بيانات الكويز المعروضة
  const [mcq, setMcq] = useState([]);
  const [tfq, setTfq] = useState([]);

  // إجابات الطالب (بالـ index)
  const [answersMcq, setAnswersMcq] = useState({});
  const [answersTfq, setAnswersTfq] = useState({});

  // النتيجة
  const [result, setResult] = useState(null);

  const totalLocalQuestions = useMemo(
    () => (mcq?.length || 0) + (tfq?.length || 0),
    [mcq, tfq]
  );

  // تحميل الكويز لبدء الحل (لا يعتمد على جلسة قديمة وقت الإرسال)
  const loadQuiz = async () => {
    try {
      setError("");
      setStatus("preparing");
      // تجهيز الملف ثم إنشاء كويز جديد للعرض
      await axios.post(`${API_BASE}/Get-fileCoures/${id}`, {});
      const res = await axios.get(`${API_BASE}/New-Quiz/${id}`);
      const data = res.data || {};
      setMcq(Array.isArray(data.mcqQuestions) ? data.mcqQuestions : []);
      setTfq(Array.isArray(data.trueFalseQuestions) ? data.trueFalseQuestions : []);
      setAnswersMcq({});
      setAnswersTfq({});
      setResult(null);
      setStatus("ready");
    } catch (e) {
      const msg = e?.response?.data
        ? typeof e.response.data === "string"
          ? e.response.data
          : JSON.stringify(e.response.data)
        : e.message;
      setError(`تعذّر إنشاء الكويز.\n${msg || ""}`);
      setStatus("idle");
    }
  };

  // إرسال دائمًا على جلسة جديدة
  const handleSubmit = async () => {
  // تأكد من الإجابة على كل الأسئلة الظاهرة على الشاشة حاليًا
  const missingMcq = mcq.findIndex((_, i) => !Object.prototype.hasOwnProperty.call(answersMcq, i));
  const missingTf  = tfq.findIndex((_, i) => !Object.prototype.hasOwnProperty.call(answersTfq, i));
  if (missingMcq !== -1 || missingTf !== -1) {
    setError("يرجى الإجابة على جميع الأسئلة قبل الإرسال.");
    return;
  }

  try {
    setStatus("submitting");
    setError("");

    // 1) حضّر الملف  2) أنشئ كويز جديد للحصول على sourceId وأسئلة حديثة
    await axios.post(`${API_BASE}/Get-fileCoures/${id}`, {});
    const qres = await axios.get(`${API_BASE}/New-Quiz/${id}`);
    const qdata = qres.data || {};
    const newSid = qdata.sourceId;
    const newMcq = Array.isArray(qdata.mcqQuestions) ? qdata.mcqQuestions : [];
    const newTf  = Array.isArray(qdata.trueFalseQuestions) ? qdata.trueFalseQuestions : [];

    // مواءمة إجاباتك بالاسم (السؤال) لو تغيّر الترتيب
    const savedMcqByQuestion = {};
    mcq.forEach((q, i) => (savedMcqByQuestion[q.question] = answersMcq[i]));
    const savedTfByQuestion = {};
    tfq.forEach((q, i) => (savedTfByQuestion[q.question] = answersTfq[i]));

    const remapMcq = {};
    newMcq.forEach((q, i) => {
      if (q?.question in savedMcqByQuestion) remapMcq[i] = savedMcqByQuestion[q.question];
    });
    const remapTf = {};
    newTf.forEach((q, i) => {
      if (q?.question in savedTfByQuestion) remapTf[i] = savedTfByQuestion[q.question];
    });

    // ✅ ابني الـ payload بالأسماء اللي الباك اند طالبها + أرسل CorrectAnswer
    const payload = {
      sourceId: newSid,
      McqQuestions: newMcq.map((q, i) => ({
        question: q.question,
        options: q.options,
        CorrectAnswer: q.correct_answer ?? q.correctAnswer, // خُدها من رد New-Quiz
        UserAnswer: remapMcq[i], // لازم تكون موجودة
      })),
      TrueFalseQuestions: newTf.map((q, i) => ({
        question: q.question,
        CorrectAnswer: (typeof q.correct_answer !== "undefined" ? q.correct_answer : q.correctAnswer) ?? false,
        UserAnswer: remapTf[i], // boolean
      })),
      isSubmitted: true,
      totalQuestions: (newMcq?.length || 0) + (newTf?.length || 0),
    };

    // فاليديشن قبل الإرسال: تأكد إن مفيش UserAnswer فاضي
    const missingUserMcq = payload.McqQuestions.findIndex(q => typeof q.UserAnswer === "undefined");
    const missingUserTf  = payload.TrueFalseQuestions.findIndex(q => typeof q.UserAnswer === "undefined");
    if (missingUserMcq !== -1 || missingUserTf !== -1) {
      setError("تعذر مواءمة بعض الإجابات مع الكويز الجديد. افتح الكويز واضغط إرسال مرة أخرى.");
      setStatus("ready");
      return;
    }

    const submitRes = await axios.post(`${API_BASE}/Quiz-Result`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    // حدّث العرض بالنسخة الجديدة
    setMcq(newMcq);
    setTfq(newTf);
    setAnswersMcq(remapMcq);
    setAnswersTfq(remapTf);
    setResult(submitRes.data || { score: 0 });
    setStatus("done");
  } catch (e) {
    const msg = e?.response?.data
      ? (typeof e.response.data === "string" ? e.response.data : JSON.stringify(e.response.data))
      : e.message;
    setError(`تعذّر إرسال الإجابات أو حساب النتيجة.\n${msg || ""}`);
    setStatus("ready");
  }
};


  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
  <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6">
    <div className="flex items-center justify-between flex-row-reverse">
      <h1 className="text-2xl font-bold">اختبار تفاعلي</h1>
      <div className="text-sm text-gray-500">CourseDetailId: {id}</div>
    </div>

    {error && (
      <div className="whitespace-pre-wrap p-3 bg-red-50 text-red-700 rounded-xl">
        {error}
      </div>
    )}

    <div className="flex gap-3 flex-row-reverse">
      <button
        className="px-4 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50"
        disabled={status === "preparing"}
        onClick={loadQuiz}
      >
        {status === "preparing" ? "جارٍ التحضير..." : "📝 ابدأ الكويز"}
      </button>
      <button
        className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
        onClick={handleSubmit}
        disabled={mcq.length === 0 && tfq.length === 0 || status === "submitting"}
      >
        {status === "submitting" ? "⏳ جارٍ الإرسال..." : "📤 إرسال الإجابات"}
      </button>
    </div>

    {/* MCQ */}
    {mcq?.length > 0 && (
      <section className="space-y-5">
        <h2 className="text-lg font-semibold">أسئلة اختيار من متعدد</h2>
        {mcq.map((q, i) => (
          <div key={`mcq-${i}`} className="border rounded-xl p-4">
            <div className="font-medium mb-2">
              {i + 1}. {q.question}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options?.map((opt, j) => {
                const idOpt = `mcq-${i}-${j}`;
                return (
                  <label
                    key={idOpt}
                    htmlFor={idOpt}
                    className="flex items-center gap-2 p-2 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      id={idOpt}
                      type="radio"
                      name={`mcq-${i}`}
                      className="accent-sky-600"
                      checked={answersMcq[i] === opt}
                      onChange={() =>
                        setAnswersMcq((prev) => ({ ...prev, [i]: opt }))
                      }
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    )}

    {/* True / False */}
    {tfq?.length > 0 && (
      <section className="space-y-5">
        <h2 className="text-lg font-semibold">صح أم خطأ</h2>
        {tfq.map((q, i) => (
          <div key={`tf-${i}`} className="border rounded-xl p-4">
            <div className="font-medium mb-3">
              {i + 1}. {q.question}
            </div>
            <div className="flex gap-4 flex-row-reverse">
              <label className="flex items-center gap-2 p-2 rounded-lg border hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={`tf-${i}`}
                  className="accent-sky-600"
                  checked={answersTfq[i] === true}
                  onChange={() =>
                    setAnswersTfq((prev) => ({ ...prev, [i]: true }))
                  }
                />
                <span>صح</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg border hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={`tf-${i}`}
                  className="accent-sky-600"
                  checked={answersTfq[i] === false}
                  onChange={() =>
                    setAnswersTfq((prev) => ({ ...prev, [i]: false }))
                  }
                />
                <span>خطأ</span>
              </label>
            </div>
          </div>
        ))}
      </section>
    )}

    {/* نتيجة الكويز */}
    {result && (
      <section className="mt-6 border-t pt-4 text-sm space-y-4 text-right">
        <h2 className="text-lg font-semibold text-emerald-700">✅ تم إرسال الإجابات</h2>
        {typeof result.score !== "undefined" && (
          <div className="font-medium text-gray-800">
            الدرجة: {result.score} / {result.totalQuestions ?? totalLocalQuestions}
          </div>
        )}
        {Array.isArray(result.mcqQuestions) && (
          <details className="mt-2">
            <summary className="cursor-pointer font-semibold text-blue-700">تفاصيل أسئلة الاختيار</summary>
            <ul className="mt-2 list-disc me-5 text-sm space-y-1">
              {result.mcqQuestions.map((q, i) => (
                <li key={`rm-${i}`}>
                  <div><span className="font-medium">السؤال:</span> {q.question}</div>
                  <div>إجابتك: {String(q.userAnswer)}</div>
                  <div>الصحيحة: {String(q.correct_answer)}</div>
                </li>
              ))}
            </ul>
          </details>
        )}
        {Array.isArray(result.trueFalseQuestions) && (
          <details className="mt-2">
            <summary className="cursor-pointer font-semibold text-blue-700">تفاصيل أسئلة الصح والخطأ</summary>
            <ul className="mt-2 list-disc me-5 text-sm space-y-1">
              {result.trueFalseQuestions.map((q, i) => (
                <li key={`rt-${i}`}>
                  <div><span className="font-medium">السؤال:</span> {q.question}</div>
                  <div>إجابتك: {String(q.userAnswer)}</div>
                  <div>الصحيحة: {String(q.correct_answer)}</div>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>
    )}
  </div>
</div>

  );
}
