// src/pages/student/StudentAllCourses.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../api/BASE_URL";

export default function StudentAllCourses() {
  const { studentId: idFromRoute } = useParams();
  const token = useSelector((s) => s.auth.token);
  const {id} = useSelector((state) => state.auth);

  const studentId = idFromRoute ?? id; // بديل لو مش متبعتش في الراوت

  const [payload, setPayload] = useState(null); // { studyLevels: [...] }
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [openLevel, setOpenLevel] = useState(null);   // index
  const [openSem, setOpenSem] = useState({});         // { levelIndex: semIndex }

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!studentId || !token) return;
      try {
        setLoading(true);
        setErr("");
        const { data } = await axios.get(
          `${BASE_URL}/api/Student/get-all-courses-by-student-id/${studentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (alive) setPayload(data);
      } catch (e) {
        if (alive) {
          setErr(e?.response?.data?.title || e?.message || "حدث خطأ غير متوقع");
          setPayload(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [studentId, token]);

  const studyLevels = useMemo(
    () => (payload?.studyLevels && Array.isArray(payload.studyLevels) ? payload.studyLevels : []),
    [payload]
  );

  return (
    <section dir="rtl" className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-10 pb-20">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              جميع مواد الطالب
            </h1>

          </div>
          <span className="inline-flex items-center rounded-xl bg-white border border-gray-200 px-3 py-2 text-sm text-gray-700">
            {loading ? "جارِ التحميل…" : `${studyLevels.length} مستوى`}
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-gray-200 p-5">
                <div className="h-6 w-40 bg-gray-100 animate-pulse rounded mb-3" />
                <div className="h-4 w-56 bg-gray-100 animate-pulse rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && err && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 p-4">
            {err}
          </div>
        )}

        {/* Empty */}
        {!loading && !err && studyLevels.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600">
            لا توجد بيانات كورسات محفوظة لهذا الطالب.
          </div>
        )}

        {/* List */}
        {!loading && !err && studyLevels.length > 0 && (
          <div className="space-y-4">
            {studyLevels.map((lvl, li) => {
              const isOpen = openLevel === li;
              return (
                <div key={li} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                  {/* Level header */}
                  <button
                    type="button"
                    onClick={() => setOpenLevel(isOpen ? null : li)}
                    className="w-full flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1">
                        المستوى
                      </span>
                      <h3 className="text-lg md:text-xl font-extrabold text-gray-900">
                        {lvl.level || "—"}
                      </h3>
                    </div>
                    <svg
                      className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Semesters list */}
                  {isOpen && (
                    <div className="px-5 pb-5">
                      {(lvl.semesters || []).length === 0 ? (
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-600">
                          لا توجد فصول دراسية لهذا المستوى.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {lvl.semesters.map((sem, si) => {
                            const semOpen = openSem[li] === si;
                            return (
                              <div key={si} className="rounded-xl border border-gray-200">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenSem((prev) => ({ ...prev, [li]: semOpen ? null : si }))
                                  }
                                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5">
                                      الفصل
                                    </span>
                                    <span className="font-semibold text-gray-800">
                                      {sem.name || `فصل #${sem.id}`}
                                    </span>
                                  </div>
                                  <svg
                                    className={`h-5 w-5 text-gray-500 transition-transform ${semOpen ? "rotate-180" : ""}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>

                                {semOpen && (
                                  <div className="p-4">
                                    {(sem.courses || []).length === 0 ? (
                                      <div className="rounded-lg border border-gray-100 bg-white p-4 text-gray-600">
                                        لا توجد كورسات في هذا الفصل.
                                      </div>
                                    ) : (
                                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {sem.courses.map((crs, ci) => (
                                          <article
                                            key={ci}
                                            className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
                                          >
                                            <h4 className="text-base font-bold text-gray-900">
                                              {crs.name || "بدون اسم"}
                                            </h4>
                                            <p className="text-xs text-gray-600 mt-1">
                                              السنة: <span className="font-semibold">{crs.year || "—"}</span>
                                            </p>
                                          </article>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
