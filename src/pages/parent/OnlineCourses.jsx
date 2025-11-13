// src/pages/parent/OnlineCourses.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Calendar,
  User,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Loader2,
  GraduationCap,
  DollarSign,
  Lock,
  CheckCheck,
} from "lucide-react";
import { BASE_URL } from "../../api/BASE_URL";

import {
  fetchStudentProfile,
  selectStudentProfileById,
  selectStudentProfileLoading,
  selectStudentProfileError,
} from "../../store/student/studentSlice";

import {
  selectStudentID as selectStudentIDSelector,
  selectPlanID as selectPlanIDSelector,
} from "../../store/dataIDs/dataIDsSlice";

/* ===============================
   Success Modal
=============================== */
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
      {/* overlay: يقفل فقط */}
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
          <p className="text-slate-600 mb-6">تم تسجيل بيانات الكورسات المختارة وسيتم التواصل معك خلال 24 ساعة.</p>

          <div className="flex items-center justify-center gap-3">
           {/* <button
              onClick={onConfirm}
              className="rounded-2xl bg-slate-900 hover:bg-black text-white font-bold px-6 py-3"
            >
              تأكيد والذهاب للملف الشخصي
            </button>*/}
            <button
              onClick={onClose}
              className="rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3"
            >
              إغلاق
            </button>
          </div>

          <div className="mt-4 text-xs text-slate-500">يمكنك متابعة حالة الطلب من الملف الشخصي.</div>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   Small helpers
=============================== */
function LoadingCard() {
  return (
    <div className="h-32 rounded-2xl bg-white shadow-sm border border-slate-200 animate-pulse">
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        <div className="h-6 bg-slate-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}

function CourseCard({ course, isSelected, onToggle, disabled, disabledReason }) {
  const discount =
    course.oldPrice > course.finalPrice && course.oldPrice > 0
      ? Math.round((1 - course.finalPrice / course.oldPrice) * 100)
      : 0;

  const badgeText =
    disabledReason === "otherPlan"
      ? "مغلق لاشتراك في خطة أخرى"
      : disabledReason === "enrolled"
      ? "مسجّل بالفعل"
      : "غير متاح";

  return (
    <label
      className={[
        "rounded-2xl border bg-white shadow-sm transition-all p-5 select-none flex gap-4 relative",
        disabled
          ? "opacity-60 cursor-not-allowed border-slate-200 bg-slate-50"
          : isSelected
          ? "cursor-pointer border-slate-900 ring-2 ring-slate-200 bg-slate-50"
          : "cursor-pointer border-slate-200 hover:shadow-md hover:border-slate-300",
      ].join(" ")}
      title={disabled ? badgeText : undefined}
    >
      {disabled && (
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-slate-800 text-white text-[11px] font-semibold px-2 py-0.5">
          <Lock className="h-3 w-3" /> {badgeText}
        </span>
      )}

      <input
        type="checkbox"
        className="mt-1 h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-800"
        checked={!!isSelected}
        onChange={() => {
          if (!disabled) onToggle(course.courseId);
        }}
        disabled={disabled}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
            {course.courseName}
          </h3>
          {discount > 0 && (
            <span className="shrink-0 bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded-full">
              وفر {discount}%
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-3 text-base">
          {course.oldPrice > course.finalPrice && (
            <span className="line-through text-slate-400">
              {Number(course.oldPrice || 0).toLocaleString()} جنيه
            </span>
          )}
          <span className="font-bold text-emerald-700 flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            {Number(course.finalPrice || 0).toLocaleString()} جنيه
          </span>
        </div>

        {disabledReason === "enrolled" && (
          <div className="mt-2 text-xs text-slate-500">تم تسجيل هذا الكورس بالفعل</div>
        )}
      </div>
    </label>
  );
}

function ScheduleTimeCard({ scheduleTime, isSelected, onSelect, disabled }) {
  return (
    <label
      className={`cursor-pointer rounded-xl border px-5 py-3 text-base transition select-none block ${
        disabled
          ? "opacity-60 cursor-not-allowed border-slate-200 bg-slate-50"
          : isSelected
          ? "border-slate-900 bg-slate-100 text-slate-900 ring-2 ring-slate-300"
          : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400"
      }`}
      title={disabled ? "لا يمكن تغيير الفترة" : undefined}
    >
      <input
        type="radio"
        name="scheduleTime"
        value={scheduleTime.id}
        checked={isSelected}
        onChange={() => !disabled && onSelect(scheduleTime.id)}
        className="sr-only"
        disabled={disabled}
      />

      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-slate-500" />
        <div>
          <div className="font-bold">{scheduleTime.name}</div>
          {scheduleTime.timeRange && (
            <div className="text-slate-600 text-sm mt-0.5">
              {scheduleTime.timeRange}
            </div>
          )}
        </div>
      </div>
    </label>
  );
}

function ClassScheduleTable({ classSchedule }) {
  if (!classSchedule?.scheduleDayes?.length) {
    return (
      <div className="text-center py-8 text-slate-600">
        <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-400" />
        <p>لا يوجد جدول متاح لهذه الفترة</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">
        <div className="flex flex-wrap gap-4">
          <span>
            <strong>الجدول:</strong> {classSchedule.name}
          </span>
          <span>
            <strong>الفترة:</strong> {classSchedule.scheduleTime}
          </span>
          <span>
            <strong>المستوى:</strong> {classSchedule.studyLevel}
          </span>
          <span>
            <strong>الفصل:</strong> {classSchedule.semester}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {classSchedule.scheduleDayes.map((day) => (
          <div
            key={day.id}
            className="rounded-xl border border-slate-200 overflow-hidden"
          >
            <div className="bg-slate-100 px-4 py-3 font-bold text-lg text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {day.dayName}
            </div>

            {day.lectures?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-slate-50 text-slate-800 border-b border-slate-200">
                      <th className="py-3 px-4 text-sm font-semibold text-right">
                        المادة
                      </th>
                      <th className="py-3 px-4 text-sm font-semibold text-right">
                        المعلم
                      </th>
                      <th className="py-3 px-4 text-sm font-semibold text-right">
                        من
                      </th>
                      <th className="py-3 px-4 text-sm font-semibold text-right">
                        إلى
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.lectures.map((lecture, idx) => (
                      <tr
                        key={lecture.id || idx}
                        className={`border-t border-slate-100 ${
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                        }`}
                      >
                        <td className="py-3 px-4 font-medium">
                          {lecture.courseName || "—"}
                        </td>
                        <td className="py-3 px-4">
                          {lecture.teacherName || "—"}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {lecture.startTime?.slice(0, 5) || "—"}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {lecture.endTime?.slice(0, 5) || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 text-slate-600 text-center">
                لا توجد محاضرات لهذا اليوم
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===============================
   Main Component
=============================== */
export default function OnlineCourses() {
  const navigate = useNavigate();
  const PROFILE_ROUTE = "/parent/parent-profile";

  const selectStudentID = useSelector(selectStudentIDSelector);
  const selectPlanID = useSelector(selectPlanIDSelector);
  const token = useSelector((s) => s.auth.token);
  const { id: parentId } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [planInfo, setPlanInfo] = useState(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);

  const [scheduleTimes, setScheduleTimes] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [classSchedule, setClassSchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState("");

  const [studyLevels, setStudyLevels] = useState([]);
  const [levelsLoading, setLevelsLoading] = useState(false);

  // 🔔 حالة المودال
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const studentProfile = useSelector((s) =>
    selectStudentProfileById(s, Number(selectStudentID) || 0)
  );
  const studentProfileLoading = useSelector((s) =>
    selectStudentProfileLoading(s, Number(selectStudentID) || 0)
  );
  const studentProfileError = useSelector((s) =>
    selectStudentProfileError(s, Number(selectStudentID) || 0)
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

  const normalizeString = (str) =>
    String(str || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "")
      .replace(/^primary/, "pr")
      .replace(/^p(?=\d)/, "pr")
      .replace(/^grade(?=\d)/, "pr");

  const findLevelIdByName = (levels, levelName) => {
    if (!levelName || !Array.isArray(levels)) return null;
    const target = normalizeString(levelName);

    let match = levels.find(
      (lv) => normalizeString(lv?.name ?? lv?.level) === target
    );
    if (match?.id) return match.id;

    match = levels.find((lv) => {
      const normalized = normalizeString(lv?.name ?? lv?.level);
      return normalized.includes(target) || target.includes(normalized);
    });
    return match?.id ?? null;
  };

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

  // ✅ فقط غير المسجّل
  const selectableCourseIds = useMemo(
    () =>
      (planInfo?.courses || [])
        .filter((c) => !c.isEnrolled)
        .map((c) => c.courseId),
    [planInfo?.courses]
  );

  // ====== Flags ======
  const blockByOtherPlan = planInfo?.isCanEnrolle === false; // يقفل الكل
  const alreadyInThisPlanId =
    planInfo?.isHaveSchedulId === null || planInfo?.isHaveSchedulId === undefined
      ? null
      : Number(planInfo.isHaveSchedulId); // رقم الفترة المختارة مسبقًا إن وُجد
  const alreadyInThisPlan = alreadyInThisPlanId != null;

  // 👇 القفل العام دلوقتي بس لو مشترك في خطة أخرى
  const hardDisableAll = blockByOtherPlan;

  // Totals
  const { totalFinal, totalOld, selectedCount, selectedCourses } = useMemo(() => {
    const courses = planInfo?.courses || [];
    const courseMap = new Map(courses.map((c) => [c.courseId, c]));
    let finalSum = 0;
    let oldSum = 0;
    const selected = [];

    selectedCourseIds.forEach((courseId) => {
      const course = courseMap.get(courseId);
      if (course) {
        finalSum += Number(course.finalPrice || 0);
        oldSum += Number(course.oldPrice || 0);
        selected.push(course);
      }
    });

    return {
      totalFinal: finalSum,
      totalOld: oldSum,
      selectedCount: selectedCourseIds.length,
      selectedCourses: selected,
    };
  }, [selectedCourseIds, planInfo?.courses]);

  const discountPercentage =
    totalOld > totalFinal && totalOld > 0
      ? Math.round((1 - totalFinal / totalOld) * 100)
      : 0;

  const isAllSelected =
    selectableCourseIds.length > 0 &&
    selectedCourseIds.length === selectableCourseIds.length;

  const studentName =
    planInfo?.studentName ||
    studentProfile?.studentName ||
    studentProfile?.name ||
    "—";
  const levelDisplay = levelNameFromProfile || planInfo?.studyLevel || "—";
  const semesterDisplay =
    studentProfile?.semesterName ||
    studentProfile?.semsterName ||
    planInfo?.semesterName ||
    "—";
  const selectedScheduleName =
    (selectedScheduleId
      ? scheduleTimes.find((x) => String(x.id) === String(selectedScheduleId))?.name
      : null) ||
    (alreadyInThisPlanId
      ? scheduleTimes.find((x) => Number(x.id) === Number(alreadyInThisPlanId))?.name
      : null) ||
    "—";

  /* ===============================
     Effects
  =============================== */

  useEffect(() => {
    if (!selectStudentID || !selectPlanID) {
      setError("لا يوجد طالب/خطة محددين. من فضلك اختاري الطالب ثم الخطة.");
    }
  }, [selectStudentID, selectPlanID]);

  useEffect(() => {
    if (!token || !selectStudentID) return;
    if (!studentProfile && !studentProfileLoading) {
      dispatch(
        fetchStudentProfile({ studentId: Number(selectStudentID), token })
      );
    }
  }, [token, selectStudentID, studentProfile, studentProfileLoading, dispatch]);

  // Fetch plan courses
  useEffect(() => {
    if (!token || !selectPlanID || !selectStudentID || !parentId) return;

    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const url = `${BASE_URL}/api/Subscription/All-Courses-plans-to-Enroll`;
        const body = {
          planId: Number(selectPlanID),
          studentId: Number(selectStudentID),
          parentId: Number(parentId),
        };

        const { data } = await axios.post(url, body, authHeaders);
        if (!isMounted) return;

        const normalized = {
          planName: data?.planName ?? "",
          studentName: data?.studentName ?? "",
          studyLevel: data?.studyLevel ?? data?.levelName ?? "",
          semesterName: data?.semesterName ?? data?.semsterName ?? "",
          isCanEnrolle:
            typeof data?.isCanEnrolle === "boolean" ? data.isCanEnrolle : true,
          isHaveSchedulId:
            data?.isHaveSchedulId === null || data?.isHaveSchedulId === undefined
              ? null
              : data.isHaveSchedulId,
          courses: Array.isArray(data?.courses) ? data.courses : [],
        };

        setPlanInfo(normalized);

        // ✅ لو عنده فترة محفوظة قبل كده، نستخدمها تلقائيًا
        if (normalized.isHaveSchedulId != null) {
          setSelectedScheduleId(String(normalized.isHaveSchedulId));
        }

        // ✅ صحح الاختيارات — فقط غير المسجّل
        setSelectedCourseIds((prev) =>
          prev.filter((id) =>
            (normalized.courses || []).some(
              (c) => c.courseId === id && !c.isEnrolled
            )
          )
        );
      } catch (err) {
        if (!isMounted) return;

        const errorMessage =
          err?.response?.status === 403
            ? "ليس لديك صلاحية لعرض هذه البيانات"
            : err?.response?.status === 404
            ? "لا توجد بيانات متاحة"
            : err?.response?.data?.title ||
              err?.message ||
              "حدث خطأ غير متوقع";

        setError(errorMessage);
        setPlanInfo(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token, selectPlanID, selectStudentID, parentId, authHeaders]);

  // Fetch schedule times
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/Shared/Schedule-Times`,
          authHeaders
        );
        const times = Array.isArray(data) ? data : [];
        setScheduleTimes(times);

        // لو مفيش فترة محفوظة، وطلع واحدة فقط — خُدها
        if (!alreadyInThisPlan && times.length === 1) {
          setSelectedScheduleId(String(times[0].id));
        }
      } catch {
        /* ignore */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, authHeaders]);

  // Fetch study levels
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLevelsLoading(true);
        const { data } = await axios.get(
          `${BASE_URL}/api/Shared/StudyLevels`,
          authHeaders
        );
        const rawLevels = Array.isArray(data) ? data : [];
        const normalizedLevels = rawLevels.map((level) => ({
          id: level.id,
          name: level.level,
        }));
        setStudyLevels(normalizedLevels);
      } catch {
        setStudyLevels([]);
      } finally {
        setLevelsLoading(false);
      }
    })();
  }, [token, authHeaders]);

  // Fetch class schedule when a schedule is active (selected or saved)
  useEffect(() => {
    const schedIdToUse = alreadyInThisPlan ? alreadyInThisPlanId : Number(selectedScheduleId || 0);
    if (!schedIdToUse || studentProfileLoading || levelsLoading) return;

    const finalLevelId = levelIdFromLevels;
    const finalSemesterId = semesterIdFromProfile;

    if (!finalLevelId) {
      setScheduleError("تعذر تحديد معرف المستوى من بيانات الطالب");
      setClassSchedule(null);
      return;
    }

    if (!finalSemesterId) {
      setScheduleError("تعذر تحديد معرف الفصل من بيانات الطالب");
      setClassSchedule(null);
      return;
    }

    (async () => {
      try {
        setScheduleLoading(true);
        setScheduleError("");
        setClassSchedule(null);

        const url = `${BASE_URL}/api/Student/class-schedule/${finalLevelId}/${finalSemesterId}/${schedIdToUse}${
          yearIdFromProfile ? `?YearId=${yearIdFromProfile}` : ""
        }`;

        const { data } = await axios.get(url, authHeaders);
        setClassSchedule(data || null);

        const element = document.getElementById("classScheduleSection");
        if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (err) {
        const apiMessage =
          err?.response?.data?.title ||
          err?.response?.data?.message ||
          err?.message ||
          "تعذر تحميل الجدول";

        setScheduleError(apiMessage);
        setClassSchedule(null);
      } finally {
        setScheduleLoading(false);
      }
    })();
  }, [
    selectedScheduleId,
    alreadyInThisPlan,
    alreadyInThisPlanId,
    levelIdFromLevels,
    semesterIdFromProfile,
    yearIdFromProfile,
    studentProfileLoading,
    levelsLoading,
    authHeaders,
  ]);

  /* ===============================
     Handlers
  =============================== */
  const toggleAllCourses = () => {
    if (hardDisableAll) return;
    setSelectedCourseIds((prev) =>
      prev.length === selectableCourseIds.length ? [] : [...selectableCourseIds]
    );
  };

  const toggleCourse = (courseId) => {
    if (hardDisableAll) return;
    const disabled = !(selectableCourseIds || []).includes(courseId);
    if (disabled) return;

    setSelectedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  // تقديم الطلب عبر /api/Parent/create-student-apply
  const handleEnrollment = async () => {
    if (!token) return;

    if (blockByOtherPlan) {
      setError("لا يمكنك الاشتراك في هذه الخطة لاختيارك خطة أخرى بالفعل.");
      return;
    }

    // استخدم الفترة المحفوظة لو موجودة، وإلا يجب الاختيار
    const schedId = alreadyInThisPlan
      ? Number(alreadyInThisPlanId)
      : Number(selectedScheduleId || 0);

    if (!schedId) {
      setError("برجاء اختيار الفترة أولاً لعرض الجدول وتفعيل الاشتراك");
      return;
    }
    if (selectedCourseIds.length === 0) {
      setError("اختر كورس واحد على الأقل");
      return;
    }

    setError("");
    setSuccess("");

    try {
      setPosting(true);

      // جهّز أسماء الكورسات
      const nameById = new Map(
        (planInfo?.courses || []).map((c) => [Number(c.courseId), c.courseName || ""])
      );
      const coursesPayload = selectedCourseIds.map((id) => ({
        courseId: Number(id),
        courseName: nameById.get(Number(id)) || "",
      }));

      // payload
      const body = {
        studentName,
        studentId: Number(selectStudentID),
        planId: Number(selectPlanID),
        scheduleTimeId: Number(schedId),
        planName: planInfo?.planName || "",
        scheduleTimeName:
          (selectedScheduleId
            ? scheduleTimes.find((x) => String(x.id) === String(selectedScheduleId))?.name
            : null) ||
          (alreadyInThisPlanId
            ? scheduleTimes.find((x) => Number(x.id) === Number(alreadyInThisPlanId))?.name
            : null) ||
          "",
        parentId: Number(parentId),
        studyLevelName: levelDisplay || "",
        totlePrice: Number(totalFinal || 0),
        courses: coursesPayload,
      };

      await axios.post(
        `${BASE_URL}/api/Parent/create-student-apply`,
        body,
        authHeaders
      );

      // نظّف الاختيارات وافتح المودال
      setSelectedCourseIds([]);
      setShowSuccessModal(true);
    } catch (err) {
      const errorMessage =
        err?.response?.status === 400
          ? "الطلب غير صالح. راجع البيانات."
          : err?.response?.status === 409
          ? "يوجد طلب سابق لنفس البيانات."
          : err?.response?.data?.title || err?.message || "تعذر إتمام الطلب";
      setError(errorMessage);
    } finally {
      setPosting(false);
    }
  };

  /* ===============================
     Render
  =============================== */
  return (
    <section dir="rtl" className="min-h-screen bg-slate-100 py-10 px-6">
      {/* مودال النجاح */}
      <SuccessModal
        open={showSuccessModal}
        onClose={() => {setShowSuccessModal(false);  navigate(PROFILE_ROUTE);}}
        onConfirm={() => {
          setShowSuccessModal(false);
          navigate(PROFILE_ROUTE);
        }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-[#f97316]" />
              الكورسات الأونلاين
            </h1>
          </div>

        <span className="inline-flex items-center rounded-full bg-slate-800 text-white text-sm font-semibold px-4 py-2 gap-2">
            <GraduationCap className="h-4 w-4" />
            {loading ? "جارِ التحميل…" : `${planInfo?.courses?.length || 0} كورس`}
          </span>
        </div>

        {/* Banners */}
        {planInfo && (
          <div className="mb-6">
            {planInfo.isCanEnrolle === false && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-amber-800">
                  لا يمكنك الاشتراك في هذه الخطة لأن الطالب مشترك في خطة أخرى.
                  <div className="text-sm text-amber-700 mt-1">
                    سيتم عرض التفاصيل فقط، وجميع المواد ستكون مغلقة.
                  </div>
                </div>
              </div>
            )}

            {/* إشعار معلوماتي */}
            {planInfo.isCanEnrolle !== false && alreadyInThisPlan && (
              <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 flex items-start gap-3">
                <CheckCircle className="h-5 و-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <div className="text-sky-800">
                  تم الاشتراك مسبقًا في كورسات الأونلاين مع فترة محددة.
                  <div className="text-sm text-sky-700 mt-1">
                    يمكنك إضافة كورسات جديدة الآن. الفترة الحالية:{" "}
                    <strong>{selectedScheduleName}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Guard if IDs missing */}
        {(!selectStudentID || !selectPlanID) && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-amber-800">
              لا يوجد طالب/خطة محددين. من فضلك ارجعي وحددي الطالب ثم الخطة.
            </div>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="text-rose-700">{error}</div>
          </div>
        )}

        {/* رسالة نجاح نصية (اختياري) — ممكن تسيبيها أو تشيليها */}
        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-emerald-700">{success}</div>
          </div>
        )}

        {studentProfileError && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="text-rose-700">{studentProfileError}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Toolbar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={toggleAllCourses}
                  disabled={
                    loading ||
                    !planInfo?.courses?.length ||
                    selectableCourseIds.length === 0 ||
                    hardDisableAll
                  }
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAllSelected ? "إلغاء تحديد الكل" : "تحديد الكل (المتاح فقط)"}
                </button>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="text-slate-600">
                    المختار:{" "}
                    <span className="font-semibold text-slate-900">
                      {selectedCount}
                    </span>
                  </div>

                  {totalOld > totalFinal && (
                    <div className="text-slate-500">
                      قبل:{" "}
                      <span className="line-through">
                        {totalOld.toLocaleString()} جنيه
                      </span>
                    </div>
                  )}

                  <div className="font-bold text-emerald-700">
                    الإجمالي: {totalFinal.toLocaleString()} جنيه
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {Array.from({ length: 6 }, (_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : !planInfo ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  لا توجد بيانات متاحة
                </h3>
                <p className="text-slate-600">تعذر تحميل بيانات الخطة المطلوبة</p>
              </div>
            ) : !planInfo.courses?.length ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  لا توجد كورسات متاحة
                </h3>
                <p className="text-slate-600">لا توجد كورسات في هذه الخطة حالياً</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                {planInfo.courses.map((course) => {
                  // ❗ أقفل بالكورس فقط
                  const disabled = !!course.isEnrolled || hardDisableAll;
                  const disabledReason = hardDisableAll
                    ? "otherPlan"
                    : course.isEnrolled
                    ? "enrolled"
                    : null;

                  return (
                    <CourseCard
                      key={course.courseId}
                      course={course}
                      disabled={disabled}
                      disabledReason={disabledReason}
                      isSelected={selectedCourseIds.includes(course.courseId)}
                      onToggle={toggleCourse}
                    />
                  );
                })}
              </div>
            )}

            {/* Schedule Time Selection */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#f97316]" />
                  اختيار الفترة الدراسية
                </h2>
                <p className="text-slate-600 text-sm mt-2">
                  {alreadyInThisPlan
                    ? "تم تحديد فترة سابقًا — لا يمكن تغيير الفترة. سنستخدمها تلقائيًا للاشتراك."
                    : hardDisableAll
                    ? "لا يمكنك اختيار فترة لهذه الخطة بسبب الاشتراك في خطة أخرى."
                    : "اختر التوقيت المناسب لعرض جدول الحصص الأسبوعي"}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {scheduleTimes.map((scheduleTime) => (
                  <ScheduleTimeCard
                    key={scheduleTime.id}
                    scheduleTime={scheduleTime}
                    isSelected={
                      alreadyInThisPlan
                        ? Number(scheduleTime.id) === Number(alreadyInThisPlanId)
                        : String(scheduleTime.id) === String(selectedScheduleId)
                    }
                    onSelect={(id) => setSelectedScheduleId(String(id))}
                    disabled={hardDisableAll || alreadyInThisPlan}
                  />
                ))}
              </div>

              {!alreadyInThisPlan && !selectedScheduleId && scheduleTimes.length > 1 && !hardDisableAll && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-sm">
                    اختيار الفترة ضروري لعرض الجدول وتفعيل زر الاشتراك
                  </p>
                </div>
              )}
            </div>

            {/* Class Schedule */}
            <div
              id="classScheduleSection"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#f97316]" />
                جدول الحصص الأسبوعي
              </h2>

              {!alreadyInThisPlan && !selectedScheduleId ? (
                <div className="text-center py-12 text-slate-500">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-medium mb-2">
                    {hardDisableAll
                      ? "عرض الجدول غير متاح."
                      : "اختر الفترة الدراسية"}
                  </p>
                  {!hardDisableAll && (
                    <p className="text-sm">
                      سيظهر الجدول الأسبوعي هنا بعد اختيار الفترة المناسبة
                    </p>
                  )}
                </div>
              ) : studentProfileLoading || levelsLoading ? (
                <div className="flex items-center justify-center py-8 text-slate-600">
                  <Loader2 className="h-6 w-6 animate-spin mr-3" />
                  جاري تجهيز بيانات الطالب...
                </div>
              ) : scheduleLoading ? (
                <div className="flex items-center justify-center py-8 text-slate-600">
                  <Loader2 className="h-6 w-6 animate-spin mr-3" />
                  جاري تحميل الجدول...
                </div>
              ) : scheduleError ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-rose-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    خطأ في تحميل الجدول
                  </h3>
                  <p className="text-rose-600">{scheduleError}</p>
                </div>
              ) : (
                <ClassScheduleTable classSchedule={classSchedule} />
              )}
            </div>
          </div>

          {/* Sidebar - Subscription Summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-slate-900 text-white p-5">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    ملخص الاشتراك
                  </h3>
                </div>

                <div className="p-5">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-900 ">
                        الطالب
                      </span>
                      <span className="font-semibold text-slate-600 text-left">
                        {studentName}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-900">المستوى</span>
                      <span className="font-semibold text-slate-600 text-left">
                        {levelDisplay}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-900">الفصل</span>
                      <span className="font-semibold text-slate-600 text-left">
                        {semesterDisplay}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-900">الفترة</span>
                      <span className="font-semibold text-slate-600 text-left">
                        {selectedScheduleName}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="font-semibold text-slate-900">
                        عدد المواد
                      </span>
                      <span className="font-bold text-[#f97316] text-left">
                        {selectedCount}
                      </span>
                    </div>
                  </div>

                  {selectedCourses.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">
                        المواد المختارة
                      </h4>
                      <div className="section space-y-2 max-h-40 overflow-y-auto">
                        {selectedCourses.map((course) => (
                          <div
                            key={course.courseId}
                            className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50"
                          >
                            <span className="text-sm text-slate-800 font-medium line-clamp-1">
                              {course.courseName}
                            </span>
                            <span className="text-xs text-emerald-700 font-semibold whitespace-nowrap mr-2">
                              {Number(course.finalPrice || 0).toLocaleString()}{" "}
                              جنيه
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 mb-6">
                    <div className="space-y-3">
                      {totalOld > totalFinal && totalOld > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">السعر الأصلي</span>
                          <span className="line-through text-slate-400">
                            {totalOld.toLocaleString()} جنيه
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-slate-900">
                          الإجمالي
                        </span>
                        <div className="text-left">
                          <div className="text-2xl font-bold text-emerald-600">
                            {totalFinal.toLocaleString()}
                            <span className="text-lg text-slate-600"> جنيه</span>
                          </div>
                        </div>
                      </div>

                      {discountPercentage > 0 && (
                        <div className="flex justify-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800">
                            وفر {discountPercentage}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleEnrollment}
                    disabled={
                      posting ||
                      hardDisableAll ||
                      selectedCourseIds.length === 0 ||
                      (!alreadyInThisPlan && !selectedScheduleId) ||
                      !selectStudentID ||
                      !selectPlanID
                    }
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 text-white text-lg font-bold hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {posting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        جاري التأكيد...
                      </>
                    ) : hardDisableAll ? (
                      "غير متاح للاشتراك"
                    ) : !alreadyInThisPlan && !selectedScheduleId ? (
                      "اختر الفترة أولاً"
                    ) : selectedCourseIds.length === 0 ? (
                      "اختر كورس واحد على الأقل"
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        سجل الآن
                      </>
                    )}
                  </button>

                  <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>سيتم إرسال طلبك ببيانات المواد المختارة.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>بعد المراجعة سنقوم بالتواصل معك لتأكيد الاشتراك.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
