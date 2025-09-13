import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../api/BASE_URL";

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
];
const ordLabel = (n) => ORD[n - 1] || n;

const loadState = (courseId) => {
  try {
    return (
      JSON.parse(localStorage.getItem(`course-join-state:${courseId}`)) || {}
    );
  } catch {
    return {};
  }
};
const saveState = (courseId, s) => {
  try {
    localStorage.setItem(`course-join-state:${courseId}`, JSON.stringify(s));
  } catch {}
};

export default function CourseDetails() {
  const { courseId } = useParams();
  const token = useSelector((s) => s.auth.token);
  const navigate = useNavigate();

  const [lectures, setLectures] = useState([]); // [{id, lectureNo, teacherName, summaryFile, courseName}]
  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  // هنستخدم stateMap بس للتشيك بوكس
  const [stateMap, setStateMap] = useState(() => loadState(courseId));

  useEffect(() => {
    let alive = true;
    async function fetchData() {
      try {
        setLoading(true);
        setErr("");
        const { data } = await axios.get(
          `${BASE_URL}/api/Course/course-lectures/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const arr = (Array.isArray(data) ? data : []).map((lec, idx) => ({
          id: lec.id ?? `lec-${idx + 1}`, // CourseDetailId
          lectureNo: Number(lec.lecture) || idx + 1, // رقم الحصة
          teacherName: lec.teacherName ?? "—",
          summaryFile: lec.summaryFile || null,
          courseName: lec.courseName || "",
        }));

        if (!arr.length) throw new Error("لا توجد حصص متاحة لهذا الكورس.");

        if (alive) {
          setLectures(arr);
          setCourseName(arr[0]?.courseName || "");
        }
      } catch (e) {
        if (alive) {
          setErr(
            e?.response?.data?.message ||
              e?.message ||
              "حدث خطأ أثناء تحميل الحصص."
          );
          setLectures([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }
    fetchData();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    saveState(courseId, stateMap);
  }, [courseId, stateMap]);

  const toggleChecked = (lecId) => {
    setStateMap((s) => ({ ...s, [lecId]: { checked: !s[lecId]?.checked } }));
  };

  // بيفتح صفحة التفاعل مباشرة بدون أي شرط
  const handleEngage = (lec) => {
    navigate(
      `/student/watch-lecture/${lec.id}?courseId=${courseId}&lecNo=${lec.lectureNo}`
    );
  };

  const anyChecked = useMemo(
    () => Object.values(stateMap).some((v) => v?.checked),
    [stateMap]
  );

  return (
    <main dir="rtl" className="bg-gray-50 min-h-screen py-10">
      <section className="mx-auto w-full max-w-6xl px-4 md:px-6 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              تفاصيل المادة
            </h1>
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
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        )}

        {!loading && err && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 p-4">
            {err}
          </div>
        )}

        {!loading && !err && (
          <div className="rounded-2xl border border-gray-300 bg-white p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900">الحصص</h2>
              <span className="text-sm text-gray-600">
                {lectures.length} حصة
              </span>
            </div>

            {lectures.length === 0 ? (
              <div className="text-gray-600">لا توجد حصص متاحة حالياً.</div>
            ) : (
              <ul className="space-y-3">
                {lectures.map((lec) => {
                  const st = stateMap[lec.id] || {};
                  return (
                    <li
                      key={lec.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-300 rounded-xl p-3"
                    >
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="mt-1 h-5 w-5 accent-orange-500"
                          checked={!!st.checked}
                          onChange={() => toggleChecked(lec.id)}
                          aria-label={`اختيار ${lec.lectureNo}`}
                        />
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            الحصة {ordLabel(Number(lec.lectureNo))}
                          </div>
                          <div className="text-sm text-gray-600">
                            المدرّس:{" "}
                            <span className="font-medium text-gray-800">
                              {lec.teacherName}
                            </span>
                          </div>
                          {lec.summaryFile && (
                            <div className="text-xs text-gray-500 mt-1 break-all">
                              ملف الملخص متاح.
                            </div>
                          )}
                        </div>
                      </label>

                      {/* حافظت على نفس توزيع الأزرار تقريباً لكن شلت "انضم الآن" */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEngage(lec)}
                          className="rounded-xl bg-slate-900 hover:opacity-95 text-white font-semibold px-4 py-2"
                          title="تفاعل مع الحصة"
                        >
                          تفاعل مع الحصة
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
