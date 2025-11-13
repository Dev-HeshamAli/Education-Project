// src/pages/parent/OnlinePlan.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Calendar,
  BookOpen,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  Info,
  CheckCheck,
} from "lucide-react";

import { BASE_URL } from "../../api/BASE_URL";
import {
  fetchStudentProfile,
  selectStudentProfileById,
  selectStudentProfileLoading,
  selectStudentProfileError,
} from "../../store/student/studentSlice";

// IDs من الـstore
import {
  selectStudentID as selectStudentIDSelector,
  selectPlanID as selectPlanIDSelector,
} from "../../store/dataIDs/dataIDsSlice";

/* ---------------- UI Helper: Banner ---------------- */
function Banner({ tone = "info", title, body, icon: Icon = Info }) {
  const tones = {
    info: {
      wrap: "border-sky-200 bg-sky-50",
      icon: "text-sky-600",
      title: "text-sky-900",
      body: "text-sky-800",
    },
    ok: {
      wrap: "border-emerald-200 bg-emerald-50",
      icon: "text-emerald-600",
      title: "text-emerald-900",
      body: "text-emerald-800",
    },
    warn: {
      wrap: "border-amber-200 bg-amber-50",
      icon: "text-amber-600",
      title: "text-amber-900",
      body: "text-amber-800",
    },
  };
  const t = tones[tone] || tones.info;

  return (
    <div className={`rounded-xl border ${t.wrap} p-4 sm:p-5 flex items-start gap-3`}>
      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${t.icon} flex-shrink-0 mt-0.5`} />
      <div>
        {title && <div className={`font-bold mb-1 ${t.title}`}>{title}</div>}
        {body && <div className={`${t.body}`}>{body}</div>}
      </div>
    </div>
  );
}

/* ---------------- UI: Success Modal ---------------- */
function SuccessModal({ open, onClose, onConfirm }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* الخلفية تقفل فقط */}
      <button
        aria-label="close"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="rounded-3xl bg-white shadow-2xl border border-slate-200 p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mb-2">تم إرسال طلبك بنجاح</h3>
          <p className="text-slate-600 mb-6">تم تسجيل بياناتك وسيتم التواصل معك خلال 24 ساعة.</p>

          <div className="flex items-center justify-center gap-3">
            {/* الزر الأساسي: يودّي لصفحة الأب */}
            {/*<button
              onClick={onConfirm}
              className="rounded-2xl bg-slate-900 hover:bg-black text-white font-bold px-6 py-3"
            >
              تأكيد 
            </button>*/}
            <button
              onClick={onClose}
              className="rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3"
            >
              إغلاق
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ---------------- Main ---------------- */
export default function OnlinePlan() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const PROFILE_ROUTE = "/parent/parent-profile";

  const selectStudentID = useSelector(selectStudentIDSelector);
  const selectPlanID = useSelector(selectPlanIDSelector);
  const token = useSelector((s) => s.auth.token);
  const { id: parentId } = useSelector((s) => s.auth);

  const currency = "EGP";

  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [errorMsg, setErrorMsg] = useState("");
  const [alreadyInSomeOnlinePlan, setAlreadyInSomeOnlinePlan] = useState(false);

  const [scheduleTimes, setScheduleTimes] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [classSchedule, setClassSchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [studyLevels, setStudyLevels] = useState([]);
  const [levelsLoading, setLevelsLoading] = useState(false);

  const studentProfile = useSelector((s) =>
    selectStudentProfileById(s, Number(selectStudentID) || 0)
  );
  const studentProfileLoading = useSelector((s) =>
    selectStudentProfileLoading(s, Number(selectStudentID) || 0)
  );
  const studentProfileError = useSelector((s) =>
    selectStudentProfileError(s, Number(selectStudentID) || 0)
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
  async function fetchPlanDetails(planIdVal, studentIdVal, parentIdVal) {
    if (!planIdVal || !studentIdVal || !parentIdVal) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/Subscription/onlin-School-finly-price`,
        { planId: planIdVal, studentId: studentIdVal, parentId: parentIdVal },
        headers
      );
      setPlanData(data);
      setAlreadyInSomeOnlinePlan(false);
      setErrorMsg("");
    } catch (err) {
      const status = err?.response?.status;
      const errors = err?.response?.data?.errors;
      const message = Array.isArray(errors) ? errors[0] : "";
      if (status === 400 && /already enrolled in a plan/i.test(message || "")) {
        setAlreadyInSomeOnlinePlan(true);
        setPlanData(null);
        setErrorMsg("");
      } else {
        setAlreadyInSomeOnlinePlan(false);
        setPlanData(null);
        setErrorMsg("تعذر تحميل بيانات الخطة.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchScheduleTimes() {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/Shared/Schedule-Times`, headers);
      const arr = Array.isArray(data) ? data : [];
      setScheduleTimes(arr);
      if (arr.length === 1) setSelectedSchedule(String(arr[0].id));
    } catch {
      setScheduleTimes([]);
    }
  }

  async function fetchStudyLevels() {
    try {
      setLevelsLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/Shared/StudyLevels`, headers);
      const raw = Array.isArray(data) ? data : [];
      const normalized = raw.map((lv) => ({ id: lv.id, name: lv.level }));
      setStudyLevels(normalized);
    } catch {
      setStudyLevels([]);
    } finally {
      setLevelsLoading(false);
    }
  }

  async function fetchClassSchedule({ studyLevelId, semesterId, scheduleTimeId, yearId }) {
    if (!studyLevelId || !semesterId || !scheduleTimeId) return;
    try {
      setScheduleLoading(true);
      setClassSchedule(null);

      const url = `${BASE_URL}/api/Student/class-schedule/${Number(studyLevelId)}/${Number(
        semesterId
      )}/${Number(scheduleTimeId)}${yearId ? `?YearId=${Number(yearId)}` : ""}`;
      const { data } = await axios.get(url, headers);
      setClassSchedule(data || null);
    } catch {
      setClassSchedule(null);
    } finally {
      setScheduleLoading(false);
    }
  }

  /* ---------------- Effects ---------------- */
  useEffect(() => {
    if (!selectStudentID || !selectPlanID || !parentId) {
      setLoading(false);
      return;
    }
    fetchPlanDetails(Number(selectPlanID), Number(selectStudentID), parentId);
    fetchScheduleTimes();

    if (token && selectStudentID && !studentProfile) {
      dispatch(fetchStudentProfile({ studentId: Number(selectStudentID), token }));
    }
    fetchStudyLevels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectPlanID, selectStudentID, parentId, token]);

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

  useEffect(() => {
    if (!selectedSchedule) return;
    if (studentProfileLoading || levelsLoading) return;

    const finalLevelId = levelIdFromLevels;
    if (!finalLevelId) return;

    const finalSemesterId = semesterIdFromProfile;
    if (!finalSemesterId) return;

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

  /* ---------------- Submit (create-student-apply) ---------------- */
  async function submitOnlinePlanApplication() {
    if (!selectedSchedule) {
      setErrorMsg("اختاري الفترة أولاً.");
      return;
    }
    if (!planData) return;

    try {
      setSubmitting(true);
      setErrorMsg("");

      const {
        levelName,
        semsterName,
        studentName,
        finalPrice,
        planName,
        // courses قد تكون null من الـAPI — وإحنا عايزين نبعته null
      } = planData;

      const chosen = scheduleTimes.find((x) => String(x.id) === String(selectedSchedule));

      // ✅ المطلوب: نبعت courses = null
      const body = {
        studentName: String(studentName || ""),
        studentId: Number(selectStudentID),
        planId: Number(selectPlanID),
        scheduleTimeId: Number(selectedSchedule),
        planName: String(planName || "Online School"),
        scheduleTimeName: String(chosen?.name || ""),
        parentId: Number(parentId),
        studyLevelName: String(levelName || ""),
        totlePrice: Number(finalPrice || 0), // تهجئة الـAPI
        courses: null, // 👈 زي ما اتفقنا
      };

      await axios.post(`${BASE_URL}/api/Parent/create-student-apply`, body, headers);

      // افتح المودال — بدون تحويل تلقائي
      setShowSuccess(true);
    } catch (err) {
      const friendly =
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        err?.message ||
        "تعذر إتمام الطلب.";
      setErrorMsg(friendly);
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------------- Guards ---------------- */
  if (!selectStudentID || !selectPlanID) {
    return (
      <section
        dir="rtl"
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center"
      >
        <div className="text-center bg-white px-8 py-12 rounded-3xl shadow-xl max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <div className="text-amber-700 text-xl font-medium">لا يوجد طالب/خطة محددين.</div>
          <p className="text-slate-600 mt-2">من فضلك ارجعي لاختيار الطالب ثم الخطة مرة أخرى.</p>
          <button
            className="mt-6 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold px-6 py-3"
            onClick={() => navigate(-1)}
          >
            عودة
          </button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section
        dir="rtl"
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center"
      >
        <div className="flex items-center gap-4 bg-white px-8 py-6 rounded-2xl shadow-xl">
          <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
          <div className="text-slate-700 text-xl font-medium">جاري التحميل…</div>
        </div>
      </section>
    );
  }

  if (!planData && alreadyInSomeOnlinePlan) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 text-[17px]"
      >
        <section className="mx-auto w-full max-w-3xl px-5">
          <div className="rounded-3xl border border-sky-200 bg-white p-8 shadow-xl">
            <div className="mb-4">
              <Banner
                tone="info"
                title="الطالب مسجّل في مدرسة أونلاين بالفعل"
                body="لا يمكن الاشتراك في مدرسة أونلاين أخرى. يمكنك متابعة تفاصيل المدرسة الحالية من ملف الطالب."
                icon={Info}
              />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!planData) {
    return (
      <section
        dir="rtl"
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center"
      >
        <div className="text-center bg-white px-8 py-12 rounded-3xl shadow-xl max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <div className="text-red-600 text-xl font-medium">
            {errorMsg || "لم يتم العثور على بيانات الخطة."}
          </div>
        </div>
      </section>
    );
  }

  // من غير default [] عشان لو null ما نـmapّش عليها
  const { levelName, semsterName, studentName, oldPrice, finalPrice, courses } = planData;

  const before = Number(oldPrice || 0);
  const after = Number(finalPrice || 0);
  const discountPct = before > after ? Math.round((1 - after / before) * 100) : 0;

  const disableSubmit = !selectedSchedule || submitting;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 text-[17px] leading-8"
    >
      <SuccessModal
        open={showSuccess}
        onClose={() => {setShowSuccess(false);navigate(PROFILE_ROUTE);}}
        onConfirm={() => {
          setShowSuccess(false);
          navigate(PROFILE_ROUTE);
        }}
      />

      <section className="mx-auto w-full max-w-6xl px-5 md:px-6">
        {/* Hero Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-400 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg mb-4">
            <Star className="w-4 h-4" />
            مدرسة أونلاين
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            الالتحاق بمدرسة أونلاين
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            انضم إلى نظامنا التعليمي المتطور واستمتع بتجربة تعلم تفاعلية مع أفضل المعلمين
          </p>
        </div>

        {/* تنبيهات عامة */}
        <div className="mb-6 space-y-3">
          {studentProfileError && (
            <Banner tone="warn" title="تنبيه ببيانات الطالب" body={studentProfileError} icon={AlertCircle} />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* يسار: اختيار الفترة + الجدول */}
          <div className="lg:col-span-2 space-y-8">
            {/* اختيار الفترة */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-6 h-6 text-orange-500" />
                    <label className="text-2xl font-extrabold text-slate-900">اختيار الفترة الدراسية</label>
                  </div>
                  <p className="text-slate-600 text-lg">
                    اختر <span className="font-semibold text-blue-600">صباحي</span> أو{" "}
                    <span className="font-semibold text-purple-600">مسائي</span> ليظهر
                    <span className="font-semibold"> جدول الحصص</span> تلقائيًا بالأسفل.
                  </p>
                </div>

                {/* السعر */}
                <div className="text-left bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl border border-emerald-200">
                  <div className="text-3xl md:text-4xl font-extrabold text-emerald-600 mb-1">
                    {after.toLocaleString()} <span className="text-xl">{currency}</span>
                  </div>
                  {before > after && (
                    <>
                      <div className="text-lg line-through text-slate-400 mb-2">
                        {before.toLocaleString()} {currency}
                      </div>
                      <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                        وفر {discountPct}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Radio Cards للفترات */}
              <fieldset className="mt-6" aria-required="true" role="radiogroup">
                <legend className="sr-only">اختيار الفترة (توقيت الدراسة)</legend>
                <div className="grid md:grid-cols-2 gap-4">
                  {scheduleTimes.map((st) => {
                    const active = String(st.id) === String(selectedSchedule);
                    return (
                      <label
                        key={st.id}
                        className={[
                          "cursor-pointer rounded-2xl border p-6 text-lg transition-all select-none transform hover:scale-105",
                          active
                            ? "border-slate-900 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900 ring-2 ring-slate-400 shadow-lg"
                            : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 shadow-md",
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
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-4 h-4 rounded-full ${active ? "bg-slate-900" : "bg-slate-300"} transition-colors`} />
                          <div className="font-bold text-xl">{st.name}</div>
                        </div>
                        {st?.timeRange && <div className="text-slate-600 text-base mr-7">{st.timeRange}</div>}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {!selectedSchedule && (
                <div className="mt-6 flex items-center gap-3 text-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl px-4 py-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-lg">اختيار الفترة ضروري لعرض الجدول وتفعيل زر التقديم.</span>
                </div>
              )}
            </div>

            {/* جدول الحصص */}
            <div id="classScheduleSection" className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-7 h-7 text-blue-500" />
                <h2 className="text-2xl font-extrabold text-slate-900">جدول الحصص الأسبوعي</h2>
              </div>

              {!selectedSchedule ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                  <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <div className="text-slate-600 text-xl">
                    سيظهر <span className="font-semibold">الجدول التفصيلي</span> هنا بعد اختيار الفترة بالأعلى.
                  </div>
                </div>
              ) : (studentProfileLoading || levelsLoading) && selectedSchedule ? (
                <div className="flex items-center justify-center gap-4 text-lg text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>تم اختيار الفترة، جاري تحميل الجدول…</span>
                </div>
              ) : selectedSchedule && !scheduleLoading && classSchedule ? (
                <div className="mt-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-6">
                    <div className="text-lg text-slate-800">
                      <span className="font-bold">{classSchedule.name}</span> — ({classSchedule.scheduleTime})
                    </div>
                    <div className="text-slate-600 mt-2">
                      المستوى: <span className="font-semibold">{classSchedule.studyLevel}</span> • الفصل:{" "}
                      <span className="font-semibold">{classSchedule.semester}</span>
                    </div>
                  </div>

                  {Array.isArray(classSchedule.scheduleDayes) && classSchedule.scheduleDayes.length > 0 ? (
                    <div className="space-y-6">
                      {classSchedule.scheduleDayes.map((day) => (
                        <div key={day.id} className="rounded-2xl border border-slate-200 p-6 bg-gradient-to-br from-white to-slate-50 shadow-md">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div className="font-bold text-xl text-slate-900">{day.dayName}</div>
                          </div>

                          {day.lectures?.length ? (
                            <div className="overflow-x-auto">
                              <table className="w-full text-right">
                                <thead>
                                  <tr className="bg-slate-800 text-white">
                                    <th className="py-4 px-4 text-lg font-semibold rounded-tr-xl">اسم المادة</th>
                                    <th className="py-4 px-4 text-lg font-semibold">المعلم</th>
                                    <th className="py-4 px-4 text-lg font-semibold">من</th>
                                    <th className="py-4 px-4 text-lg font-semibold rounded-tl-xl">إلى</th>
                                  </tr>
                                </thead>
                                <tbody className="text-slate-900">
                                  {day.lectures.map((lec, idx) => (
                                    <tr
                                      key={lec.id || idx}
                                      className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${
                                        idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                                      } ${idx === day.lectures.length - 1 ? "rounded-b-xl" : ""}`}
                                    >
                                      <td className="py-4 px-4 font-medium text-lg">{lec.courseName ?? "—"}</td>
                                      <td className="py-4 px-4 text-lg">{lec.teacherName ?? "—"}</td>
                                      <td className="py-4 px-4 text-lg font-mono">{lec.startTime?.slice(0, 5) ?? "—"}</td>
                                      <td className="py-4 px-4 text-lg font-mono">{lec.endTime?.slice(0, 5) ?? "—"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-lg text-slate-600 text-center py-4">لا توجد محاضرات لهذا اليوم.</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-lg text-slate-600 mt-6 text-center py-8 bg-slate-50 rounded-2xl">
                      لا يوجد جدول متاح لهذه الفترة.
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* يمين: ملخص وتقديم الطلب */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl" aria-live="polite">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-purple-500" />
                <h3 className="text-2xl font-extrabold text-slate-900">ملخص الخطة</h3>
              </div>

              <div className="space-y-4 text-lg">
                <div className="flex items-center justify-between py-2">
                  <span className="font-semibold text-slate-900">الطالب</span>
                  <span className="text-slate-600 font-semibold">{studentName}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-semibold text-slate-900">المستوى</span>
                  <span className="text-slate-600 font-semibold">{levelName}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-semibold text-slate-900">الفصل</span>
                  <span className="text-slate-600 font-semibold">{semsterName}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-semibold text-slate-900">الفترة المختارة</span>
                  <span className="text-slate-600 font-semibold">
                    {selectedSchedule
                      ? scheduleTimes.find((x) => String(x.id) === String(selectedSchedule))?.name || "—"
                      : "لم يتم الاختيار"}
                  </span>
                </div>
              </div>

              {/* ما نظهرش المواد إلا لو مصفوفة وفيها عناصر */}
              {Array.isArray(courses) && courses.length > 0 && (
                <div className="mt-8">
                  <p className="text-lg font-semibold text-slate-900 mb-4">المواد المشمولة</p>
                  <div className="grid grid-cols-1 gap-2">
                    {courses.map((c, i) => (
                      <div
                        key={`${typeof c === "string" ? c : c?.courseName || c?.name || i}-${i}`}
                        className="flex items-center gap-2 text-lg rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-800"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {typeof c === "string" ? c : (c?.courseName || c?.name || "—")}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <div className="text-3xl font-extrabold text-emerald-600">
                      {Number(finalPrice || 0).toLocaleString()} <span className="text-xl">{currency}</span>
                    </div>
                    {Number(oldPrice || 0) > Number(finalPrice || 0) && (
                      <div className="text-lg line-through text-slate-400">
                        {Number(oldPrice || 0).toLocaleString()} {currency}
                      </div>
                    )}
                  </div>
                  {discountPct > 0 && (
                    <span className="text-sm text-white bg-red-500 px-3 py-2 rounded-xl font-bold">
                      وفر {discountPct}% 🔥
                    </span>
                  )}
                </div>

                <button
                  className={`w-full rounded-2xl py-4 text-white text-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                    disableSubmit
                      ? "bg-slate-400 cursor-not-allowed opacity-60"
                      : "bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black shadow-lg hover:shadow-xl"
                  }`}
                  disabled={disableSubmit}
                  onClick={submitOnlinePlanApplication}
                  aria-disabled={disableSubmit}
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري الإرسال…
                    </div>
                  ) : selectedSchedule ? (
                    "سجل الان"
                  ) : (
                    "اختر الفترة لتفعيل التقديم"
                  )}
                </button>

                {errorMsg && (
                  <div className="mt-4">
                    <Banner tone="warn" title="تنبيه" body={errorMsg} icon={AlertCircle} />
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3 text-lg text-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>الاشتراك لفصل دراسي كامل</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>الدراسة من الأحد إلى الأربعاء</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>فترات صباحية ومسائية</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 ه-5 text-green-500" />
                  <span>يشمل أنشطة وتدريبات</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
