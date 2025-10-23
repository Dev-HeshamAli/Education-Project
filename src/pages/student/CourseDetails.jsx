// src/pages/student/CourseDetails.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/BASE_URL";
import {
  selectCourseID,
  setLectureContext,
  setActiveCourseDetailId,
} from "../../store/dataIDs/dataIDsSlice";

const ORD = [
  "الأولى",
  "الثانية",
  "الثالثة",
  "الرابعة",
  "الخامسة",
  "السادسة",
  "السابعة",
  "الثامنة",
  "التاسعة",
  "العاشرة",
  "الحادية عشرة",
  "الثانية عشرة",
  "الثالثة عشرة",
  "الرابعة عشرة",
  "الخامسة عشرة"
];
const ordLabel = (n) => ORD[n-1] || n;

export default function CourseDetails() {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const courseId = useSelector(selectCourseID); // من Redux
  const navigate = useNavigate();

  const [lectures, setLectures] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    if (!courseId) {
      setLoading(false);
      setErr("لا يمكن فتح تفاصيل المادة مباشرة. من فضلك ادخل من قائمة المواد الحالية.");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const { data } = await axios.get(
          `${BASE_URL}/api/Course/course-lectures/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const arr = (Array.isArray(data) ? data : []).map((lec, idx) => ({
          id: lec.id ?? `lec-${idx+1}`,
          lectureNo: Number(lec.lecture ?? lec.lec ?? lec.no) || (idx + 1),
          teacherName: lec.teacherName ?? "—",
          summaryFile: lec.summaryFile || null,
          courseName: lec.courseName || "",
          lectureVideo: lec.lectureVideo || lec.LectureVideo || "",
          lectureCartoonVideo: lec.lectureCartoonVideo || lec.lectureCartonVideo || "",
          cartonVideoSummaryFile: lec.cartonVideoSummaryFile || "",
        }));

        if (!arr.length) throw new Error("لا توجد حصص متاحة لهذه المادة.");

        if (alive) {
          setLectures(arr);
          setCourseName(arr[0]?.courseName || "");
        }
      } catch (e) {
        if (alive) {
          setErr(e?.response?.data?.message || e?.message || "حدث خطأ أثناء تحميل الحصص.");
          setLectures([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [courseId, token]);

  // فتح صفحة المشاهدة بدون URL params
  const openWatch = (lec, kind = "lecture", version = 1) => {
    dispatch(setLectureContext({
      courseDetailId: lec.id,
      courseId,
      lecNo: lec.lectureNo,
      kind,       // "lecture" | "cartoon" | "auto"
      version,    // 1
    }));
    navigate("/student/watch-lecture");
  };

  // (اختياري) أنشطة من هنا بدون URL
  const goSummary   = (courseDetailId) => { dispatch(setActiveCourseDetailId(courseDetailId)); navigate("/student/summarize-page"); };
  const goChat      = (courseDetailId) => { dispatch(setActiveCourseDetailId(courseDetailId)); navigate("/student/chat-page"); };
  const goTranslate = (courseDetailId) => { dispatch(setActiveCourseDetailId(courseDetailId)); navigate("/student/translate-page"); };
  const goQuiz      = (courseDetailId) => { dispatch(setActiveCourseDetailId(courseDetailId)); navigate("/student/quiz-page"); };

  return (
    <main dir="rtl" className="bg-gray-50 min-h-screen py-10">
      <section className="mx-auto w-full max-w-6xl px-4 md:px-6 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">تفاصيل المادة</h1>
            {courseName && (
              <p className="text-gray-600 mt-1">
                المادة: <span className="font-semibold">{courseName}</span>
              </p>
            )}
          </div>
        </header>

        {loading && (
          <div className="rounded-2xl border border-gray-300 bg-white p-5 space-y-3">
            <div className="h-6 w-1/3 bg-gray-100 animate-pulse rounded" />
            {[...Array(5)].map((_,i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        )}

        {!loading && err && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 p-4">
            {err}
            <div className="mt-3">
              <button
                onClick={() => navigate("/student/current-courses", { replace: true })}
                className="rounded-lg bg-gray-800 text-white px-4 py-2"
              >
                الرجوع لقائمة المواد
              </button>
            </div>
          </div>
        )}

        {!loading && !err && (
          <div className="rounded-2xl border border-gray-300 bg-white p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900">الحصص</h2>
              <span className="text-sm text-gray-600">{lectures.length} حصة</span>
            </div>

            {lectures.length === 0 ? (
              <div className="text-gray-600">لا توجد حصص متاحة حالياً.</div>
            ) : (
              <ul className="space-y-3">
                {lectures.map((lec) => (
                  <li
                    key={lec.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-300 rounded-xl p-3"
                  >
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        الحصة {ordLabel(Number(lec.lectureNo))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      {/* النسخة العادية */}
                      <button
                        type="button"
                        onClick={() => openWatch(lec, "lecture", 1)}
                        className="rounded-xl bg-slate-900 hover:opacity-95 text-white font-semibold px-4 py-2"
                        title="مشاهدة النسخة العادية"
                      >
                        مشاهدة الدرس
                      </button>

                      {/* النسخة الكرتونية (لو متاحة) */}
                      {/*{lec.lectureCartoonVideo && (
                        <button
                          type="button"
                          onClick={() => openWatch(lec, "cartoon", 1)}
                          className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2"
                          title="مشاهدة النسخة الكرتونية"
                        >
                          النسخة الكرتونية
                        </button>
                      )}*/}

                      {/* (اختياري) الأنشطة من هنا */}
                      {/*<button onClick={() => goSummary(lec.id)}   className="rounded-lg border px-3 py-2">📚 ملخص</button>
                      <button onClick={() => goChat(lec.id)}      className="rounded-lg border px-3 py-2">💬 دردشة</button>
                      <button onClick={() => goTranslate(lec.id)} className="rounded-lg border px-3 py-2">🌍 ترجمة</button>
                      <button onClick={() => goQuiz(lec.id)}      className="rounded-lg border px-3 py-2">🏆 اختبار</button>
                    */}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
