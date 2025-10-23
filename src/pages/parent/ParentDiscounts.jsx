// src/pages/parent/ParentJobDiscounts.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const BASE = "https://edu-smart.runasp.net";

export default function ParentJobDiscounts() {
  const token = useSelector((s) => s.auth.token);
  const userInfo = useSelector((s) => s.auth.userData);

  const [rows, setRows] = useState([]);      // [{ job, discount, mex_Students, id? }]
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // جدول: بحث + فرز
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState("job");
  const [sortDir, setSortDir] = useState("asc");

  // نافذة الرفع
  const [modalOpen, setModalOpen] = useState(false);
  const [picked, setPicked] = useState(null);     
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // اجلب بروفايل الأب ← allJob_Discount
  useEffect(() => {
    if (!userInfo?.id || !token) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await axios.get(
          `${BASE}/api/Parent/profile/${userInfo.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!mounted) return;
        const list = Array.isArray(data?.allJob_Discount) ? data.allJob_Discount : [];
        setRows(list);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.response?.data?.title || e?.message || "تعذّر تحميل البيانات");
        setRows([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [token, userInfo?.id]);

  const selectedJob = userInfo?.jobs?.[0]?.job;

const withIds = useMemo(() => {
  return rows.map((r) => ({
    ...r,
    
    id: r.job === selectedJob ? r.id : r.id,
  }));
}, [rows, selectedJob]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let out = withIds.filter(
      (r) =>
        (r.job || "").toLowerCase().includes(s) ||
        String(r.mex_Students ?? "").toLowerCase().includes(s)
    );
    out.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "job") return (a.job || "").localeCompare(b.job || "") * dir;
      if (sortKey === "discount") return ((a.discount || 0) - (b.discount || 0)) * dir;
      if (sortKey === "mex_Students")
        return ((a.mex_Students || 0) - (b.mex_Students || 0)) * dir;
      return 0;
    });
    return out;
  }, [withIds, q, sortKey, sortDir]);

  function openModal(row) {
    setPicked(row);
    setFile(null);
    setModalOpen(true);
  }

  // رفع الملف
  async function submitProof(e) {
    e?.preventDefault?.();
    if (!picked) return alert("اختَر وظيفة.");
    if (!file) return alert("اختَر ملف الإثبات.");

    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) return alert("يسمح بـ PDF/JPG/PNG فقط.");
    if (file.size > 5 * 1024 * 1024) return alert("أقصى حجم 5MB.");

    const fd = new FormData();
    fd.append("ProofEmploymentFile", file);
    fd.append("Parentid", userInfo.id);
    fd.append("JobDiscountId", picked.id);         
    fd.append("JobDiscountName", picked.job || "");
    

    console.log(userInfo.id , picked.id , picked.job)
    try {
      setSubmitting(true);
      await axios.post(`${BASE}/api/Parent/upload-proof-employment`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("تم إرسال الطلب ");
      setModalOpen(false);
    } catch (e) {
      alert(e?.response?.data?.title || e?.message || "فشل رفع المستند");
    } finally {
      setSubmitting(false);
    }
  }

  const Th = ({ k, children }) => (
    <th
      className="px-4 py-3 text-right text-sm font-semibold text-slate-700 cursor-pointer select-none"
      onClick={() => {
        if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else {
          setSortKey(k);
          setSortDir("asc");
        }
      }}
      title="اضغط للفرز"
    >
      <div className="inline-flex items-center gap-1">
        {children}
        {sortKey === k && (
          <span className="text-xs text-slate-500">{sortDir === "asc" ? "▲" : "▼"}</span>
        )}
      </div>
    </th>
  );

  return (
    <section dir="rtl" className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* الهيدر */}
      <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">خصومات الوظائف</h1>
        <p className="text-slate-700">اختر وظيفتك من الجدول لرفع مستند إثبات العمل.</p>
      </div>

      {/* أدوات الجدول */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          type="search"
          placeholder="ابحث باسم الوظيفة أو الحد الأقصى…"
          className="w-full md:w-80 rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-indigo-500"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* حالات */}
      {loading ? (
        <div className="grid gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : err ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 p-4">{err}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600">
          لا توجد خصومات متاحة حاليًا.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th k="job">الوظيفة</Th>
                <Th k="discount">نسبة الخصم</Th>
                <Th k="mex_Students">الحد الأقصى للطلاب</Th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{r.job || "—"}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5">
                      {Math.round((Number(r.discount ?? 0)) * 100)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{r.mex_Students ?? "—"}</td>
                  <td className="px-4 py-3 text-left">
                    <button
                      type="button"
                      className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                      onClick={() => openModal(r)}
                    >
                      اختيار
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal رفع المستند */}
      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">رفع إثبات الوظيفة</h3>
                <p className="text-sm text-slate-600 mt-1">
                  الوظيفة المختارة:{" "}
                  <span className="font-semibold">{picked?.job ?? "—"}</span>
                </p>
              </div>
              <button
                className="text-slate-500 hover:text-slate-700"
                onClick={() => setModalOpen(false)}
                aria-label="اغلاق"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitProof} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ملف الإثبات (PDF/JPG/PNG — حتى 5MB)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full border rounded-lg p-2 bg-white"
                />
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button
                  type="button"
                  className="rounded-lg border px-4 py-2 hover:bg-gray-50"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 disabled:opacity-60"
                  disabled={submitting || !file}
                >
                  {submitting ? "جارٍ الإرسال..." : "إرسال"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
