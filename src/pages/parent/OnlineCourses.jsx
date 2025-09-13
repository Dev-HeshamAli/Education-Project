// src/pages/parent/OnlineCoursesPlan.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../api/BASE_URL";

// ✅ استيراد الثنك والسيلكتورز (عدّلي المسار لو مختلف عندك)
import {
  fetchStudentProfile,
  selectStudentProfileById,
  selectStudentProfileLoading,
  selectStudentProfileError,
} from "../../store/student/studentSlice";

export default function OnlineCourses() {
  const { planId, studentId } = useParams();
  const token = useSelector((s) => s.auth.token);
  const { id: parentId } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  // ---------- حالات عامة ----------
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // كورسات الخطة (UI فقط)
  const [planInfo, setPlanInfo] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // ---------- الفترة + الجدول ----------
  const [scheduleTimes, setScheduleTimes] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [classSchedule, setClassSchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleErr, setScheduleErr] = useState("");

  // ---------- الليفيلات من الشيرد ----------
  const [studyLevels, setStudyLevels] = useState([]); // سنطبّعها إلى [{id, name}, ...]
  const [levelsLoading, setLevelsLoading] = useState(false);

  // ---------- بروفايل الطالب ----------
  const studentProfile = useSelector((s) =>
    selectStudentProfileById(s, Number(studentId))
  );
  const studentProfileLoading = useSelector((s) =>
    selectStudentProfileLoading(s, Number(studentId))
  );
  const studentProfileError = useSelector((s) =>
    selectStudentProfileError(s, Number(studentId))
  );

  const authHeaders = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        accept: "*/*",
      },
    }),
    [token]
  );

  // ===============================
  // Helpers
  // ===============================
  // مطبّع مقارنة للأسماء
  const canon = (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "")
      // تحويلات شائعة
      .replace(/^primary/, "pr")
      .replace(/^p(?=\d)/, "pr")
      .replace(/^grade(?=\d)/, "pr");

  // مطابقة اسم المستوى مع قائمة الشيرد (المطبّعة إلى {id, name})
  const findLevelIdByName = (levels, levelName) => {
    if (!levelName || !Array.isArray(levels)) return null;
    const target = canon(levelName);

    // محاولة مطابقة مباشرة
    let hit = levels.find((lv) => canon(lv?.name ?? lv?.level) === target);
    if (hit?.id) return hit.id;

    // محاولات مرنة
    hit = levels.find((lv) => {
      const c = canon(lv?.name ?? lv?.level);
      return c.includes(target) || target.includes(c);
    });
    return hit?.id ?? null;
  };

  // ===============================
  // Fetches
  // ===============================

  // ✅ بروفايل الطالب (يجيب semesterId + levelName/level)
  useEffect(() => {
    if (!token || !studentId) return;
    if (!studentProfile && !studentProfileLoading) {
      dispatch(fetchStudentProfile({ studentId: Number(studentId), token }));
    }
  }, [token, studentId, studentProfile, studentProfileLoading, dispatch]);

  // ✅ كورسات الخطة (UI فقط)
  useEffect(() => {
    if (!token || !planId || !studentId) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(""); setMsg("");
        const url = `${BASE_URL}/api/Subscription/All-Courses-plans-to-Enroll`;
        const body = { planId: Number(planId), studentId: Number(studentId), parentId: Number(parentId) };
        const { data } = await axios.post(url, body, authHeaders);
        if (!mounted) return;
        setPlanInfo(
          data && Array.isArray(data.courses)
            ? data
            : { planName: "", studentName: "", studyLevel: "", semesterName: "", courses: [] }
        );
      } catch (e) {
        if (!mounted) return;
        const friendly =
          e?.response?.status === 403 ? "ليس لديك صلاحية لعرض هذه البيانات."
          : e?.response?.status === 404 ? "لا توجد بيانات متاحة."
          : e?.response?.data?.title || e?.message || "حدث خطأ غير متوقع";
        setErr(friendly);
        setPlanInfo(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [token, planId, studentId, parentId, authHeaders]);

  // ✅ الفترات
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/Shared/Schedule-Times`, authHeaders);
        const arr = Array.isArray(data) ? data : [];
        setScheduleTimes(arr);
        if (arr.length === 1) setSelectedSchedule(String(arr[0].id));
      } catch (e) {
        console.error("فشل تحميل الفترات:", e);
      }
    })();
  }, [token, authHeaders]);

  // ✅ الليفيلات من الشيرد (الـ endpoint بيرجع {id, maxStudntNumber, level})
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLevelsLoading(true);
        const { data } = await axios.get(`${BASE_URL}/api/Shared/StudyLevels`, authHeaders);
        const raw = Array.isArray(data) ? data : [];
        // طبّع إلى {id, name}
        const normalized = raw.map((lv) => ({
          id: lv.id,
          name: lv.level, // << المهم هنا
        }));
        setStudyLevels(normalized);
      } catch (e) {
        console.error("فشل تحميل المستويات (Study-Levels):", e);
        setStudyLevels([]);
      } finally {
        setLevelsLoading(false);
      }
    })();
  }, [token, authHeaders]);

  // ===============================
  // IDs المستخرجة للجدول
  // ===============================
  const semesterIdFromProfile = useMemo(() => {
    const p = studentProfile || {};
    return (
      p.semesterId ??
      p.semsterId ??
      p.semesterID ??
      null
    );
  }, [studentProfile]);

  const levelNameFromProfile = useMemo(() => {
    const p = studentProfile || {};
    console.log(p.levelName)
    return (
      p.levelName ??
      p.studyLevel ??
      p.level ??           // بعض الـ APIs بترجع level
      p?.level?.name ??    // لو متعشّش
      ""
    );
  }, [studentProfile]);

  const yearIdFromProfile = useMemo(() => {
    const p = studentProfile || {};
    return p.yearId ?? p.yearID ?? undefined;
  }, [studentProfile]);

  const levelIdFromLevels = useMemo(() => {
    if (!levelNameFromProfile) return null;
    return findLevelIdByName(studyLevels, levelNameFromProfile);
  }, [studyLevels, levelNameFromProfile]);

  // ===============================
  // جدول الحصص
  // ===============================
  async function fetchClassSchedule({ studyLevelId, semesterId, scheduleTimeId, yearId }) {
    if (!studyLevelId || !semesterId || !scheduleTimeId) return;
    try {
      setScheduleLoading(true);
      setScheduleErr("");
      setClassSchedule(null);
      const url = `${BASE_URL}/api/Student/class-schedule/${Number(studyLevelId)}/${Number(semesterId)}/${Number(scheduleTimeId)}${yearId ? `?YearId=${Number(yearId)}` : ""}`;
      const { data } = await axios.get(url, authHeaders);
      setClassSchedule(data || null);
    } catch (e) {
      const apiMsg = e?.response?.data?.title || e?.response?.data?.message || e?.message || "تعذر تحميل الجدول.";
      setScheduleErr(apiMsg);
      setClassSchedule(null);
    } finally {
      setScheduleLoading(false);
    }
  }

  // ✅ نادِي الجدول لما تختاري فترة + IDs جاهزة من البروفايل/الليفيلات
  useEffect(() => {
    if (!selectedSchedule) return;
    if (studentProfileLoading || levelsLoading) return;

    const finalLevelId = levelIdFromLevels;
    const finalSemesterId = semesterIdFromProfile;

        console.log("maram" , finalLevelId)

    if (!finalLevelId) {
      setScheduleErr("تعذر تحديد levelId من اسم المستوى في بروفايل الطالب.");
      setClassSchedule(null);
      return;
    }
    if (!finalSemesterId) {
      setScheduleErr("تعذر تحديد semesterId من بروفايل الطالب.");
      setClassSchedule(null);
      return;
    }

    fetchClassSchedule({
      studyLevelId: finalLevelId,
      semesterId: finalSemesterId,
      scheduleTimeId: Number(selectedSchedule),
      yearId: yearIdFromProfile, // لو متاح
    });

    const el = document.getElementById("classScheduleSection");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSchedule, levelIdFromLevels, semesterIdFromProfile, yearIdFromProfile, studentProfileLoading, levelsLoading]);

  // ===============================
  // Totals (UI)
  // ===============================
  const { totalFinal, totalOld, countSelected, selectedCourses } = useMemo(() => {
    const list = planInfo?.courses || [];
    const map = new Map(list.map(c => [c.courseId, c]));
    let f = 0, o = 0;
    const sel = [];
    selectedIds.forEach(cid => {
      const it = map.get(cid);
      if (it) {
        f += Number(it.finalPrice || 0);
        o += Number(it.oldPrice || 0);
        sel.push(it);
      }
    });
    return { totalFinal: f, totalOld: o, countSelected: selectedIds.length, selectedCourses: sel };
  }, [selectedIds, planInfo?.courses]);

  const discountPct = totalOld > totalFinal && totalOld > 0
    ? Math.round((1 - totalFinal / totalOld) * 100)
    : 0;

  const allIds = useMemo(() => (planInfo?.courses || []).map(c => c.courseId), [planInfo?.courses]);
  const isAllSelected = allIds.length > 0 && selectedIds.length === allIds.length;
  const toggleAll = () => setSelectedIds(prev => (prev.length === allIds.length ? [] : allIds));
  const toggleCourse = (cid) =>
    setSelectedIds(prev => prev.includes(cid) ? prev.filter(x => x !== cid) : [...prev, cid]);

  // ===============================
  // Enroll
  // ===============================
  const enrollAll = async () => {
    if (!token) return;
    if (!selectedSchedule) {
      setErr("⚠️ برجاء اختيار الفترة أولًا لعرض الجدول وتفعيل الاشتراك.");
      return;
    }
    setErr(""); setMsg("");
    try {
      setPosting(true);
      const body = { planId: Number(planId), studentId: Number(studentId), parentId: Number(parentId) };
      await axios.post(`${BASE_URL}/api/Subscription/All-Courses-plans-to-Enroll`, body, authHeaders);
      setMsg("تم الاشتراك في الخطة بنجاح.");
    } catch (e) {
      const friendly =
        e?.response?.status === 400 ? "الطلب غير صالح. راجع بيانات الاشتراك."
        : e?.response?.status === 409 ? "هذا الطالب مشترك بالفعل."
        : e?.response?.data?.title || e?.message || "تعذر إتمام الاشتراك.";
      setErr(friendly);
    } finally {
      setPosting(false);
    }
  };

  // ===============================
  // UI values
  // ===============================
  const studentName =
    planInfo?.studentName ||
    studentProfile?.studentName ||
    studentProfile?.name ||
    "—";

  const levelNameUI =
    levelNameFromProfile ||
    planInfo?.studyLevel ||
    "—";

  const semesterNameUI =
    studentProfile?.semesterName ||
    studentProfile?.semsterName ||
    planInfo?.semesterName ||
    "—";

  return (
    <section dir="rtl" className="min-h-[70vh] w-full bg-slate-100 py-10 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-900">الكورسات الأونلاين</h1>
          <span className="inline-flex items-center rounded-full bg-slate-200 text-slate-800 text-sm font-semibold px-3 py-1">
            {loading ? "جارِ التحميل…" : `${planInfo?.courses?.length || 0} كورس`}
          </span>
        </div>

        {/* Alerts */}
        {!!err && <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-base">{err}</div>}
        {!!msg && <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-base">{msg}</div>}
        {!!studentProfileError && <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-base">{studentProfileError}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* يسار: أدوات + قائمة الكورسات + اختيار الفترة + الجدول */}
          <div className="lg:col-span-2 space-y-6">
            {/* Toolbar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={toggleAll}
                  className="rounded-full border border-slate-300 bg-white px-5 py-2 text-base text-slate-800 hover:bg-slate-50"
                >
                  {isAllSelected ? "إلغاء تحديد الكل" : "تحديد الكل"}
                </button>

                <div className="ms-auto flex flex-wrap items-center gap-4">
                  <div className="text-base text-slate-700">
                    الإجمالي القديم:
                    <span className="ms-2 line-through text-slate-400">
                      {Number(totalOld || 0).toLocaleString()} EGP
                    </span>
                  </div>
                  <div className="text-base font-bold text-emerald-700">
                    الإجمالي النهائي:
                    <span className="ms-2">
                      {Number(totalFinal || 0).toLocaleString()} EGP
                    </span>
                  </div>
                  <div className="text-base text-slate-600">
                    المختار:
                    <span className="ms-2 font-semibold text-slate-800">{countSelected}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* قائمة الكورسات */}
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl bg-white shadow-sm border border-slate-200 animate-pulse" />
                ))}
              </div>
            ) : !planInfo ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 text-lg">
                لا توجد بيانات متاحة.
              </div>
            ) : (planInfo.courses || []).length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 text-lg">
                لا توجد كورسات متاحة الآن لهذه الخطة.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                {planInfo.courses.map((c) => {
                  const checked = selectedIds.includes(c.courseId);
                  return (
                    <label
                      key={c.courseId}
                      className={[
                        "rounded-2xl border bg-white shadow-sm transition-all p-5 cursor-pointer select-none flex gap-3",
                        checked ? "border-slate-900 ring-2 ring-slate-200" : "border-slate-200 hover:shadow-md",
                      ].join(" ")}
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-800"
                        checked={checked}
                        onChange={() => toggleCourse(c.courseId)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-bold text-slate-900 truncate">{c.courseName}</h3>
                        </div>
                        <div className="mt-3 flex items-center gap-3 text-base">
                          <span className="line-through text-slate-400">
                            {Number(c.oldPrice || 0).toLocaleString()} EGP
                          </span>
                          <span className="font-semibold text-emerald-700">
                            {Number(c.finalPrice || 0).toLocaleString()} EGP
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {/* اختيار الفترة */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <label className="block text-[18px] font-extrabold text-slate-900 mb-1">
                    الفترة <span className="text-slate-500 font-medium">(توقيت الدراسة)</span>
                  </label>
                  <p className="text-slate-600 text-[15px] mt-2">
                    اختاري <span className="font-semibold">صباحي</span> أو <span className="font-semibold">مسائي</span> لعرض
                    <span className="font-semibold"> جدول الحصص</span> بالأسفل.
                  </p>
                </div>
              </div>

              <fieldset className="mt-4" aria-required="true" role="radiogroup">
                <legend className="sr-only">اختيار الفترة (توقيت الدراسة)</legend>
                <div className="flex flex-wrap gap-3">
                  {scheduleTimes.map((st) => {
                    const active = String(st.id) === String(selectedSchedule);
                    return (
                      <label
                        key={st.id}
                        className={[
                          "cursor-pointer rounded-xl border px-5 py-3 text-base transition select-none",
                          active
                            ? "border-slate-900 bg-slate-100 text-slate-900 ring-2 ring-slate-300"
                            : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                        ].join(" ")}
                        title={st?.description || st?.name}
                      >
                        <input
                          type="radio"
                          name="scheduleTime"
                          value={st.id}
                          checked={active}
                          onChange={() => setSelectedSchedule(String(st.id))}
                          className="sr-only"
                          aria-label={st?.name}
                        />
                        <div className="font-bold">{st.name}</div>
                        {st?.timeRange && (
                          <div className="text-slate-600 text-sm mt-0.5">{st.timeRange}</div>
                        )}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {!selectedSchedule && (
                <div className="mt-3 text-[15px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  ⚠️ اختيار الفترة ضروري لعرض الجدول وتفعيل زر الاشتراك.
                </div>
              )}
            </div>

            {/* جدول الحصص */}
            <div id="classScheduleSection" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold text-slate-900">جدول الحصص</h2>
              </div>

              {!selectedSchedule && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
                  سيظهر <span className="font-semibold">الجدول</span> هنا بعد اختيار الفترة بالأعلى.
                </div>
              )}

              {selectedSchedule && (studentProfileLoading || levelsLoading) && (
                <div role="status" className="text-base text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  جاري تجهيز بيانات الطالب/المستويات…
                </div>
              )}

              {selectedSchedule && !scheduleLoading && scheduleErr && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
                  {scheduleErr}
                </div>
              )}

              {selectedSchedule && scheduleLoading && (
                <div role="status" className="text-base text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  جاري تحميل الجدول…
                </div>
              )}

              {selectedSchedule && !scheduleLoading && classSchedule && (
                <div className="mt-4">
                  <p className="text-base text-slate-700 mb-3">
                    {classSchedule.name} — ({classSchedule.scheduleTime}) • المستوى: {classSchedule.studyLevel} • الفصل: {classSchedule.semester}
                  </p>

                  {Array.isArray(classSchedule.scheduleDayes) && classSchedule.scheduleDayes.length > 0 ? (
                    <ul className="space-y-4">
                      {classSchedule.scheduleDayes.map((day) => (
                        <li key={day.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                          <div className="font-bold text-lg text-slate-900 mb-3">{day.dayName}</div>

                          {day.lectures?.length ? (
                            <div className="overflow-x-auto">
                              <table className="w-full text-right">
                                <thead>
                                  <tr className="bg-slate-100 text-slate-800 border-y border-slate-200">
                                    <th className="py-3 px-4 text-[15px] font-semibold">اسم المادة</th>
                                    <th className="py-3 px-4 text-[15px] font-semibold">المعلم</th>
                                    <th className="py-3 px-4 text-[15px] font-semibold">من</th>
                                    <th className="py-3 px-4 text-[15px] font-semibold">إلى</th>
                                  </tr>
                                </thead>
                                <tbody className="text-slate-900">
                                  {day.lectures.map((lec, idx) => (
                                    <tr key={lec.id || idx} className={`border-t border-slate-100 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                                      <td className="py-3 px-4 font-medium">{lec.courseName ?? "—"}</td>
                                      <td className="py-3 px-4">{lec.teacherName ?? "—"}</td>
                                      <td className="py-3 px-4">{lec.startTime?.slice(0,5) ?? "—"}</td>
                                      <td className="py-3 px-4">{lec.endTime?.slice(0,5) ?? "—"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-base text-slate-600">لا توجد محاضرات لهذا اليوم.</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-base text-slate-600 mt-3">لا يوجد جدول متاح لهذه الفترة.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* يمين: ملخص الاشتراك */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">ملخص الاشتراك</h3>

                  <div className="grid grid-cols-2 gap-y-2 text-base">
                    <span className="text-slate-600">الطالب</span>
                    <span className="font-semibold text-slate-900 text-end">
                      {planInfo?.studentName || studentName}
                    </span>

                    <span className="text-slate-600">المستوى</span>
                    <span className="font-semibold text-slate-900 text-end">{levelNameUI}</span>

                    <span className="text-slate-600">الفصل</span>
                    <span className="font-semibold text-slate-900 text-end">{semesterNameUI}</span>

                    <span className="text-slate-600">الفترة المختارة</span>
                    <span className="font-semibold text-slate-900 text-end">
                      {selectedSchedule
                        ? (scheduleTimes.find((x) => String(x.id) === String(selectedSchedule))?.name || "—")
                        : "—"}
                    </span>

                    <span className="text-slate-600">عدد المواد المختارة</span>
                    <span className="font-semibold text-slate-900 text-end">{countSelected}</span>
                  </div>

                  {selectedCourses.length > 0 && (
                    <>
                      <p className="mt-5 mb-2 text-base font-semibold text-slate-900">المواد المختارة</p>
                      <ul className="grid grid-cols-2 gap-2">
                        {selectedCourses.map((c) => (
                          <li key={c.courseId} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                            {c.courseName}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-extrabold text-emerald-600">
                          {Number(totalFinal || 0).toLocaleString()} <span className="text-lg">EGP</span>
                        </div>
                        <div className="text-base line-through text-slate-400">
                          {Number(totalOld || 0).toLocaleString()} EGP
                        </div>
                      </div>

                      {discountPct > 0 && (
                        <span className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                          وفر {discountPct}%
                        </span>
                      )}
                    </div>

                    <button
                      onClick={enrollAll}
                      disabled={posting || selectedIds.length === 0 || !selectedSchedule}
                      className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-white text-lg font-bold hover:bg-slate-800 transition disabled:opacity-50"
                    >
                      {posting ? "جارِ التأكيد…" : (!selectedSchedule ? "اختاري الفترة أولًا" : "اشترك الآن")}
                    </button>

                    {!!err && <p className="mt-3 text-center text-base text-red-600">{err}</p>}
                    {!!msg && <p className="mt-3 text-center text-base text-emerald-700">{msg}</p>}
                  </div>

                  <ul className="mt-6 space-y-2 text-base text-slate-800">
   <li>✅ الاشتراك يشمل المواد المختارة فقط.</li>                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
