// src/pages/parent/OfflineCoursesPlan.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../api/BASE_URL";

export default function OfflineCourses() {
  const { planId, studentId } = useParams();
  const token = useSelector((s) => s.auth.token);
  const { id: parentId } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [planInfo, setPlanInfo] = useState(null); // { planName, studentName, studyLevel, semesterName, courses: [] }
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch courses
  useEffect(() => {
    if (!token || !planId || !studentId) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(""); setMsg("");
        const url = `${BASE_URL}/api/Subscription/All-Courses-plans-to-Enroll`;
        const body = { planId: Number(planId), studentId: Number(studentId), parentId: Number(parentId) };
        const { data } = await axios.post(url, body, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!mounted) return;
        setPlanInfo(
          data && Array.isArray(data.courses)
            ? data
            : { planName: "", studentName: "", studyLevel: "", semesterName: "", courses: [] }
        );
        setSelectedIds([]);
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
  }, [token, planId, studentId, parentId]);

  // Totals (UI only)
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

  // Toggle course
  const toggleCourse = (cid) =>
    setSelectedIds(prev => prev.includes(cid) ? prev.filter(x => x !== cid) : [...prev, cid]);

  // Select all
  const allIds = useMemo(() => (planInfo?.courses || []).map(c => c.courseId), [planInfo?.courses]);
  const isAllSelected = allIds.length > 0 && selectedIds.length === allIds.length;
  const toggleAll = () => setSelectedIds(prev => (prev.length === allIds.length ? [] : allIds));

  // Enroll (API يسجّل كل كورسات الخطة)
  const enrollAll = async () => {
    if (!token) return;
    setErr(""); setMsg("");
    try {
      setPosting(true);
      const body = { planId: Number(planId), studentId: Number(studentId), parentId: Number(parentId) };
      await axios.post(`${BASE_URL}/api/Subscription/All-Courses-plans-to-Enroll`, body, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", accept: "*/*" },
      });
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

  return (
    <section dir="rtl" className="min-h-[70vh] w-full bg-slate-100 py-10 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">الكورسات الأوفلاين</h1>
          </div>
          <span className="inline-flex items-center rounded-full bg-slate-200 text-slate-800 text-sm font-semibold px-3 py-1">
            {loading ? "جارِ التحميل…" : `${planInfo?.courses?.length || 0} كورس`}
          </span>
        </div>

        {/* Alerts */}
        {!!err && <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-base">{err}</div>}
        {!!msg && <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-base">{msg}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: tools + list */}
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

            {/* List / skeleton / empty */}
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
          </div>

          {/* Right: Summary card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">ملخص الاشتراك</h3>

                  <div className="grid grid-cols-2 gap-y-2 text-base">
                    <span className="text-slate-600">الطالب</span>
                    <span className="font-semibold text-slate-900 text-end">{planInfo?.studentName || "—"}</span>

                    <span className="text-slate-600">المستوى</span>
                    <span className="font-semibold text-slate-900 text-end">{planInfo?.studyLevel || "—"}</span>

                    <span className="text-slate-600">الفصل</span>
                    <span className="font-semibold text-slate-900 text-end">{planInfo?.semesterName || "—"}</span>

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
                      disabled={posting || selectedIds.length === 0}
                      className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-white text-lg font-bold hover:bg-slate-800 transition disabled:opacity-50"
                    >
                      {posting ? "جارِ التأكيد…" : "اشترك الآن"}
                    </button>

                    {!!err && <p className="mt-3 text-center text-base text-red-600">{err}</p>}
                    {!!msg && <p className="mt-3 text-center text-base text-emerald-700">{msg}</p>}
                  </div>

                  <ul className="mt-6 space-y-2 text-base text-slate-800">
                    <li>✅ الاشتراك يشمل المواد المختارة فقط.</li>
                    <li>📆 لا يوجد جدول أو فترات في الأوفلاين.</li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
