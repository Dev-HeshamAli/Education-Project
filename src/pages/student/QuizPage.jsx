// src/pages/QuizPage.jsx
import axios from "axios";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/BASE_URL";
import { selectActiveCourseDetailId } from "../../store/dataIDs/dataIDsSlice";

const API_BASE = `${BASE_URL}/api/Ai`;
const ACCENT = "#e76f2e";
const ACCENT_HOVER = "#cf5f1f";
const NAVY = "#1c2431";

export default function QuizPage() {
  const navigate = useNavigate();
  const { token } = useSelector((s) => s.auth || {});
  // ✅ بدل useParams: ID من الريدكس
  const courseDetailId = useSelector(selectActiveCourseDetailId);

  const [status, setStatus] = useState("idle"); // idle | preparing | ready | submitting | done
  const [error, setError] = useState("");

  const [mcq, setMcq] = useState([]); // { Question, Options[], CorrectAnswer(string) }
  const [tfq, setTfq] = useState([]); // { Question, CorrectAnswer(boolean) }
  const [quizSid, setQuizSid] = useState(null);

  const [answersMcq, setAnswersMcq] = useState({});
  const [answersTfq, setAnswersTfq] = useState({});

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

  const normMcq = (q) => {
    const Options = Array.isArray(q?.Options ?? q?.options)
      ? q?.Options ?? q?.options
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
        ? q?.CorrectAnswer ?? q?.correctAnswer ?? q?.correct_answer
        : false,
  });

  const loadQuiz = async () => {
    // 🛡️ لو مفيش ID من الريدكس
    if (!courseDetailId) {
      setError(
        "لا يمكن فتح الكويز مباشرة. ارجع لتفاصيل المادة واختر الحصة ثم ادخل هنا."
      );
      setStatus("idle");
      return;
    }

    try {
      setError("");
      setStatus("preparing");

      if (!token) {
        setStatus("idle");
        setError("يلزم تسجيل الدخول لفتح الكويز (التوكن غير موجود).");
        return;
      }

      try {
        await axios.post(
          `${API_BASE}/Get-fileCoures/${courseDetailId}`,
          {},
          jsonCfg
        );
      } catch {}

      const res = await axios.get(
        `${API_BASE}/New-Quiz/${courseDetailId}`,
        authCfg
      );
      const data = res.data || {};

      const sid = data.sourceId ?? data.SourceId ?? null;
      const rawMcq = data.mcqQuestions ?? data.McqQuestions ?? [];
      const rawTf = data.trueFalseQuestions ?? data.TrueFalseQuestions ?? [];

      setQuizSid(sid);
      setMcq(rawMcq.map(normMcq));
      setTfq(rawTf.map(normTf));
      setAnswersMcq({});
      setAnswersTfq({});
      setResult(null);
      setStatus("ready");

      setTimeout(() => {
        document
          .getElementById("quiz-start")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const handleSubmit = async () => {
    try {
      setStatus("submitting");
      setError("");

      if (!token) {
        setStatus("ready");
        setError("يلزم تسجيل الدخول قبل إرسال الإجابات (التوكن غير موجود).");
        return;
      }

      const missingMcq = mcq.findIndex(
        (_, i) => !Object.prototype.hasOwnProperty.call(answersMcq, i)
      );
      const missingTf = tfq.findIndex(
        (_, i) => !Object.prototype.hasOwnProperty.call(answersTfq, i)
      );
      if (missingMcq !== -1 || missingTf !== -1) {
        setStatus("ready");
        setError("يرجى الإجابة على جميع الأسئلة قبل الإرسال.");
        document
          .getElementById("quiz-actions")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      const local = gradeLocally();
      setResult({ ...local });
      setStatus("done");

      setTimeout(() => {
        document
          .getElementById("quiz-result")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    } catch (e) {
      setError(e?.message || "حدث خطأ غير متوقع.");
      setStatus("ready");
    }
  };

  const totalQuestions = mcq.length + tfq.length;
  const answeredCount =
    Object.keys(answersMcq).length + Object.keys(answersTfq).length;
  const submitted = !!result;
  const quizVisible =
    (status === "ready" || status === "done") && totalQuestions > 0;

  const percent = result
    ? Math.round((result.score / result.totalQuestions) * 100)
    : Math.round((answeredCount / Math.max(totalQuestions, 1)) * 100);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-white" dir="rtl">
      <div className="max-w-3xl mx-auto">
        {/* 🛡️ حراسة في أعلى الصفحة لو مفيش ID */}
        {!courseDetailId && (
          <div
            className="rounded-3xl border-2 p-4 mb-4 text-center font-semibold"
            style={{
              color: ACCENT,
              background: "#fff4ef",
              borderColor: ACCENT,
            }}
          >
            لا يمكن فتح الكويز مباشرة. ارجع لتفاصيل المادة واختر الحصة ثم ادخل
            هنا.
            <div className="mt-2">
              <button
                onClick={() =>
                  navigate("/student/course-details", { replace: true })
                }
                className="rounded-lg bg-gray-800 text-white px-4 py-2"
              >
                الرجوع لتفاصيل المادة
              </button>
            </div>
          </div>
        )}

        <div
          className="rounded-3xl border-4 p-6 mb-6 shadow-xl"
          style={{ borderColor: ACCENT, background: "#fff" }}
        >
          <h1
            className="text-[28px] sm:text-[32px] font-bold mb-2"
            style={{ color: NAVY }}
          >
            🧠 امتحان لقياس فهمك
          </h1>
          <p
            className="text-[16px] sm:text-[17px] font-semibold"
            style={{ color: NAVY }}
          >
            🌟 جاوب على كل الأسئلة وشوف نتيجتك!
          </p>

          {!quizVisible && (
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                className="px-8 py-4 rounded-3xl text-white font-bold shadow-md disabled:opacity-50"
                style={{ background: ACCENT, border: `2px solid ${ACCENT}` }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = ACCENT_HOVER)
                }
                onMouseOut={(e) => (e.currentTarget.style.background = ACCENT)}
                disabled={status === "preparing" || !courseDetailId}
                onClick={loadQuiz}
              >
                {status === "preparing" ? "🔄 أحضر امتحان..." : "🚀 يلا نبدأ!"}
              </button>
              {error && (
                <span
                  className="text-[14px] font-semibold rounded-2xl px-4 py-2"
                  style={{
                    color: ACCENT,
                    background: "#fff4ef",
                    border: `2px solid ${ACCENT}`,
                  }}
                >
                  ❌ {error}
                </span>
              )}
            </div>
          )}
        </div>

        {submitted && (
          <div
            id="quiz-result"
            className="rounded-3xl p-6 sm:p-8 mb-6 text-white shadow-xl"
            style={{ background: NAVY, border: "4px solid #fff" }}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="font-bold text-[24px]">نتيجتك</div>
              <div
                className="text-[32px] sm:text-[36px] font-extrabold bg-white text-center px-4 py-2 rounded-2xl"
                style={{ color: NAVY }}
              >
                {result.score} / {result.totalQuestions}
              </div>
            </div>
            <div className="text-[16px] mt-2 font-semibold">
              {percent >= 80
                ? "🌟 ممتاز جداً!"
                : percent >= 50
                ? "🎯 حلو — كمل!"
                : "💪 جرب تاني وهتبقى أفضل!"}
            </div>
          </div>
        )}

        <div id="quiz-start" />

        {mcq.length > 0 && (
          <section className="space-y-6">
            <h2
              className="text-[20px] sm:text-[22px] font-bold p-4 rounded-2xl border text-center"
              style={{
                color: NAVY,
                background: "#f8fafc",
                borderColor: "#e5e7eb",
              }}
            >
              MCQ
            </h2>
            {mcq.map((q, i) => {
              const ua = answersMcq[i];
              const isCorrect =
                submitted && String(ua) === String(q.CorrectAnswer);

              return (
                <div
                  key={`mcq-${i}`}
                  className="rounded-3xl shadow-md p-5 sm:p-6 border"
                  style={{ background: "#fff", borderColor: "#e5e7eb" }}
                >
                  <div
                    className="font-bold mb-4 text-[18px] sm:text-[20px] text-left"
                    dir="ltr"
                    style={{ color: NAVY }}
                  >
                    <span
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white mr-2"
                      style={{ background: NAVY }}
                    >
                      {i + 1}
                    </span>
                    {q.Question}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2" dir="ltr">
                    {(q.Options ?? []).map((opt, j) => {
                      const idOpt = `mcq-${i}-${j}`;
                      const isSelected = ua === opt;

                      const submittedNow = !!result;
                      const afterSubmitStyle = submittedNow
                        ? opt === q.CorrectAnswer
                          ? {
                              borderColor: "#22c55e",
                              background: "#ecfdf5",
                              color: "#065f46",
                            }
                          : isSelected
                          ? {
                              borderColor: "#ef4444",
                              background: "#fef2f2",
                              color: "#7f1d1d",
                            }
                          : { opacity: 0.7 }
                        : { borderColor: "#e5e7eb", background: "#fff" };

                      return (
                        <label
                          key={idOpt}
                          htmlFor={idOpt}
                          className="flex items-center gap-3 p-4 rounded-2xl border cursor-pointer text-[16px] font-semibold shadow-sm hover:shadow"
                          style={afterSubmitStyle}
                        >
                          <input
                            id={idOpt}
                            type="radio"
                            name={`mcq-${i}`}
                            className="w-5 h-5 accent-[#e76f2e]"
                            disabled={submittedNow}
                            checked={isSelected}
                            onChange={() =>
                              setAnswersMcq((prev) => ({ ...prev, [i]: opt }))
                            }
                          />
                          <span style={{ color: NAVY }}>{opt}</span>
                        </label>
                      );
                    })}
                  </div>

                  {submitted && !isCorrect && (
                    <div
                      className="mt-4 text-[14px] rounded-2xl p-4 font-semibold"
                      style={{
                        background: "#ecfdf5",
                        color: "#065f46",
                        border: "1px solid #a7f3d0",
                      }}
                    >
                      <span className="font-bold">🎯 الإجابة الصحيحة: </span>
                      {q.CorrectAnswer}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {tfq.length > 0 && (
          <section className="space-y-6 mt-8">
            <h2
              className="text-[20px] sm:text-[22px] font-bold p-4 rounded-2xl border text-center"
              style={{
                color: NAVY,
                background: "#f8fafc",
                borderColor: "#e5e7eb",
              }}
            >
              True or False
            </h2>
            {tfq.map((q, i) => {
              const ua = answersTfq[i];
              const isCorrect = submitted && ua === q.CorrectAnswer;

              const yesStyle = submitted
                ? q.CorrectAnswer === true
                  ? {
                      borderColor: "#22c55e",
                      background: "#ecfdf5",
                      color: "#065f46",
                    }
                  : ua === true
                  ? {
                      borderColor: "#ef4444",
                      background: "#fef2f2",
                      color: "#7f1d1d",
                    }
                  : { borderColor: "#e5e7eb", background: "#fff" }
                : { borderColor: "#e5e7eb", background: "#fff" };

              const noStyle = submitted
                ? q.CorrectAnswer === false
                  ? {
                      borderColor: "#22c55e",
                      background: "#ecfdf5",
                      color: "#065f46",
                    }
                  : ua === false
                  ? {
                      borderColor: "#ef4444",
                      background: "#fef2f2",
                      color: "#7f1d1d",
                    }
                  : { borderColor: "#e5e7eb", background: "#fff" }
                : { borderColor: "#e5e7eb", background: "#fff" };

              return (
                <div
                  dir="ltr"
                  key={`tf-${i}`}
                  className="rounded-3xl shadow-md p-5 sm:p-6 border"
                  style={{ background: "#fff", borderColor: "#e5e7eb" }}
                >
                  <div
                    className="font-bold mb-4 text-[18px] sm:text-[20px]"
                    style={{ color: NAVY }}
                  >
                    <span
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white mr-2"
                      style={{ background: NAVY }}
                    >
                      {mcq.length + i + 1}
                    </span>
                    {q.Question}
                  </div>
                  <div className="flex gap-4 flex-row-reverse justify-center">
                    <label
                      className="flex items-center gap-3 p-4 rounded-2xl border cursor-pointer text-[18px] font-bold shadow-sm hover:shadow min-w-[120px] justify-center"
                      style={yesStyle}
                    >
                      <input
                        type="radio"
                        name={`tf-${i}`}
                        className="w-5 h-5 accent-[#22c55e]"
                        disabled={submitted}
                        checked={ua === true}
                        onChange={() =>
                          setAnswersTfq((prev) => ({ ...prev, [i]: true }))
                        }
                      />
                      <span> True</span>
                    </label>

                    <label
                      className="flex items-center gap-3 p-4 rounded-2xl border cursor-pointer text-[18px] font-bold shadow-sm hover:shadow min-w-[120px] justify-center"
                      style={noStyle}
                    >
                      <input
                        type="radio"
                        name={`tf-${i}`}
                        className="w-5 h-5 accent-[#ef4444]"
                        disabled={submitted}
                        checked={ua === false}
                        onChange={() =>
                          setAnswersTfq((prev) => ({ ...prev, [i]: false }))
                        }
                      />
                      <span> False</span>
                    </label>
                  </div>

                  {submitted && !isCorrect && (
                    <div
                      className="mt-4 text-[14px] rounded-2xl p-4 font-semibold"
                      style={{
                        background: "#ecfdf5",
                        color: "#065f46",
                        border: "1px solid #a7f3d0",
                      }}
                    >
                      <span className="font-bold">🎯 الإجابة الصحيحة: </span>
                      {q.CorrectAnswer ? " صح" : " خطأ"}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {quizVisible && (
          <div id="quiz-actions" className="mt-8">
            <div
              className="rounded-3xl border-4 p-5 sm:p-6 flex flex-wrap items-center gap-4 justify-between shadow-xl"
              style={{ background: "#fff", borderColor: ACCENT }}
            >
              <div
                className="text-[15px] sm:text-[16px] font-semibold"
                style={{ color: NAVY }}
              >
                {submitted ? (
                  <>
                    🎉 تم الإرسال! النتيجة:{" "}
                    <span
                      className="font-bold px-2 py-1 rounded-lg"
                      style={{
                        background: "#fafafa",
                        border: "1px solid #eee",
                      }}
                    >
                      {result?.score}
                    </span>{" "}
                    / {result?.totalQuestions}
                  </>
                ) : (
                  <>
                    📝 أُجيب على{" "}
                    <span
                      className="font-bold px-2 py-1 rounded-lg"
                      style={{
                        background: "#fafafa",
                        border: "1px solid #eee",
                      }}
                    >
                      {Math.min(
                        Object.keys(answersMcq).length +
                          Object.keys(answersTfq).length,
                        mcq.length + tfq.length
                      )}
                    </span>{" "}
                    من {mcq.length + tfq.length}
                  </>
                )}
                {error && (
                  <span className="ms-2 font-bold" style={{ color: ACCENT }}>
                    ⚠️ {error}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="px-6 py-3 rounded-2xl text-white font-bold shadow-md disabled:opacity-50"
                  style={{ background: ACCENT, border: `2px solid ${ACCENT}` }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = ACCENT_HOVER)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = ACCENT)
                  }
                  onClick={handleSubmit}
                  disabled={
                    submitted ||
                    !(
                      Object.keys(answersMcq).length +
                        Object.keys(answersTfq).length ===
                      mcq.length + tfq.length
                    ) ||
                    status === "submitting"
                  }
                  title={
                    !submitted &&
                    !(
                      Object.keys(answersMcq).length +
                        Object.keys(answersTfq).length ===
                      mcq.length + tfq.length
                    )
                      ? "أجب على جميع الأسئلة أولًا"
                      : ""
                  }
                >
                  🏆 أرسل الإجابات
                </button>

                <button
                  className="px-6 py-3 rounded-2xl text-white font-bold shadow-md"
                  style={{ background: NAVY }}
                  onClick={loadQuiz}
                  disabled={status === "preparing" || !courseDetailId}
                >
                  🔄 جرّب تاني
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
