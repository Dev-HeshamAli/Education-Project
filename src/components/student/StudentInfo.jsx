// src/components/student/StudentInfo.jsx
import { useMemo } from "react";
import {
  Mail,
  IdCard,
  MapPin,
  Phone,
  BookOpen,
  HeartPulse,
  GraduationCap,
  School,
  CheckCircle,
  XCircle,
  Wallet,
  CalendarDays,
  User2
} from "lucide-react";
import { Link } from "react-router-dom";

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm h-full">
      {title && (
        <h3 className="mb-3 text-lg font-bold text-slate-900 text-center">
          {title}
        </h3>
      )}
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
      <span
        className={`text-slate-900 truncate ${mono ? "font-mono" : ""}`}
        title={value ?? "—"}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

export default function StudentInfo({ student }) {
  const isLoading = !student;

  const {
    photo,
    fullName = "الطالب",
    email = "—",
    ssn,
    country,
    governorate,
    phone_Number: phone,
    birthDate,
    gender,
    parentName,
    plan,
    stage,
    studyLevel,
    school_Class,
    semester,
    last_educational_qualification: lastQualification, // رابط
    medical_reports: medicalReports, // قد يكون null أو رابط/روابط
    isPayed,
  } = student ?? {};

  const initials = useMemo(
    () =>
      (fullName || "؟")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => s[0])
        .join("")
        .toUpperCase(),
    [fullName]
  );

  const birthDateAr = useMemo(() => {
    if (!birthDate) return null;
    try {
      return new Date(birthDate).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return birthDate;
    }
  }, [birthDate]);

  const genderAr = useMemo(() => {
    if (!gender) return null;
    const g = String(gender).toLowerCase();
    if (g === "male") return "ذكر";
    if (g === "female") return "أنثى";
    return gender;
  }, [gender]);

  const payBadge = (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-sm",
        isPayed
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-red-50 text-red-700 border-red-200",
      ].join(" ")}
      title={isPayed ? "مدفوع" : "غير مدفوع"}
    >
      {isPayed ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <XCircle className="h-4 w-4" />
      )}
      {isPayed ? "مدفوع" : "غير مدفوع"}
    </span>
  );

  return (
    <div
      dir="rtl"
      className="overflow-hidden rounded-3xl border border-neutral-300 bg-white shadow-[0_14px_40px_-16px_rgba(0,0,0,.2)]"
    >
      {/* الغلاف */}
      <div className="relative">
        <div className="h-44 bg-slate-800" />
        <div className="absolute right-0 top-0 w-0 h-0 border-t-[176px] border-orange-400 border-l-[220px] border-l-transparent" />
        <div className="px-6">
          <div className="relative -mt-12 flex items-end gap-4">
            <div className="h-24 w-24 rounded-full bg-white ring-4 ring-white shadow overflow-hidden">
              {photo ? (
                <img
                  src={photo}
                  alt="صورة الطالب"
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-200 text-slate-700 text-3xl font-black">
                  {initials}
                </div>
              )}
            </div>

            <div className="pb-4">
              <h2 className="text-3xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,.35)]">
                {isLoading ? "…" : fullName}
              </h2>
              <div className="mt-1 inline-flex items-center gap-2 bg-white px-2 py-[2px] rounded text-slate-800">
                <Mail className="h-4 w-4" />
                <span className="truncate">{isLoading ? "…" : email}</span>
              </div>
            </div>

            <Link
              to="/student/edit-profile"
              className="ms-auto mb-2 inline-flex items-center rounded-xl bg-[#f97316] hover:bg-[#ea580c] px-4 py-2 text-sm text-white"
            >
              تعديل الملف الشخصي
            </Link>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="px-6 pb-8 pt-5">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="h-40 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-40 bg-slate-100 rounded-xl animate-pulse" />
            <div className="md:col-span-2 h-40 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : (
   

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* العمود الأول: البيانات الشخصية */}
  <Section title="البيانات الشخصية">
    <div className="divide-y divide-neutral-100">
      <Row label="الرقم القومي" value={ssn} mono icon={<IdCard className="h-4 w-4 text-[#f97316]" />} />
      <Row label="تاريخ الميلاد" value={birthDateAr} icon={<CalendarDays className="h-4 w-4 text-[#f97316]" />} />
      <Row label="النوع" value={genderAr} icon={<User2 className="h-4 w-4 text-[#f97316]" />} />
      <Row label="الدولة" value={country} icon={<MapPin className="h-4 w-4 text-[#f97316]" />} />
      <Row label="المحافظة" value={governorate} icon={<MapPin className="h-4 w-4 text-[#f97316]" />} />
      <Row label="ولي الأمر" value={parentName} icon={<User2 className="h-4 w-4 text-[#f97316]" />} />
      <Row label="الهاتف" value={phone} icon={<Phone className="h-4 w-4 text-[#f97316]" />} />
      <Row label="الإيميل" value={email} icon={<Mail className="h-4 w-4 text-[#f97316]" />} />
    </div>
    {/* روابط الملفات */}
        <div className="pt-3">
          <div className="flex items-center justify-between gap-4 py-2">
            <span className="font-semibold text-slate-900">آخر مؤهل دراسي</span>
            {lastQualification ? (
              <a
                target="_blank"
                rel="noreferrer"
                href={lastQualification}
                className="text-[#f97316] hover:underline"
              >
                فتح الملف
              </a>
            ) : (
              <span className="text-slate-600">لا يوجد</span>
            )}
          </div>

          {/*<div className="flex items-center justify-between gap-4 py-2">
            <span className="font-semibold text-slate-900">التقارير الطبية</span>
            {medicalReports ? (
              <a
                target="_blank"
                rel="noreferrer"
                href={medicalReports}
                className="text-[#f97316] hover:underline"
              >
                عرض التقارير
              </a>
            ) : (
              <span className="text-slate-600">لا يوجد</span>
            )}
          </div>*/}
        </div>
  </Section>

  {/* العمود الثاني: المسار الدراسي + الاشتراك والدفع */}
  <div className="flex flex-col gap-6">
    {/* المسار الدراسي */}
    <Section title="المسار الدراسي">
      <div className="divide-y divide-neutral-100">
        <Row label="المرحلة التعليمية" value={stage} icon={<BookOpen className="h-4 w-4 text-[#f97316]" />} />
        <Row label="المستوى الدراسي" value={studyLevel} icon={<GraduationCap className="h-4 w-4 text-[#f97316]" />} />
        <Row label="الصف الدراسي" value={school_Class ?? "غير محدد"} icon={<School className="h-4 w-4 text-[#f97316]" />} />
      </div>
    </Section>

    {/* الاشتراك والدفع */}
    <Section title="الاشتراك والدفع">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4 py-3 border-b">
          <div className="flex items-center gap-2 text-slate-900">
            <Wallet className="h-4 w-4 text-[#f97316]" />
            <span className="font-semibold">الخطة</span>
          </div>
          <span className="text-slate-900" title={plan ?? "—"}>
            {plan ?? "—"}
          </span>
        </div>

        <Row label="الفصل الدراسي" value={semester} icon={<BookOpen className="h-4 w-4 text-[#f97316]" />} />

        <div className="flex items-center justify-between gap-4 py-3 border-b">
          <div className="flex items-center gap-2 text-slate-900">
            <Wallet className="h-4 w-4 text-[#f97316]" />
            <span className="font-semibold">حالة الدفع</span>
          </div>
          {payBadge}
        </div>

        
      </div>
    </Section>
  </div>
</div>
 

        )}
      </div>
    </div>
  );
}
