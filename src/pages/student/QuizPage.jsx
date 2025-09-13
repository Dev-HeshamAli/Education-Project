// src/pages/QuizPage.jsx
import axios from "axios";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const API_BASE = "https://edu-smart.runasp.net/api/Ai";

export default function QuizPage() {
  const { id } = useParams();
  const { token } = useSelector((s) => s.auth || {});

  const [status, setStatus] = useState("idle"); // idle | preparing | ready | submitting | done
  const [error, setError] = useState("");

  // بيانات موحّدة داخليًا
  const [mcq, setMcq] = useState([]); // { Question, Options[], CorrectAnswer(string) }
  const [tfq, setTfq] = useState([]); // { Question, CorrectAnswer(boolean) }
  const [quizSid, setQuizSid] = useState(null);

  // إجابات المستخدم
  const [answersMcq, setAnswersMcq] = useState({});
  const [answersTfq, setAnswersTfq] = useState({});

  // النتيجة المحلية
  const [result, setResult] = useState(null);

  const authCfg = useMemo(
    () => ({
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }),
    [token]
  );
  const jsonCfg = useMemo(
    () => ({
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }),
    [token]
  );

  // --- تطبيع رد New-Quiz ---
  const normMcq = (q) => {
    const Options = Array.isArray(q?.Options ?? q?.options)
      ? (q?.Options ?? q?.options)
      : [];
    const ca = q?.CorrectAnswer ?? q?.correctAnswer ?? q?.correct_answer ?? "";
    return {
      Question: q?.Question ?? q?.question ?? "",
      Options,
      CorrectAnswer: String(ca),
    };
  };
  const normTf = (q) => ({
    Question: q?.Question ?? q?.question ?? "",
    CorrectAnswer:
      typeof (q?.CorrectAnswer ?? q?.correctAnswer ?? q?.correct_answer) ===
      "boolean"
        ? (q?.CorrectAnswer ?? q?.correctAnswer ?? q?.correct_answer)
        : false,
  });

  // --- تحميل الكويز ---
  const loadQuiz = async () => {
    try {
      setError("");
      setStatus("preparing");

      if (!token) {
        setStatus("idle");
        setError("يلزم تسجيل الدخول لفتح الكويز (التوكن غير موجود).");
        return;
      }

      try {
        await axios.post(`${API_BASE}/Get-fileCoures/${id}`, {}, jsonCfg);
      } catch {}

      const res = await axios.get(`${API_BASE}/New-Quiz/${id}`, authCfg);
      const data = res.data || {};

      const sid = data.sourceId ?? data.SourceId ?? null;
      const rawMcq = data.mcqQuestions ?? data.McqQuestions ?? [];
      const rawTf = data.trueFalseQuestions ?? data.TrueFalseQuestions ?? [];

      const m = rawMcq.map(normMcq);
      const t = rawTf.map(normTf);

      setQuizSid(sid);
      setMcq(m);
      setTfq(t);
      setAnswersMcq({});
      setAnswersTfq({});
      setResult(null);
      setStatus("ready");

      // سكرول لأول سؤال
      setTimeout(() => {
        document.getElementById("quiz-start")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
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

  // --- تصحيح محلي ---
  const gradeLocally = () => {
    let score = 0;

    const mcqResult = mcq.map((q, i) => {
      const ua = answersMcq[i];
      const isCorrect = String(ua) === String(q.CorrectAnswer);
      if (isCorrect) score++;
      return {
        question: q.Question,
        options: q.Options,
        userAnswer: ua,
        correct_answer: q.CorrectAnswer,
        isCorrect,
      };
    });

    const tfResult = tfq.map((q, i) => {
      const ua = answersTfq[i];
      const isCorrect = typeof ua === "boolean" && ua === q.CorrectAnswer;
      if (isCorrect) score++;
      return {
        question: q.Question,
        userAnswer: ua,
        correct_answer: q.CorrectAnswer,
        isCorrect,
      };
    });

    return {
      score,
      totalQuestions: mcq.length + tfq.length,
      mcqQuestions: mcqResult,
      trueFalseQuestions: tfResult,
    };
  };

  // --- إرسال (محلي فقط) ---
  const handleSubmit = () => {
    try {
      setStatus("submitting");
      setError("");

      if (!token) {
        setStatus("ready");
        setError("يلزم تسجيل الدخول قبل إرسال الإجابات (التوكن غير موجود).");
        return;
      }

      // تأكد إن الكل مُجاب
      const missingMcq = mcq.findIndex(
        (_, i) => !Object.prototype.hasOwnProperty.call(answersMcq, i)
      );
      const missingTf = tfq.findIndex(
        (_, i) => !Object.prototype.hasOwnProperty.call(answersTfq, i)
      );
      if (missingMcq !== -1 || missingTf !== -1) {
        setStatus("ready");
        setError("يرجى الإجابة على جميع الأسئلة قبل الإرسال.");
        document.getElementById("quiz-actions")?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      const local = gradeLocally();
      setResult({ ...local });
      setStatus("done");

      setTimeout(() => {
        document.getElementById("quiz-result")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    } catch (e) {
      setError(e?.message || "حدث خطأ غير متوقع.");
      setStatus("ready");
    }
  };

  // --- حسابات واجهة ---
  const totalQuestions = mcq.length + tfq.length;
  const answeredCount =
    Object.keys(answersMcq).length + Object.keys(answersTfq).length;
  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0;
  const submitted = !!result;
  const quizVisible = (status === "ready" || status === "done") && totalQuestions > 0;

  const percent = result
    ? Math.round((result.score / result.totalQuestions) * 100)
    : Math.round((answeredCount / Math.max(totalQuestions, 1)) * 100);

  const verdictColor =
    submitted && percent >= 80
      ? "from-emerald-500 to-teal-500"
      : submitted && percent >= 50
      ? "from-sky-500 to-indigo-500"
      : "from-rose-500 to-pink-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        {/* كارت تمهيدي */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 text-[16px] sm:text-[17px]">
          <h1 className="text-[20px] sm:text-[22px] font-bold text-slate-800 mb-1.5">اختبار تفاعلي</h1>
          <p className="text-[14px] sm:text-[15px] text-gray-600">
            جاوب على جميع الأسئلة.   
          </p>

          {/* زر بدء الكويز يظهر فقط قبل ما الامتحان يبان */}
          {!quizVisible && (
            <div className="flex flex-wrap gap-2.5 mt-3">
              <button
                className="px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 text-[14px] sm:text-[15px]"
                disabled={status === "preparing"}
                onClick={loadQuiz}
              >
                {status === "preparing" ? "جارٍ التحضير..." : "ابدأ الكويز"}
              </button>
              {error && (
                <span className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-2 py-1">
                  {error}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Banner النتيجة */}
        {submitted && (
          <div
            id="quiz-result"
            className={`rounded-2xl p-4 sm:p-5 mb-6 text-white shadow-sm bg-gradient-to-r ${verdictColor} text-[16px] sm:text-[17px]`}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="font-semibold">
                {percent >= 80 ? "نتيجة ممتازة" : percent >= 50 ? "نتيجة جيدة" : "محاولة جيدة"}
              </div>
              <div className="text-[20px] sm:text-[22px] font-extrabold">
                {result.score} / {result.totalQuestions}
              </div>
            </div>
            <div className="text-[13px] mt-0.5 opacity-95">
              {percent >= 80
                ? "استمرار رائع — أحسنت!"
                : percent >= 50
                ? "مستوى جيّد — تقدر ترفع نتيجتك بالمراجعة."
                : "لا بأس — جرّب مرة تانية وهتتحسن بإذن الله."}
            </div>
          </div>
        )}

        {/* نقطة بداية الأسئلة */}
        <div id="quiz-start" />

        {/* MCQ */}
        {mcq.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[15px] sm:text-[16px] font-semibold text-slate-700">أسئلة اختيار من متعدد</h2>
            {mcq.map((q, i) => {
              const ua = answersMcq[i];
              const isCorrect = submitted && String(ua) === String(q.CorrectAnswer);

              return (
                <div
                  key={`mcq-${i}`}
                  className={`rounded-2xl border bg-white shadow-sm p-4 sm:p-5 ${
                    submitted ? "border-gray-200" : "border-slate-200"
                  }`}
                >
                  <div className="font-medium mb-2 text-gray-900 text-[16px]">
                    {i + 1}. {q.Question}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(q.Options ?? []).map((opt, j) => {
                      const idOpt = `mcq-${i}-${j}`;
                      const isSelected = ua === opt;

                      const afterSubmitClass = submitted
                        ? opt === q.CorrectAnswer
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                          : isSelected
                          ? "border-rose-500 bg-rose-50 text-rose-900"
                          : "opacity-90"
                        : "";

                      return (
                        <label
                          key={idOpt}
                          htmlFor={idOpt}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border transition hover:bg-gray-50 cursor-pointer text-[15px] ${afterSubmitClass}`}
                        >
                          <input
                            id={idOpt}
                            type="radio"
                            name={`mcq-${i}`}
                            className="accent-slate-800"
                            disabled={submitted}
                            checked={isSelected}
                            onChange={() =>
                              setAnswersMcq((prev) => ({ ...prev, [i]: opt }))
                            }
                          />
                          <span className="text-gray-800">{opt}</span>

                          {submitted && opt === q.CorrectAnswer && (
                            <span className="ms-auto text-[11px] rounded-full px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200">
                              صحيح
                            </span>
                          )}
                          {submitted && isSelected && opt !== q.CorrectAnswer && (
                            <span className="ms-auto text-[11px] rounded-full px-2 py-0.5 bg-rose-100 text-rose-700 border border-rose-200">
                              خطأ
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {submitted && !isCorrect && (
                    <div className="mt-2.5 text-[13px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-2">
                      <span className="font-medium">الإجابة الصحيحة: </span>
                      {q.CorrectAnswer}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* True / False */}
        {tfq.length > 0 && (
          <section className="space-y-4 mt-6">
            <h2 className="text-[15px] sm:text-[16px] font-semibold text-slate-700">صح أم خطأ</h2>
            {tfq.map((q, i) => {
              const ua = answersTfq[i];
              const isCorrect = submitted && ua === q.CorrectAnswer;

              const yesClass =
                submitted && q.CorrectAnswer === true
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                  : submitted && ua === true && q.CorrectAnswer !== true
                  ? "border-rose-500 bg-rose-50 text-rose-900"
                  : "";

              const noClass =
                submitted && q.CorrectAnswer === false
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                  : submitted && ua === false && q.CorrectAnswer !== false
                  ? "border-rose-500 bg-rose-50 text-rose-900"
                  : "";

              return (
                <div key={`tf-${i}`} className="rounded-2xl border bg-white shadow-sm p-4 sm:p-5 border-gray-200">
                  <div className="font-medium mb-2 text-gray-900 text-[16px]">
                    {mcq.length + i + 1}. {q.Question}
                  </div>
                  <div className="flex gap-3 flex-row-reverse">
                    <label
                      className={`flex items-center gap-2 p-2.5 rounded-xl border transition hover:bg-gray-50 cursor-pointer text-[15px] ${yesClass}`}
                    >
                      <input
                        type="radio"
                        name={`tf-${i}`}
                        className="accent-slate-800"
                        disabled={submitted}
                        checked={ua === true}
                        onChange={() =>
                          setAnswersTfq((prev) => ({ ...prev, [i]: true }))
                        }
                      />
                      <span>صح</span>
                      {submitted && q.CorrectAnswer === true && (
                        <span className="ms-auto text-[11px] rounded-full px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200">
                          صحيح
                        </span>
                      )}
                      {submitted && ua === true && q.CorrectAnswer !== true && (
                        <span className="ms-auto text-[11px] rounded-full px-2 py-0.5 bg-rose-100 text-rose-700 border border-rose-200">
                          خطأ
                        </span>
                      )}
                    </label>

                    <label
                      className={`flex items-center gap-2 p-2.5 rounded-xl border transition hover:bg-gray-50 cursor-pointer text-[15px] ${noClass}`}
                    >
                      <input
                        type="radio"
                        name={`tf-${i}`}
                        className="accent-slate-800"
                        disabled={submitted}
                        checked={ua === false}
                        onChange={() =>
                          setAnswersTfq((prev) => ({ ...prev, [i]: false }))
                        }
                      />
                      <span>خطأ</span>
                      {submitted && q.CorrectAnswer === false && (
                        <span className="ms-auto text-[11px] rounded-full px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200">
                          صحيح
                        </span>
                      )}
                      {submitted && ua === false && q.CorrectAnswer !== false && (
                        <span className="ms-auto text-[11px] rounded-full px-2 py-0.5 bg-rose-100 text-rose-700 border border-rose-200">
                          خطأ
                        </span>
                      )}
                    </label>
                  </div>

                  {submitted && !isCorrect && (
                    <div className="mt-2.5 text-[13px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-2">
                      <span className="font-medium">الإجابة الصحيحة: </span>
                      {q.CorrectAnswer ? "صح" : "خطأ"}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* الأزرار — أسفل الصفحة بعد آخر سؤال */}
        {quizVisible && (
          <div id="quiz-actions" className="mt-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center gap-3 justify-between">
              <div className="text-[13px] sm:text-[14px] text-slate-600">
                {submitted ? (
                  <>
                    تم الإرسال. الدرجة:{" "}
                    <span className="font-semibold text-slate-900">{result?.score}</span> / {result?.totalQuestions}
                  </>
                ) : (
                  <>
                    أُجيب على{" "}
                    <span className="font-medium text-slate-900">
                      {Math.min(
                        Object.keys(answersMcq).length + Object.keys(answersTfq).length,
                        mcq.length + tfq.length
                      )}
                    </span>{" "}
                    من {mcq.length + tfq.length}
                  </>
                )}
                {error && <span className="ms-2 text-rose-700">{error}</span>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 text-[14px] sm:text-[15px]"
                  onClick={handleSubmit}
                  disabled={submitted || !(Object.keys(answersMcq).length + Object.keys(answersTfq).length === mcq.length + tfq.length) || status === "submitting"}
                  title={!submitted && !(Object.keys(answersMcq).length + Object.keys(answersTfq).length === mcq.length + tfq.length) ? "أجب على جميع الأسئلة أولًا" : ""}
                >
                  إرسال الإجابات
                </button>

                <button
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-900 hover:bg-gray-200 text-[14px] sm:text-[15px] border border-gray-200"
                  onClick={loadQuiz}
                  disabled={status === "preparing"}
                >
                  إعادة الكويز
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}