import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Mail, IdCard, MapPin, Phone, Briefcase } from "lucide-react";

function Section({ title, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm ${className}`}>
      {title && <h3 className="mb-3 text-lg font-bold text-slate-900">{title}</h3>}
      {children}
    </section>
  );
}

function Row({ label, value, icon, mono }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
      <div className="flex items-center gap-2 text-slate-900">
        {icon}
        <span className="font-semibold">{label}</span>
      </div>
      <span className={`text-slate-900 truncate ${mono ? "font-mono" : ""}`} title={value ?? "—"}>
        {value ?? "—"}
      </span>
    </div>
  );
}

export default function ParentInfo({ parent }) {
  const isLoading = !parent;

  const fullName    = parent?.fullName ?? "وليّ الأمر";
  const email       = parent?.email ?? "—";
  const ssn         = parent?.ssn;
  const country     = parent?.country;
  const governorate = parent?.governorate;
  const phones      = parent?.phones ?? [];
  const jobs        = parent?.jobs ?? [];

  const initials = useMemo(
    () => (fullName || "؟").split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase(),
    [fullName]
  );

  return (
    // مهم: overflow-hidden عشان الألوان تفضل جوّا الكارد
    <div dir="rtl" className="overflow-hidden rounded-3xl border border-neutral-300 bg-white shadow-[0_14px_40px_-16px_rgba(0,0,0,.2)]">
      {/* الغلاف الداكن والمثلث البرتقالي داخل الكارد فقط */}
      <div className="relative">
        <div className="h-44 bg-slate-800" />
        <div className="absolute right-0 top-0 w-0 h-0 border-t-[176px] border-orange-400 border-l-[220px] border-l-transparent" />

        <div className="px-6">
          <div className="relative -mt-12 flex items-end gap-4">
            <div className="h-24 w-24 rounded-full bg-white ring-4 ring-white shadow">
              <div className="h-full w-full rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#f3f4f6_0%,#e2e8f0_100%)] flex items-center justify-center text-slate-700 text-3xl font-black">
                {initials}
              </div>
            </div>

            {/* اسم واضح جدًا فوق الخلفية الداكنة */}
            <div className="pb-2">
              <h2 className="text-3xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,.35)]">
                {isLoading ? "…" : fullName}
              </h2>
              <div className="mt-1 inline-flex items-center gap-2 bg-white px-2 py-[2px] rounded text-slate-800">
                <Mail className="h-4 w-4" />
                <span className="truncate">{isLoading ? "…" : email}</span>
              </div>
            </div>

            <Link
              to="/parent/edit-profile"
              className="ms-auto mb-2 inline-flex items-center rounded-xl bg-[#f97316] hover:bg-[#ea580c] px-4 py-2 text-sm text-white"
            >
              تعديل الملف الشخصي
            </Link>
          </div>
        </div>
      </div>

      {/* نظرة عامة فقط (مفيش سكشن أبناء هنا) */}
      <div className="px-6 pb-8 pt-5">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="h-40 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-40 bg-slate-100 rounded-xl animate-pulse" />
            <div className="md:col-span-2 h-40 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Section title="البيانات الأساسية">
              <div className="divide-y divide-neutral-100">
                <Row label="الرقم القومي" value={ssn} mono icon={<IdCard className="h-4 w-4 text-[#f97316]" />} />
                <Row label="الدولة" value={country} icon={<MapPin className="h-4 w-4 text-[#f97316]" />} />
                <Row label="المحافظة" value={governorate} icon={<MapPin className="h-4 w-4 text-[#f97316]" />} />
              </div>
            </Section>

            <Section title="معلومات التواصل">
              {phones.length ? (
                <div className="flex flex-wrap gap-2">
                  {phones.map((p, i) => (
                    <span key={i} className="inline-flex items-center rounded-full border border-[#f97316]/20 bg-[#fff7ed] px-3 py-1 text-sm text-slate-800">
                      <Phone className="h-4 w-4 mr-1 text-[#f97316]" /> {p}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">لا توجد أرقام مسجَّلة</p>
              )}
            </Section>

            <Section title="الوظائف المسجَّلة" className="md:col-span-2">
              {jobs.length ? (
                <ul className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 bg-[#f9fafb]">
                  {jobs.map((j, idx) => (
                    <li key={idx} className="p-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-slate-900 font-medium truncate">
                          <Briefcase className="inline h-4 w-4 ml-1 text-[#f97316]" /> {j.job || "—"}
                        </div>
                        <div className="text-xs text-slate-500">المسمّى الوظيفي</div>
                      </div>
                      <span className="shrink-0 rounded-md bg-white px-2 py-1 text-xs text-slate-700 border border-neutral-200">
                        {j.gender || "—"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-600">لا توجد وظائف مسجَّلة.</p>
              )}
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
