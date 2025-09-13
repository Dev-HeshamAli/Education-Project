// src/pages/PlanDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// ✅ استيراد ثنك/سيلكتورز بروفايل الطالب (عدّلي المسار لو مختلف)
import {
  fetchStudentProfile,
  selectStudentProfileById,
  selectStudentProfileLoading,
  selectStudentProfileError,
} from "../../store/student/studentSlice"; // <-- غيّري المسار حسب مشروعك

export default function OnlinePlan() {
  const currency = "EGP";
  const { planId, studentId } = useParams();
  const token = useSelector((s) => s.auth.token);
  const { id: parentId } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // فترات + جدول
  const [scheduleTimes, setScheduleTimes] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [classSchedule, setClassSchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  // ✅ لستة المستويات من الشيرد (هنطبّعها ل {id, name})
  const [studyLevels, setStudyLevels] = useState([]);
  const [levelsLoading, setLevelsLoading] = useState(false);

  // ✅ بروفايل الطالب من الريدكس
  const studentProfile = useSelector((s) =>
    selectStudentProfileById(s, Number(studentId))
  );
  const studentProfileLoading = useSelector((s) =>
    selectStudentProfileLoading(s, Number(studentId))
  );
  const studentProfileError = useSelector((s) =>
    selectStudentProfileError(s, Number(studentId))
  );

  const headers = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        accept: "*/*",
      },
    }),
    [token]
  );

  /* ---------------- Helpers للمطابقة ---------------- */
  const canon = (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "")
      .replace(/^primary/, "pr")
      .replace(/^p(?=\d)/, "pr")
      .replace(/^grade(?=\d)/, "pr");

  const findLevelIdByName = (levels, levelName) => {
    if (!levelName || !Array.isArray(levels)) return null;
    const target = canon(levelName);

    let hit = levels.find((lv) => canon(lv?.name ?? lv?.level) === target);
    if (hit?.id) return hit.id;

    hit = levels.find((lv) => {
      const c = canon(lv?.name ?? lv?.level);
      return c.includes(target) || target.includes(c);
    });
    return hit?.id ?? null;
  };

  /* ---------------- Fetches ---------------- */

  // ✅ تفاصيل الخطة (للعرض والسعر فقط)
  async function fetchPlanDetails(planid, studentid, parentid) {
    try {
      const { data } = await axios.post(
        "https://edu-smart.runasp.net/api/Subscription/onlin-School-finly-price",
        { planId: planid, studentId: studentid, parentId: parentid },
        headers
      );
      setPlanData(data);
    } catch (err) {
      console.error(err);
      setErrorMsg("حدث خطأ أثناء تحميل بيانات الخطة");
    } finally {
      setLoading(false);
    }
  }

  // ✅ الفترات
  async function fetchScheduleTimes() {
    try {
      const { data } = await axios.get(
        "https://edu-smart.runasp.net/api/Shared/Schedule-Times",
        headers
      );
      const arr = Array.isArray(data) ? data : [];
      setScheduleTimes(arr);
      if (arr.length === 1) setSelectedSchedule(String(arr[0].id));
    } catch (err) {
      console.error("فشل تحميل الفترات:", err);
    }
  }

  // ✅ لستة المستويات من الشيرد (الـ endpoint بيرجع { id, maxStudntNumber, level })
  async function fetchStudyLevels() {
    try {
      setLevelsLoading(true);
      const { data } = await axios.get(
        "https://edu-smart.runasp.net/api/Shared/StudyLevels",
        headers
      );
      const raw = Array.isArray(data) ? data : [];
      const normalized = raw.map((lv) => ({ id: lv.id, name: lv.level }));
      setStudyLevels(normalized);
    } catch (e) {
      console.error("فشل تحميل المستويات (Study-Levels):", e);
      setStudyLevels([]);
    } finally {
      setLevelsLoading(false);
    }
  }

  // ✅ جدول الحصص
  async function fetchClassSchedule({
    studyLevelId,
    semesterId,
    scheduleTimeId,
    yearId,
  }) {
    if (!studyLevelId || !semesterId || !scheduleTimeId) return;
    try {
      setScheduleLoading(true);
      setClassSchedule(null);

      const url = `https://edu-smart.runasp.net/api/Student/class-schedule/${Number(
        studyLevelId
      )}/${Number(semesterId)}/${Number(scheduleTimeId)}${
        yearId ? `?YearId=${Number(yearId)}` : ""
      }`;
      const { data } = await axios.get(url, headers);
      setClassSchedule(data || null);
    } catch (e) {
      console.error("فشل تحميل الجدول:", e);
      setClassSchedule(null);
    } finally {
      setScheduleLoading(false);
    }
  }

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    fetchPlanDetails(planId, studentId, parentId);
    fetchScheduleTimes();
    // هات بروفايل الطالب
    if (token && studentId && !studentProfile) {
      dispatch(fetchStudentProfile({ studentId: Number(studentId), token }));
    }
    // هات الليفيلات من الشيرد
    fetchStudyLevels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId, studentId, parentId, token]);

  // ✅ IDs من البروفايل + الشيرد
  const semesterIdFromProfile = useMemo(() => {
    const p = studentProfile || {};
    return p.semesterId ?? p.semsterId ?? p.semesterID ?? null;
  }, [studentProfile]);

  const levelNameFromProfile = useMemo(() => {
    const p = studentProfile || {};
    return p.levelName ?? p.studyLevel ?? p.level ?? p?.level?.name ?? "";
  }, [studentProfile]);

  const yearIdFromProfile = useMemo(() => {
    const p = studentProfile || {};
    return p.yearId ?? p.yearID ?? undefined;
  }, [studentProfile]);

  const levelIdFromLevels = useMemo(() => {
    if (!levelNameFromProfile) return null;
    return findLevelIdByName(studyLevels, levelNameFromProfile);
  }, [studyLevels, levelNameFromProfile]);

  // ✅ نادِي الجدول لما تختار فترة + IDs جاهزة
  useEffect(() => {
    if (!selectedSchedule) return;
    if (studentProfileLoading || levelsLoading) return;

    const finalLevelId = levelIdFromLevels;
    const finalSemesterId = semesterIdFromProfile;

    if (!finalLevelId || !finalSemesterId) return;

    fetchClassSchedule({
      studyLevelId: finalLevelId,
      semesterId: finalSemesterId,
      scheduleTimeId: Number(selectedSchedule),
      yearId: yearIdFromProfile,
    });

    const el = document.getElementById("classScheduleSection");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedSchedule,
    levelIdFromLevels,
    semesterIdFromProfile,
    yearIdFromProfile,
    studentProfileLoading,
    levelsLoading,
  ]);

  // ✅ الاشتراك
  async function enrollOnlinePlan(planIdVal, studentIdVal, parentIdVal) {
    try {
      setSubmitting(true);
      setErrorMsg("");
      await axios.post(
        "https://edu-smart.runasp.net/api/Subscription/enroll-student-in-Onlin-plan",
        {
          planId: planIdVal,
          studentId: studentIdVal,
          parentId: parentIdVal,
          scheduleTimeId: selectedSchedule
            ? Number(selectedSchedule)
            : undefined,
        },
        headers
      );
      alert("تم الاشتراك بنجاح 🎉");
    } catch (err) {
      console.error(err);
      setErrorMsg("فشل الاشتراك، حاول لاحقاً");
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <section
        dir="rtl"
        className="min-h-[60vh] grid place-items-center bg-neutral-50"
      >
        <div className="text-slate-700 animate-pulse text-lg">
          جاري التحميل…
        </div>
      </section>
    );
  }

  if (!planData) {
    return (
      <section
        dir="rtl"
        className="min-h-[60vh] grid place-items-center bg-neutral-50"
      >
        <div className="text-red-600 text-lg">
          {errorMsg || "لم يتم العثور على بيانات الخطة."}
        </div>
      </section>
    );
  }

  const {
    levelName,
    semsterName,
    studentName,
    oldPrice,
    finalPrice,
    courses = [],
  } = planData;

  const before = Number(oldPrice || 0);
  const after = Number(finalPrice || 0);
  const discountPct =
    before > after ? Math.round((1 - after / before) * 100) : 0;

  return (
    <>
      <main
        dir="rtl"
        className="bg-slate-100 min-h-screen py-10 md:py-12 text-[17px] leading-8"
      >
        <section className="mx-auto w-full max-w-6xl px-5 md:px-6">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-slate-900">
              الالتحاق بمدرسة
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* يسار: اختيار الفترة + الجدول */}
            <div className="lg:col-span-2 space-y-6">
              {/* اختيار الفترة */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <label className="block text-[18px] font-extrabold text-slate-900 mb-1">
                      الفترة{" "}
                      <span className="text-slate-500 font-medium">
                        (توقيت الدراسة)
                      </span>
                    </label>
                    <p className="text-slate-600 text-[15px] mt-2">
                      اختر <span className="font-semibold">صباحي</span> أو{" "}
                      <span className="font-semibold">مسائي</span> ليظهر
                      <span className="font-semibold"> جدول الحصص</span>{" "}
                      تلقائيًا بالأسفل.
                    </p>
                  </div>

                  {/* السعر */}
                  <div className="text-right">
                    <div className="text-2xl md:text-3xl font-extrabold text-emerald-600">
                      {after.toLocaleString()}{" "}
                      <span className="text-lg">{currency}</span>
                    </div>
                    {before > after && (
                      <div className="text-base line-through text-slate-400">
                        {before.toLocaleString()} {currency}
                      </div>
                    )}
                  </div>
                </div>

                {/* Radio Cards للفترات */}
                <fieldset
                  className="mt-4"
                  aria-required="true"
                  role="radiogroup"
                >
                  <legend className="sr-only">
                    اختيار الفترة (توقيت الدراسة)
                  </legend>
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
                              : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
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
                            <div className="text-slate-600 text-sm mt-0.5">
                              {st.timeRange}
                            </div>
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
              <div
                id="classScheduleSection"
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    جدول الحصص
                  </h2>
                </div>

                {!selectedSchedule && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
                    سيظهر <span className="font-semibold">الجدول</span> هنا بعد
                    اختيار الفترة بالأعلى.
                  </div>
                )}

                {selectedSchedule && scheduleLoading && (
                  <div
                    role="status"
                    className="text-base text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
                  >
                    تم اختيار الفترة، جاري تحميل الجدول…
                  </div>
                )}

                {selectedSchedule && !scheduleLoading && classSchedule && (
                  <div className="mt-4">
                    <p className="text-base text-slate-700 mb-3">
                      {classSchedule.name} — ({classSchedule.scheduleTime}) •
                      المستوى: {classSchedule.studyLevel} • الفصل:{" "}
                      {classSchedule.semester}
                    </p>

                    {Array.isArray(classSchedule.scheduleDayes) &&
                    classSchedule.scheduleDayes.length > 0 ? (
                      <ul className="space-y-4">
                        {classSchedule.scheduleDayes.map((day) => (
                          <li
                            key={day.id}
                            className="rounded-xl border border-slate-200 p-4 bg-slate-50"
                          >
                            <div className="font-bold text-lg text-slate-900 mb-3">
                              {day.dayName}
                            </div>

                            {day.lectures?.length ? (
                              <div className="overflow-x-auto">
                                <table className="w-full text-right">
                                  <thead>
                                    <tr className="bg-slate-100 text-slate-800 border-y border-slate-200">
                                      <th className="py-3 px-4 text-[15px] font-semibold">
                                        اسم المادة
                                      </th>
                                      <th className="py-3 px-4 text-[15px] font-semibold">
                                        المعلم
                                      </th>
                                      <th className="py-3 px-4 text-[15px] font-semibold">
                                        من
                                      </th>
                                      <th className="py-3 px-4 text-[15px] font-semibold">
                                        إلى
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="text-slate-900">
                                    {day.lectures.map((lec, idx) => (
                                      <tr
                                        key={lec.id || idx}
                                        className={`border-t border-slate-100 ${
                                          idx % 2 === 0
                                            ? "bg-white"
                                            : "bg-slate-50"
                                        }`}
                                      >
                                        <td className="py-3 px-4 font-medium">
                                          {lec.courseName ?? "—"}
                                        </td>
                                        <td className="py-3 px-4">
                                          {lec.teacherName ?? "—"}
                                        </td>
                                        <td className="py-3 px-4">
                                          {lec.startTime?.slice(0, 5) ?? "—"}
                                        </td>
                                        <td className="py-3 px-4">
                                          {lec.endTime?.slice(0, 5) ?? "—"}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-base text-slate-600">
                                لا توجد محاضرات لهذا اليوم.
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-base text-slate-600 mt-3">
                        لا يوجد جدول متاح لهذه الفترة.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* يمين: ملخص واشتراك */}
            <aside className="lg:col-span-1">
              <div
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                aria-live="polite"
              >
                <h3 className="text-xl font-extrabold text-slate-900 mb-4">
                  ملخص الخطة
                </h3>

                <div className="space-y-3 text-base">
                  <div className="flex items-center justify-between">
                    <span className=" font-medium text-slate-900">الطالب</span>
                    <span className="text-slate-600">{studentName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">المستوى</span>
                    <span className=" text-slate-600">{levelName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">الفصل</span>
                    <span className=" text-slate-600">{semsterName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">
                      الفترة المختارة
                    </span>
                    <span className=" text-slate-600">
                      {selectedSchedule
                        ? scheduleTimes.find(
                            (x) => String(x.id) === String(selectedSchedule)
                          )?.name || "—"
                        : "—"}
                    </span>
                  </div>
                </div>

                {Array.isArray(courses) && courses.length > 0 && (
                  <div className="mt-6">
                    <p className="text-base font-semibold text-slate-900 mb-3">
                      المواد المشمولة
                    </p>
                    <ul className="grid grid-cols-2 gap-3">
                      {courses.map((c, i) => (
                        <li
                          key={`${c}-${i}`}
                          className="text-base rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-extrabold text-emerald-600">
                        {after.toLocaleString()}{" "}
                        <span className="text-lg">{currency}</span>
                      </div>
                      {before > after && (
                        <div className="text-base line-through text-slate-400">
                          {before.toLocaleString()} {currency}
                        </div>
                      )}
                    </div>
                    {discountPct > 0 && (
                      <span className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                        وفر {discountPct}%
                      </span>
                    )}
                  </div>

                  <button
                    className="mt-6 w-full rounded-lg bg-slate-900 py-3 text-white text-lg font-bold hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={submitting || !selectedSchedule}
                    onClick={() =>
                      enrollOnlinePlan(planId, Number(studentId), parentId)
                    }
                    aria-disabled={submitting || !selectedSchedule}
                  >
                    {submitting
                      ? "جاري الاشتراك…"
                      : selectedSchedule
                      ? "اشترك الآن"
                      : "اختر الفترة لتفعيل الاشتراك"}
                  </button>

                  {errorMsg && (
                    <p className="mt-4 text-center text-base text-red-600">
                      {errorMsg}
                    </p>
                  )}
                </div>

                <ul className="mt-6 space-y-2 text-base text-slate-800">
                  <li>✅ الاشتراك لفصل دراسي كامل</li>
                  <li>📆 الدراسة من الأحد إلى الأربعاء</li>
                  <li>🌗 فترات صباحية ومسائية</li>
                  <li>🧩 يشمل أنشطة وتدريبات</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
