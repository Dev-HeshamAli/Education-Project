// src/pages/parent/OfflineCoursesPlan.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/BASE_URL";
import {
  BookOpen,
  User,
  CheckSquare,
  Square,
  Loader2,
  AlertCircle,
  CheckCircle,
  Play,
  Zap,
  Lock,
  CheckCheck,
} from "lucide-react";

// ✅ IDs من الـstore بدل بارامترز الراوتر
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
          <p className="text-slate-600 mb-6">تم تسجيل بيانات المواد المختارة وسيتم التواصل معك خلال 24 ساعة.</p>

          <div className="flex items-center justify-center gap-3">
            {/*<button
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

export default function OfflineCourses() {
  const navigate = useNavigate();
  const PROFILE_ROUTE = "/parent/parent-profile";

  // IDs من الـstore
  const selectStudentID = useSelector(selectStudentIDSelector);
  const selectPlanID = useSelector(selectPlanIDSelector);

  const token = useSelector((s) => s.auth.token);
  const { id: parentId } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // 👇 هنستقبل هنا نفس الريسبونس اللي بيرجع من All-Courses-plans-to-Enroll
  // { planName, studentName, studyLevel, semesterName, courses: [], isCanEnrolle, isHaveSchedulId }
  const [planInfo, setPlanInfo] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // 🔔 حالة المودال
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ============================
  // حراسة مبكرة لو مفيش IDs
  // ============================
  if (!selectStudentID || !selectPlanID) {
    return (
      <section
        dir="rtl"
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-6"
      >
        <div className="text-center bg-white px-8 py-12 rounded-3xl shadow-xl max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <div className="text-amber-700 text-xl font-medium">
            لا يوجد طالب/خطة محددين.
          </div>
          <p className="text-slate-600 mt-2">
            من فضلك ارجعي لاختيار الطالب ثم الخطة مرة أخرى.
          </p>
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

  // Fetch courses
  useEffect(() => {
    if (!token || !selectPlanID || !selectStudentID || !parentId) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        setMsg("");
        const url = `${BASE_URL}/api/Subscription/All-Courses-plans-to-Enroll`;
        const body = {
          planId: Number(selectPlanID),
          studentId: Number(selectStudentID),
          parentId: Number(parentId),
        };
        const { data } = await axios.post(url, body, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            accept: "*/*",
          },
        });
        if (!mounted) return;

        // نتأكد إن فيه مصفوفة كورسات
        const normalized =
          data && Array.isArray(data.courses)
            ? data
            : {
                planName: "",
                studentName: "",
                studyLevel: "",
                semesterName: "",
                courses: [],
                isCanEnrolle: data?.isCanEnrolle ?? true,
                isHaveSchedulId: data?.isHaveSchedulId ?? null,
              };

        setPlanInfo(normalized);

        // اشيل أي اختيارات لكورسات طلعت مسجّلة بالفعل
        setSelectedIds((prev) =>
          prev.filter((id) =>
            (normalized?.courses || []).some(
              (c) => c.courseId === id && !c.isEnrolled
            )
          )
        );
      } catch (e) {
        if (!mounted) return;
        const friendly =
          e?.response?.status === 403
            ? "ليس لديك صلاحية لعرض هذه البيانات."
            : e?.response?.status === 404
            ? "لا توجد بيانات متاحة."
            : e?.response?.data?.title || e?.message || "حدث خطأ غير متوقع";
        setErr(friendly);
        setPlanInfo(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [token, selectPlanID, selectStudentID, parentId]);

  // ============================
  // منطق المنع/السماح حسب المطلوب
  // ============================
  const blockByOtherPlan = planInfo?.isCanEnrolle === false;
  const alreadyInThisPlan =
    planInfo?.isCanEnrolle !== false && planInfo?.isHaveSchedulId != null;
  const blockAllActions = !!(blockByOtherPlan || alreadyInThisPlan);

  // فقط الكورسات المسموح اختيارها (غير مشترَك فيها)
  const selectableIds = useMemo(
    () =>
      (planInfo?.courses || [])
        .filter((c) => !c.isEnrolled)
        .map((c) => c.courseId),
    [planInfo?.courses]
  );

  // Totals (UI only)
  const { totalFinal, totalOld, countSelected, selectedCourses } = useMemo(() => {
    const list = planInfo?.courses || [];
    const map = new Map(list.map((c) => [c.courseId, c]));
    let f = 0,
      o = 0;
    const sel = [];
    selectedIds.forEach((cid) => {
      const it = map.get(cid);
      if (it) {
        f += Number(it.finalPrice || 0);
        o += Number(it.oldPrice || 0);
        sel.push(it);
      }
    });
    return {
      totalFinal: f,
      totalOld: o,
      countSelected: selectedIds.length,
      selectedCourses: sel,
    };
  }, [selectedIds, planInfo?.courses]);

  const discountPct =
    totalOld > totalFinal && totalOld > 0
      ? Math.round((1 - totalFinal / totalOld) * 100)
      : 0;

  // Toggle course
  const toggleCourse = (cid, disabled) => {
    if (disabled || blockAllActions) return; // ممنوع لو مقفول
    setSelectedIds((prev) =>
      prev.includes(cid) ? prev.filter((x) => x !== cid) : [...prev, cid]
    );
  };

  // Select all (المتاح فقط)
  const isAllSelected =
    selectableIds.length > 0 && selectedIds.length === selectableIds.length;
  const toggleAll = () => {
    if (blockAllActions) return;
    setSelectedIds((prev) =>
      prev.length === selectableIds.length ? [] : selectableIds
    );
  };

  // ============================
  // إرسال طلب التقديم (بدل الاشتراك الفوري)
  // ============================
  const enrollAll = async () => {
    if (!token) return;
    if (blockAllActions) return;
    if (selectedIds.length === 0) {
      setErr("اختر مادة واحدة على الأقل.");
      return;
    }
    setErr("");
    setMsg("");

    try {
      setPosting(true);

      // أسماء المواد المختارة
      const nameById = new Map(
        (planInfo?.courses || []).map((c) => [Number(c.courseId), c.courseName || ""])
      );
      const coursesPayload = selectedIds.map((id) => ({
        courseId: Number(id),
        courseName: nameById.get(Number(id)) || "",
      }));

      // ✅ Payload طبقًا للـschema الجديد للأوفلاين
      const body = {
        studentName: planInfo?.studentName || "",
        studentId: Number(selectStudentID),
        planId: Number(selectPlanID),
        planName: planInfo?.planName || "",
        parentId: Number(parentId),
        studyLevelName: planInfo?.studyLevel || "",
        totlePrice: Number(totalFinal || 0), // نفس تهجئة المفتاح في الـAPI
        scheduleTimeId: null,                // الأوفلاين: نبعت null
        scheduleTimeName: "",                // مفيش فترة للأوفلاين
        courses: coursesPayload,             // [{courseId, courseName}]
      };

      await axios.post(
        `${BASE_URL}/api/Parent/create-student-apply`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      // لا نعدّل isEnrolled محليًا (طلب تقديم فقط)
      setSelectedIds([]);

      // رسالة نصية (اختياري) + افتح المودال
      setMsg("تم تسجيل بياناتك بنجاح وسيتم التواصل معك خلال 24 ساعة.");
      setShowSuccessModal(true);
    } catch (e) {
      const friendly =
        e?.response?.status === 400
          ? "الطلب غير صالح. راجع البيانات."
          : e?.response?.status === 409
          ? "يوجد طلب سابق لنفس البيانات."
          : e?.response?.data?.title || e?.message || "تعذر إتمام الطلب.";
      setErr(friendly);
    } finally {
      setPosting(false);
    }
  };

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12"
    >
      {/* مودال النجاح */}
      <SuccessModal
        open={showSuccessModal}
        onClose={() => {setShowSuccessModal(false);  navigate(PROFILE_ROUTE);}}
        onConfirm={() => {
          setShowSuccessModal(false);
          navigate(PROFILE_ROUTE);
        }}
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* Hero Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg mb-4">
            <Play className="w-4 h-4" />
            مواد مسجلة
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">
            نظام الحصص المسجلة
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            اختر المواد التي تريد دراستها وتعلم في أي وقت يناسبك
          </p>
        </div>

        {/* Banners حسب المنطق الجديد */}
        {planInfo && (
          <div className="mb-6 space-y-3">
            {planInfo.isCanEnrolle === false && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-amber-800">
                  لا يمكنك الاشتراك في هذه الخطة لأن الطالب مشترك في خطة أخرى.
                  <div className="text-sm text-amber-700 mt-1">
                    سيتم عرض تفاصيل الخطة فقط، بدون إمكانية الاشتراك.
                  </div>
                </div>
              </div>
            )}

            {/* لاحظ الشرط: لازم isCanEnrolle !== false */}
            {planInfo.isCanEnrolle !== false &&
              planInfo.isHaveSchedulId != null && (
                <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sky-800">
                    تم الاشتراك في هذه الخطة بالفعل. لا يمكن إعادة الاشتراك.
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Alerts عامة */}
        {!!err && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 text-red-700 px-6 py-4 text-lg shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {err}
          </div>
        )}
        {!!msg && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 text-green-700 px-6 py-4 text-lg shadow-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            {msg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: tools + list */}
          <div className="lg:col-span-2 space-y-8">
            {/* Toolbar */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={toggleAll}
                  disabled={
                    loading || selectableIds.length === 0 || blockAllActions
                  }
                  className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 text-lg text-slate-800 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                  {isAllSelected
                    ? "إلغاء تحديد الكل"
                    : "تحديد الكل (المتاح فقط)"}
                </button>

                <div className="flex flex-wrap items-center gap-6">
                  {loading ? (
                    <span className="text-slate-600">جارِ التحميل…</span>
                  ) : (
                    <>
                      {totalOld > totalFinal && (
                        <div className="text-lg text-slate-700">
                          السعر الأصلي:
                          <span className="mr-2 line-through text-slate-400 font-semibold">
                            {Number(totalOld || 0).toLocaleString()} EGP
                          </span>
                        </div>
                      )}
                      <div className="text-lg font-bold text-emerald-700">
                        السعر النهائي:
                        <span className="mr-2">
                          {Number(totalFinal || 0).toLocaleString()} EGP
                        </span>
                      </div>
                      <div className="text-lg text-slate-600">
                        المحدد:
                        <span className="mr-2 font-bold text-slate-900">
                          {countSelected}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* List / skeleton / empty */}
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-36 rounded-3xl bg-white shadow-lg border border-slate-200 animate-pulse"
                  />
                ))}
              </div>
            ) : !planInfo ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xl">
                <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <div className="text-slate-600 text-xl">
                  لا توجد بيانات متاحة.
                </div>
              </div>
            ) : (planInfo.courses || []).length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xl">
                <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <div className="text-slate-600 text-xl">
                  لا توجد مواد متاحة الآن لهذه الخطة.
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {planInfo.courses.map((c) => {
                  const checked = selectedIds.includes(c.courseId);
                  const disabled = !!c.isEnrolled || blockAllActions;
                  const showOld =
                    Number(c.oldPrice || 0) > Number(c.finalPrice || 0);
                  return (
                    <label
                      key={c.courseId}
                      className={[
                        "group rounded-3xl border bg-white shadow-lg transition-all p-6 relative select-none flex gap-4",
                        disabled
                          ? "opacity-60 cursor-not-allowed border-slate-200 bg-slate-50"
                          : "cursor-pointer transform hover:scale-105",
                        checked && !disabled
                          ? "border-slate-900 ring-2 ring-slate-300 shadow-xl bg-gradient-to-br from-white to-slate-50"
                          : !disabled
                          ? "border-slate-200 hover:shadow-xl hover:border-slate-300"
                          : "",
                      ].join(" ")}
                      title={disabled ? "غير متاح" : undefined}
                    >
                      {/* Badge for enrolled or blocked */}
                      {(c.isEnrolled || blockAllActions) && (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-slate-800 text-white text-[11px] font-semibold px-2 py-0.5">
                          <Lock className="h-3 w-3" />
                          {blockByOtherPlan
                            ? "مغلق (خطة أخرى)"
                            : alreadyInThisPlan
                            ? "مشترك بهذه الخطة"
                            : "مسجّل بالفعل"}
                        </span>
                      )}

                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            checked && !disabled
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-300 group-hover:border-slate-400"
                          }`}
                        >
                          {checked && !disabled && (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </div>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked && !disabled}
                          onChange={() => toggleCourse(c.courseId, disabled)}
                          disabled={disabled}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-2">
                            <Play className="w-5 h-5 text-purple-500 flex-shrink-0" />
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                              {c.courseName}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {showOld && (
                              <span className="line-through text-slate-400 text-lg">
                                {Number(c.oldPrice || 0).toLocaleString()} EGP
                              </span>
                            )}
                            <span className="font-bold text-emerald-600 text-xl">
                              {Number(c.finalPrice || 0).toLocaleString()} EGP
                            </span>
                          </div>

                          {checked && !disabled && (
                            <div className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">محدد</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Summary card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                <div className="bg-slate-900 text-white p-5">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    ملخص الاشتراك
                  </h3>
                </div>

                <div className="p-6">
                  <div className="space-y-4 text-lg">
                    <div className="flex items-center justify-between py-2">
                      <span className="font-semibold text-slate-900">
                        الطالب
                      </span>
                      <span className="font-semibold text-slate-600">
                        {planInfo?.studentName || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="font-semibold text-slate-900">
                        المستوى
                      </span>
                      <span className="font-semibold text-slate-600">
                        {planInfo?.studyLevel || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="font-semibold text-slate-900">
                        الفصل
                      </span>
                      <span className="font-semibold text-slate-600">
                        {planInfo?.semesterName || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="font-semibold text-slate-900">
                        المواد المحددة
                      </span>
                      <span className="font-bold text-slate-600">
                        {countSelected}
                      </span>
                    </div>
                  </div>

                  {selectedCourses.length > 0 && (
                    <>
                      <div className="mt-8">
                        <p className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          المواد المحددة
                        </p>
                        <div className="space-y-2">
                          {selectedCourses.map((c) => (
                            <div
                              key={c.courseId}
                              className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="text-green-800 font-medium">
                                {c.courseName}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                    <div className="flex items-end justify-between mb-6">
                      <div>
                        <div className="text-3xl font-extrabold text-emerald-600">
                          {Number(totalFinal || 0).toLocaleString()}{" "}
                          <span className="text-xl">EGP</span>
                        </div>
                        {totalOld > totalFinal && (
                          <div className="text-lg line-through text-slate-400">
                            {Number(totalOld || 0).toLocaleString()} EGP
                          </div>
                        )}
                      </div>

                      {discountPct > 0 && (
                        <span className="flex items-center gap-1 text-white bg-red-500 px-3 py-2 rounded-xl font-bold">
                          <Zap className="w-4 h-4" />
                          وفر {discountPct}%
                        </span>
                      )}
                    </div>

                    <button
                      onClick={enrollAll}
                      disabled={
                        posting || selectedIds.length === 0 || blockAllActions
                      }
                      className={`w-full rounded-2xl py-4 text-white text-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                        posting ||
                        selectedIds.length === 0 ||
                        blockAllActions
                          ? "bg-slate-400 cursor-not-allowed opacity-60"
                          : "bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {posting ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          جارِ التأكيد…
                        </div>
                      ) : blockByOtherPlan ? (
                        "غير متاح (مشترك في خطة أخرى)"
                      ) : alreadyInThisPlan ? (
                        "مشترك بهذه الخطة"
                      ) : selectedIds.length === 0 ? (
                        "اختر مادة واحدة على الأقل"
                      ) : (
                        "سجل الآن"
                      )}
                    </button>

                    {!!err && (
                      <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        <AlertCircle className="w-4 h-4" />
                        <span>{err}</span>
                      </div>
                    )}
                    {!!msg && (
                      <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                        <CheckCircle className="w-4 h-4" />
                        <span>{msg}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 space-y-3 text-lg text-slate-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>سيتم إرسال طلبك ببيانات المواد المحددة.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>بعد المراجعة سيتم التواصل معك لتأكيد الاشتراك.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>محتوى مسجل عالي الجودة ومرن في المشاهدة.</span>
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
