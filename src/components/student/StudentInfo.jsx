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
  User2,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ---------------- small UI helpers ---------------- */
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

// يختار أول قيمة موجودة من مفاتيح محتملة (case/fallbacks)
const pick = (obj, keys) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return undefined;
};

export default function StudentInfo({ student }) {
  const isLoading = !student;

  // تطبيع الحقول حسب الريسبونس المعروض
  const photo = student?.photo;
  const fullName = student?.fullName ?? "الطالب";
  const email = student?.email ?? "—";
  const phone = pick(student, ["phone_Number", "phone", "mobile"]);
  const birthDate = student?.birthDate;
  const genderRaw = student?.gender;
  const country = student?.country;
  const parentName = student?.parentName;
  const plan = student?.plan;
  const stage = student?.stage;
  const studyLevel = pick(student, ["StudyLevel", "studyLevel"]);
  const schoolClass = pick(student, ["school_class", "school_Class"]);
  const semester = student?.semester;
  const isPayed = !!student?.isPayed;
  const isDisabled = !!student?.isDisabled;

  const lastQualification = student?.last_educational_qualification; // رابط
  const medicalReports = student?.medical_reports; // رابط (قد يكون فارغ)

  // أحرف الاسم (أفاتار)
  const initials = useMemo(() => {
    return (fullName || "؟")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0])
      .join("")
      .toUpperCase();
  }, [fullName]);

  // تاريخ الميلاد بالعربي
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

  // النوع بالعربي
  const genderAr = useMemo(() => {
    if (!genderRaw) return null;
    const g = String(genderRaw).toLowerCase();
    if (g === "male" || g === "ذكر") return "ذكر";
    if (g === "female" || g === "أنثى") return "أنثى";
    return genderRaw;
  }, [genderRaw]);

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

  const disabledBadge = isDisabled ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 text-xs">
      <HeartPulse className="h-4 w-4" />
      حالة خاصة
    </span>
  ) : null;

  return (
    <div
      dir="rtl"
      className="overflow-hidden rounded-3xl border border-neutral-300 bg-white shadow-[0_14px_40px_-16px_rgba(0,0,0,.2)] max-w-6xl mx-auto w-full"
    >
      {/* الغلاف */}
      <div className="relative">
        <div className="h-[250px] sm:h-44 bg-slate-800" />
        <div className="absolute right-0 top-0 w-0 h-0 border-t-[140px] sm:border-t-[176px] border-orange-400 border-l-[180px] sm:border-l-[220px] border-l-transparent" />
        <div className="px-4 sm:px-6">
          <div className="relative -mt-[210px] sm:-mt-[150px] flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
            <div className="h-24 w-24 sm:h-28 sm:w-28 mx-auto sm:mx-0 rounded-full bg-white ring-4 ring-white shadow overflow-hidden">
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

            <div className="pb-5 text-center sm:text-start flex-1 ">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,.35)]">
                {isLoading ? "…" : fullName}
              </h2>
              <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:gap-2 justify-center sm:justify-start">
                <div className="inline-flex items-center justify-center gap-2 px-2 py-[2px] rounded text-slate-200 ">
                  <Mail className="h-4 w-4" />
                  <span className="truncate text-sm">
                    {isLoading ? "…" : email}
                  </span>
                </div>
                {/* <div className="mt-2 sm:mt-0">{disabledBadge}</div> */}
              </div>
            </div>

            <Link
              to="/student/edit-profile"
              className="sm:ms-auto mb-2 inline-flex justify-center sm:justify-end items-center rounded-xl bg-[#f97316] hover:bg-[#ea580c] px-4 py-2 text-sm text-white mx-auto sm:mx-0"
            >
              تعديل الملف الشخصي
            </Link>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="px-4 sm:px-6 pb-8 pt-5">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="h-40 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-40 bg-slate-100 rounded-xl animate-pulse" />
            <div className="md:col-span-2 h-40 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* العمود الأول: البيانات الشخصية */}
            <Section title="البيانات الشخصية">
              <div className="divide-y divide-neutral-100">
                <Row
                  label="ولي الأمر"
                  value={parentName}
                  icon={<User2 className="h-4 w-4 text-[#f97316]" />}
                />
                <Row
                  label="تاريخ الميلاد"
                  value={birthDateAr}
                  icon={<CalendarDays className="h-4 w-4 text-[#f97316]" />}
                />
                <Row
                  label="النوع"
                  value={genderAr}
                  icon={<User2 className="h-4 w-4 text-[#f97316]" />}
                />
                <Row
                  label="الدولة"
                  value={country}
                  icon={<MapPin className="h-4 w-4 text-[#f97316]" />}
                />
                <Row
                  label="الهاتف"
                  value={phone}
                  icon={<Phone className="h-4 w-4 text-[#f97316]" />}
                />
                <Row
                  label="الإيميل"
                  value={email}
                  icon={<Mail className="h-4 w-4 text-[#f97316]" />}
                />
              </div>

              {/* روابط الملفات */}
              <div className="pt-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900">
                    آخر مؤهل دراسي
                  </span>
                  {lastQualification ? (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={lastQualification}
                      className="text-[#f97316] hover:underline text-sm"
                    >
                      فتح الملف
                    </a>
                  ) : (
                    <span className="text-slate-600 text-sm">لا يوجد</span>
                  )}
                </div>
              </div>
            </Section>

            {/* العمود الثاني: المسار الدراسي + الاشتراك */}
            <div className="flex flex-col gap-6">
              <Section title="المسار الدراسي">
                <div className="divide-y divide-neutral-100">
                  <Row
                    label="المرحلة التعليمية"
                    value={stage}
                    icon={<BookOpen className="h-4 w-4 text-[#f97316]" />}
                  />
                  <Row
                    label="المستوى الدراسي"
                    value={studyLevel}
                    icon={<GraduationCap className="h-4 w-4 text-[#f97316]" />}
                  />
                  <Row
                    label="الصف الدراسي"
                    value={schoolClass ?? "غير محدد"}
                    icon={<School className="h-4 w-4 text-[#f97316]" />}
                  />
                  <Row
                    label="الفصل الدراسي"
                    value={semester}
                    icon={<BookOpen className="h-4 w-4 text-[#f97316]" />}
                  />
                </div>
              </Section>

              <Section title="الاشتراك والدفع">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                    <div className="flex items-center gap-2 text-slate-900">
                      <Wallet className="h-4 w-4 text-[#f97316]" />
                      <span className="font-semibold">الخطة</span>
                    </div>
                    <span
                      className="text-slate-900 text-sm"
                      title={plan ?? "—"}
                    >
                      {plan ?? "—"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
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
