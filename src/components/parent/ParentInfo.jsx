// import { useMemo } from "react";
// import { Link } from "react-router-dom";
// import { Mail, Phone, Briefcase, Users, Smartphone } from "lucide-react";

// /* ---------------- small UI helpers ---------------- */
// function Section({ title, children }) {
//   return (
//     <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm h-full">
//       {title && (
//         <h3 className="mb-3 text-lg font-bold text-slate-900 text-center">{title}</h3>
//       )}
//       {children}
//     </section>
//   );
// }

// function Row({ label, value, icon, mono = false }) {
//   const isEmpty = value === undefined || value === null || String(value).trim() === "";
//   return (
//     <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
//       <div className="flex items-center gap-2 text-slate-900">
//         {icon}
//         <span className="font-semibold">{label}</span>
//       </div>
//       <span
//         className={`text-slate-900 truncate ${mono ? "font-mono" : ""} ${
//           isEmpty ? "text-slate-400" : ""
//         }`}
//         title={isEmpty ? "—" : String(value)}
//         dir={mono ? "ltr" : "rtl"}
//       >
//         {isEmpty ? "—" : value}
//       </span>
//     </div>
//   );
// }

// // pick: يختار أول قيمة متاحة من مجموعة مفاتيح محتملة
// const pick = (obj, keys) => {
//   for (const k of keys) {
//     const v = obj?.[k];
//     if (v !== undefined && v !== null && String(v).trim() !== "") return v;
//   }
//   return undefined;
// };

// const genderAr = (g) => {
//   const t = String(g || "").toLowerCase();
//   if (t === "male" || t === "ذكر") return "ذكر";
//   if (t === "female" || t === "أنثى") return "أنثى";
//   return g || "غير محدد";
// };

// export default function ParentInfo({ parent, isLoading = false }) {
//   // ---- تطبيع الحقول ----
//   const fullName =
//     parent?.fullName ||
//     [parent?.firstName, parent?.secondName, parent?.thirdName].filter(Boolean).join(" ") ||
//     parent?.name ||
//     "وليّ الأمر";

//   const email = pick(parent, ["email"]);
//   const whatsApp = parent?.whatsApp_number || parent?.whatsapp || null;

//   const allPhones = Array.isArray(parent?.allPhones ?? parent?.phones)
//     ? (parent?.allPhones ?? parent?.phones)
//     : [];
//   const mainPhone =
//     pick(parent, ["phone", "mobile", "primaryPhone", "mainPhone"]) || allPhones[0] || null;

//   const studentsCount =
//     parent?.students_Count ?? parent?.studentsCount ?? parent?.childrenCount ?? null;

//   const jobs = Array.isArray(parent?.jobs) ? parent.jobs : [];

//   // أحرف الاسم (أفاتار)
//   const initials = useMemo(() => {
//     return (fullName || "؟")
//       .split(" ")
//       .filter(Boolean)
//       .slice(0, 2)
//       .map((s) => s[0])
//       .join("")
//       .toUpperCase();
//   }, [fullName]);

//   // ---- Skeleton مثل الطالب ----
//   if (isLoading) {
//     return (
//       <div className="overflow-hidden rounded-3xl border border-neutral-300 bg-white shadow-[0_14px_40px_-16px_rgba(0,0,0,.2)]">
//         <div className="relative">
//           <div className="h-44 bg-slate-200 animate-pulse" />
//           <div className="px-6">
//             <div className="relative -mt-12 flex items-end gap-4">
//               <div className="h-24 w-24 rounded-full bg-slate-300 animate-pulse ring-4 ring-white" />
//               <div className="pb-2 flex-1">
//                 <div className="h-8 bg-slate-300 rounded w-48 mb-2 animate-pulse" />
//                 <div className="h-6 bg-slate-300 rounded w-64 animate-pulse" />
//               </div>
//               <div className="h-9 w-36 bg-slate-300 rounded-xl animate-pulse ms-auto mb-2" />
//             </div>
//           </div>
//         </div>
//         <div className="px-6 pb-8 pt-5">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div className="h-40 bg-slate-100 rounded-xl animate-pulse" />
//             <div className="h-40 bg-slate-100 rounded-xl animate-pulse" />
//             <div className="md:col-span-2 h-40 bg-slate-100 rounded-xl animate-pulse" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       dir="rtl"
//       className="overflow-hidden rounded-3xl border border-neutral-300 bg-white shadow-[0_14px_40px_-16px_rgba(0,0,0,.2)]"
//     >
//       {/* الغلاف — نفس ستايل الطالب */}
//       <div className="relative">
//         <div className="h-40 bg-slate-800" />
//         <div className="absolute right-0 top-0 w-0 h-0 border-t-[176px] border-orange-400 border-l-[220px] border-l-transparent" />
//         <div className="px-6">
//           <div className="relative -mt-12 flex items-end gap-4">
//             <div className="h-24 w-24 rounded-full bg-white ring-4 ring-white shadow overflow-hidden">
//               <div className="h-full w-full flex items-center justify-center bg-gray-200 text-slate-700 text-3xl font-black rounded-full">
//                 {initials}
//               </div>
//             </div>

//             <div className="pb-4 flex-1 min-w-0">
//               <h2 className="text-3xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,.35)] truncate">
//                 {fullName}
//               </h2>
//               <div className="mt-1 inline-flex items-center gap-2 px-2 py-[2px] rounded text-slate-800 bg-white/95 backdrop-blur-sm">
//                 <Mail className="h-4 w-4 text-[#f97316]" />
//                 <span className="truncate">{email || "—"}</span>
//               </div>
//             </div>

//             <Link
//               to="/parent/edit-profile"
//               className="ms-auto mb-2 inline-flex items-center rounded-xl bg-[#f97316] hover:bg-[#ea580c] px-4 py-2 text-sm text-white"
//             >
//               تعديل الملف الشخصي
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* المحتوى — قسمان فقط */}
//       <div className="px-6 pb-8 pt-5">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* 1) البيانات الأساسية (بدون تاريخ الميلاد/الدولة) */}
//           <Section title="البيانات الأساسية">
//             <div className="divide-y divide-neutral-100">
//               <Row
//                 label="رقم واتساب"
//                 value={whatsApp}
//                 mono
//                 icon={<Smartphone className="h-4 w-4 text-[#f97316]" />}
//               />
//               <Row
//                 label="الهاتف (رئيسي)"
//                 value={mainPhone}
//                 mono
//                 icon={<Phone className="h-4 w-4 text-[#f97316]" />}
//               />
//               <Row
//                 label="عدد الأبناء المسجّلين"
//                 value={studentsCount}
//                 icon={<Users className="h-4 w-4 text-[#f97316]" />}
//               />
//             </div>
//           </Section>

//           {/* 2) مجمّع: معلومات التواصل والوظائف */}
//           <Section title="معلومات التواصل والوظائف">
//             {/* كل أرقام التواصل (chips) */}
//             <div className="mb-4">
//               {allPhones.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {allPhones.map((p, i) => (
//                     <span
//                       key={i}
//                       className="inline-flex items-center gap-1 rounded-full border border-[#f97316]/20 bg-[#fff7ed] px-3 py-1.5 text-sm font-medium text-slate-800"
//                     >
//                       <Phone className="h-3 w-3 text-[#f97316]" />
//                       <span className="font-mono" dir="ltr">
//                         {p}
//                       </span>
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-4">
//                   <Phone className="h-8 w-8 text-slate-300 mx-auto mb-2" />
//                   <p className="text-slate-500 text-sm">لا توجد أرقام مسجَّلة</p>
//                 </div>
//               )}
//             </div>

//             {/* الوظائف (مضغوطة) */}
//             {jobs.length > 0 ? (
//               <div className="grid gap-2">
//                 {jobs.map((job, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-center justify-between gap-3 p-3 rounded-xl border border-neutral-200 bg-gradient-to-r from-[#f9fafb] to-white"
//                   >
//                     <div className="flex items-center gap-3 min-w-0 flex-1">
//                       <div className="p-1.5 rounded-md bg-[#f97316]/10">
//                         <Briefcase className="h-4 w-4 text-[#f97316]" />
//                       </div>
//                       <div className="min-w-0">
//                         <div className="text-slate-900 font-semibold truncate text-sm">
//                           {job?.job || job?.title || "وظيفة غير محددة"}
//                         </div>
//                         <div className="text-xs text-slate-500 mt-0.5">المسمّى الوظيفي</div>
//                       </div>
//                     </div>
//                     <span className="shrink-0 rounded-md bg-white px-2 py-1.5 text-sm font-medium text-slate-700 border border-neutral-200 shadow-sm">
//                       {genderAr(job?.gender)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-6">
//                 <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-2" />
//                 <h4 className="text-sm font-semibold text-slate-700 mb-1">لا توجد وظائف مسجَّلة</h4>
//                 <p className="text-slate-500 text-sm">يمكنك إضافة الوظائف من خلال تعديل الملف الشخصي</p>
//               </div>
//             )}
//           </Section>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Briefcase, Users, Smartphone } from "lucide-react";

/* ---------------- small UI helpers ---------------- */
function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm h-full transition-all duration-300 hover:shadow-md">
      {title && (
        <h3 className="mb-4 text-lg font-bold text-slate-900 text-center sm:text-xl">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

function Row({ label, value, icon, mono = false }) {
  const isEmpty =
    value === undefined || value === null || String(value).trim() === "";
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-b last:border-0">
      <div className="flex items-center gap-2 text-slate-900">
        {icon}
        <span className="font-semibold text-sm sm:text-base">{label}</span>
      </div>
      <span
        className={`text-slate-900 truncate text-sm sm:text-base ${
          mono ? "font-mono" : ""
        } ${isEmpty ? "text-slate-400" : ""}`}
        title={isEmpty ? "—" : String(value)}
        dir={mono ? "ltr" : "rtl"}
      >
        {isEmpty ? "—" : value}
      </span>
    </div>
  );
}

const pick = (obj, keys) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return undefined;
};

const genderAr = (g) => {
  const t = String(g || "").toLowerCase();
  if (t === "male" || t === "ذكر") return "ذكر";
  if (t === "female" || t === "أنثى") return "أنثى";
  return g || "غير محدد";
};

export default function ParentInfo({ parent, isLoading = false }) {
  const fullName =
    parent?.fullName ||
    [parent?.firstName, parent?.secondName, parent?.thirdName]
      .filter(Boolean)
      .join(" ") ||
    parent?.name ||
    "وليّ الأمر";

  const email = pick(parent, ["email"]);
  const whatsApp = parent?.whatsApp_number || parent?.whatsapp || null;

  const allPhones = Array.isArray(parent?.allPhones ?? parent?.phones)
    ? parent?.allPhones ?? parent?.phones
    : [];
  const mainPhone =
    pick(parent, ["phone", "mobile", "primaryPhone", "mainPhone"]) ||
    allPhones[0] ||
    null;

  const studentsCount =
    parent?.students_Count ??
    parent?.studentsCount ??
    parent?.childrenCount ??
    null;

  const jobs = Array.isArray(parent?.jobs) ? parent.jobs : [];

  const initials = useMemo(() => {
    return (fullName || "؟")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0])
      .join("")
      .toUpperCase();
  }, [fullName]);

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-3xl border border-neutral-300 bg-white shadow-md">
        <div className="relative">
          <div className="h-40 sm:h-44 bg-slate-200 animate-pulse" />
          <div className="px-4 sm:px-6">
            <div className="relative -mt-10 sm:-mt-12 flex items-end gap-3 sm:gap-4">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-slate-300 animate-pulse ring-4 ring-white" />
              <div className="flex-1">
                <div className="h-6 sm:h-8 bg-slate-300 rounded w-32 sm:w-48 mb-2 animate-pulse" />
                <div className="h-5 sm:h-6 bg-slate-300 rounded w-48 sm:w-64 animate-pulse" />
              </div>
              <div className="h-8 sm:h-9 w-28 sm:w-36 bg-slate-300 rounded-xl animate-pulse ms-auto mb-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="overflow-hidden rounded-3xl border border-neutral-300 bg-white shadow-[0_14px_40px_-16px_rgba(0,0,0,.2)] transition-all duration-300 hover:shadow-xl"
    >
      {/* رأس الصفحة */}
      <div className="relative">
        <div className="h-36 sm:h-40 bg-slate-800" />
        <div className="absolute right-0 top-0 w-0 h-0 border-t-[160px] sm:border-t-[176px] border-orange-400 border-l-[180px] sm:border-l-[220px] border-l-transparent" />
        <div className="px-4 sm:px-6">
          <div className="relative -mt-10 sm:-mt-12 flex flex-col sm:flex-row sm:items-end sm:gap-4 text-center sm:text-right">
            <div className="mx-auto sm:mx-0 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white ring-4 ring-white shadow overflow-hidden flex items-center justify-center text-2xl sm:text-3xl font-black text-slate-700">
              {initials}
            </div>

            <div className="sm:pb-4 flex-1 min-w-0 mt-3 sm:mt-0">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,.35)] truncate">
                {fullName}
              </h2>
              <div className="mt-1 inline-flex items-center justify-center sm:justify-start gap-2 px-2 py-[2px] rounded text-slate-800 bg-white/95 backdrop-blur-sm text-sm sm:text-base">
                <Mail className="h-4 w-4 text-[#f97316]" />
                <span className="truncate">{email || "—"}</span>
              </div>
            </div>

            <Link
              to="/parent/edit-profile"
              className="mt-4 sm:mt-0 sm:ms-auto inline-flex items-center justify-center rounded-xl bg-[#f97316] hover:bg-[#ea580c] px-4 py-2 text-sm text-white transition"
            >
              تعديل الملف الشخصي
            </Link>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="px-4 sm:px-6 pb-6 sm:pb-8 pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* القسم الأول */}
          <Section title="البيانات الأساسية">
            <div className="divide-y divide-neutral-100">
              <Row
                label="رقم واتساب"
                value={whatsApp}
                mono
                icon={<Smartphone className="h-4 w-4 text-[#f97316]" />}
              />
              <Row
                label="الهاتف (رئيسي)"
                value={mainPhone}
                mono
                icon={<Phone className="h-4 w-4 text-[#f97316]" />}
              />
              <Row
                label="عدد الأبناء المسجّلين"
                value={studentsCount}
                icon={<Users className="h-4 w-4 text-[#f97316]" />}
              />
            </div>
          </Section>

          {/* القسم الثاني */}
          <Section title="معلومات التواصل والوظائف">
            {/* كل أرقام التواصل */}
            <div className="mb-4">
              {allPhones.length > 0 ? (
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {allPhones.map((p, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full border border-[#f97316]/20 bg-[#fff7ed] px-3 py-1.5 text-sm font-medium text-slate-800 transition hover:scale-[1.02]"
                    >
                      <Phone className="h-3 w-3 text-[#f97316]" />
                      <span className="font-mono" dir="ltr">
                        {p}
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Phone className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">
                    لا توجد أرقام مسجَّلة
                  </p>
                </div>
              )}
            </div>

            {/* الوظائف */}
            {jobs.length > 0 ? (
              <div className="grid gap-3">
                {jobs.map((job, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-neutral-200 bg-gradient-to-r from-[#f9fafb] to-white hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="p-1.5 rounded-md bg-[#f97316]/10 shrink-0">
                        <Briefcase className="h-4 w-4 text-[#f97316]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-slate-900 font-semibold truncate text-sm">
                          {job?.job || job?.title || "وظيفة غير محددة"}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          المسمّى الوظيفي
                        </div>
                      </div>
                    </div>
                    <span className="self-end sm:self-auto rounded-md bg-white px-2 py-1.5 text-sm font-medium text-slate-700 border border-neutral-200 shadow-sm">
                      {genderAr(job?.gender)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-slate-700 mb-1">
                  لا توجد وظائف مسجَّلة
                </h4>
                <p className="text-slate-500 text-sm">
                  يمكنك إضافة الوظائف من خلال تعديل الملف الشخصي
                </p>
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
