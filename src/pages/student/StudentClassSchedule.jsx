// -----------------------------------------------------------------------
// النسخة القديمة للصفحة قبل إعادة التصميم
// -----------------------------------------------------------------------

// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { BASE_URL } from "../../api/BASE_URL";

// const AR_DAYS = [
//   "السبت",
//   "الأحد",
//   "الاثنين",
//   "الثلاثاء",
//   "الأربعاء",
//   "الخميس",
//   "الجمعة",
// ];
// const dayIndex = (name) => {
//   const i = AR_DAYS.indexOf(name ?? "");
//   return i === -1 ? 7 : i;
// };

// const fmtTime24 = (t) => {
//   if (!t) return "—";
//   const [h = "00", m = "00"] = String(t).split(":");
//   return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
// };

// const fmtTime12 = (t) => {
//   if (!t) return "—";
//   let [h = "0", m = "00"] = String(t)
//     .split(":")
//     .map((x) => x.padStart(2, "0"));
//   let hh = parseInt(h, 10);
//   const ampm = hh >= 12 ? "PM" : "AM";
//   hh = hh % 12;
//   if (hh === 0) hh = 12;
//   return `${String(hh).padStart(2, "0")}:${m} ${ampm}`;
// };

// const toMinutes = (t) => {
//   if (!t) return -1;
//   const [h = "0", m = "0"] = String(t).split(":");
//   return +h * 60 + +m;
// };

// export default function StudentSchedule() {
//   const token = useSelector((s) => s.auth?.token);
//   const studentId = useSelector((s) => s.auth?.id);

//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");
//   const [schedule, setSchedule] = useState(null);

//   const normalize = (data) => ({
//     name: data?.name ?? data?.scheduleName ?? "—",
//     scheduleTime: data?.scheduleTime ?? null,
//     studyLevel: data?.studyLevel ?? null,
//     semester: data?.semester ?? null,
//     days: Array.isArray(data?.scheduleDayes)
//       ? [...data.scheduleDayes]
//           .sort((a, b) => dayIndex(a.dayName) - dayIndex(b.dayName))
//           .map((d) => ({
//             ...d,
//             lectures: Array.isArray(d.lectures)
//               ? [...d.lectures].sort(
//                   (x, y) => toMinutes(x.startTime) - toMinutes(y.startTime)
//                 )
//               : [],
//           }))
//       : [],
//   });

//   async function fetchSchedule() {
//     if (!studentId) {
//       setErr("تعذّر تحديد الطالب.");
//       setSchedule(null);
//       return;
//     }
//     try {
//       setLoading(true);
//       setErr("");
//       const url = `${BASE_URL}/api/Student/Student-Schedule/${studentId}`;
//       const { data } = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSchedule(normalize(data));
//     } catch (e) {
//       setErr(
//         e?.response?.data?.title ||
//           e?.response?.data?.message ||
//           "حصل خطأ أثناء تحميل الجدول"
//       );
//       setSchedule(null);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchSchedule();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [studentId, token]);

//   // const todayName = AR_DAYS[new Date().getDay()] ?? "";

//   const LinkBadge = ({ active }) => (
//     <span
//       className={[
//         "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold align-middle",
//         active
//           ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//           : "bg-zinc-50 text-zinc-500 border-zinc-200",
//       ].join(" ")}
//     >
//       <svg width="14" height="14" viewBox="0 0 24 24">
//         <path
//           fill="currentColor"
//           d="M3.9 12a5 5 0 0 1 5-5h3v2h-3a3 3 0 1 0 0 6h3v2h-3a5 5 0 0 1-5-5m6-1h4.1a5 5 0 1 1 0 10H11v-2h3.1a3 3 0 1 0 0-6H11z"
//         />
//       </svg>
//       {active ? "مباشر الآن" : "غير نشط"}
//     </span>
//   );

//   const LectureLinkCell = ({ lec }) => {
//     const active = !!lec?.isActive && !!lec?.lectureLink;
//     if (!lec?.lectureLink)
//       return <span className="text-zinc-400">لا يوجد</span>;
//     return (
//       <a
//         href={lec.lectureLink}
//         target="_blank"
//         rel="noopener noreferrer"
//         aria-disabled={!active}
//         className={[
//           "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition",
//           active
//             ? "bg-emerald-600 text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-emerald-300"
//             : "bg-zinc-200 text-zinc-500 cursor-not-allowed pointer-events-none",
//         ].join(" ")}
//         title={active ? "ادخل للمحاضرة الآن" : "الرابط غير متاح حالياً"}
//       >
//         <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
//           <path
//             fill="currentColor"
//             d="M14 3h7v7h-2V6.41l-9.29 9.3l-1.42-1.42l9.3-9.29H14zM5 5h6v2H7v10h10v-4h2v6H5z"
//           />
//         </svg>
//         {active ? "انضم الآن" : "غير متاح"}
//       </a>
//     );
//   };

//   const Skeleton = () => (
//     <div className="space-y-4">
//       <div className="h-28 rounded-2xl bg-zinc-200 animate-pulse" />
//       {[...Array(4)].map((_, i) => (
//         <div key={i} className="h-24 rounded-2xl bg-zinc-100 animate-pulse" />
//       ))}
//     </div>
//   );

//   return (
//     <section
//       dir="rtl"
//       className="min-h-screen bg-zinc-50 py-10 px-4 md:px-8 text-[17px] md:text-[18px] leading-8"
//     >
//       <div className="mx-auto max-w-5xl space-y-8">
//         <div className="flex items-center justify-between">
//           <h1 className="text-[28px] md:text-[32px] font-black text-slate-900">
//             جدول الطالب
//           </h1>
//         </div>

//         {/* بطاقة ميتا */}
//         {schedule && (
//           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//             <div className="flex flex-col gap-2">
//               <h2 className="text-2xl font-extrabold text-slate-900">
//                 {schedule.name}
//               </h2>
//               <div className="flex flex-wrap gap-2">
//                 <span className="rounded-full bg-slate-100 text-slate-800 px-3 py-1 text-sm font-semibold">
//                   المستوى: {schedule.studyLevel ?? "—"}
//                 </span>
//                 <span className="rounded-full bg-slate-100 text-slate-800 px-3 py-1 text-sm font-semibold">
//                   الفصل: {schedule.semester ?? "—"}
//                 </span>
//                 <span className="rounded-full bg-green-800 text-white px-3 py-1 text-sm font-bold">
//                   الفترة: {schedule.scheduleTime ?? "—"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}

//         {loading && <Skeleton />}

//         {!loading && err && (
//           <div className="rounded-2xl border border-rose-300 bg-rose-50 text-rose-800 p-4">
//             {err}
//           </div>
//         )}

//         {!loading && !err && !schedule && (
//           <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center text-zinc-700">
//             لا توجد بيانات لعرضها.
//           </div>
//         )}

//         {!loading && !err && schedule && (
//           <div className="space-y-10">
//             {schedule.days.length > 0 ? (
//               schedule.days.map((day) => (
//                 <section key={day.id} className="space-y-4">
//                   <div className="flex items-center gap-3">
//                     <div className="rounded-xl border border-slate-200 bg-white px-6 py-3 shadow-sm">
//                       <h3 className="m-0 text-[22px] md:text-[26px] font-black text-slate-900 tracking-tight">
//                         {day.dayName}
//                         {day.dayName ===
//                           (AR_DAYS[new Date().getDay()] ?? "") && (
//                           <span className="ml-2 align-middle text-xs rounded-full bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5">
//                             اليوم
//                           </span>
//                         )}
//                       </h3>
//                     </div>
//                     <span className="text-sm text-zinc-600">
//                       {Array.isArray(day.lectures)
//                         ? `${day.lectures.length} محاضرة`
//                         : "0"}
//                     </span>
//                   </div>

//                   {Array.isArray(day.lectures) && day.lectures.length > 0 ? (
//                     <div className="overflow-x-auto rounded-xl border border-zinc-200 shadow-sm">
//                       <table className="w-full text-right border-collapse">
//                         <colgroup>
//                           <col className="w-[33%]" />
//                           <col className="w-[22%]" />
//                           <col className="w-[28%]" />
//                           <col className="w-[20%]" />
//                         </colgroup>

//                         <thead className="bg-slate-900 text-white">
//                           <tr>
//                             <th className="text-[16px] font-extrabold py-3.5 px-4 border-b border-slate-800">
//                               اسم المادة
//                             </th>
//                             <th className="text-[16px] font-extrabold py-3.5 px-4 border-b border-slate-800">
//                               المعلم
//                             </th>
//                             <th className="text-[16px] font-extrabold py-3.5 px-4 border-b border-slate-800">
//                               الوقت{" "}
//                             </th>
//                             <th className="text-[16px] font-extrabold py-3.5 px-4 border-b border-slate-800">
//                               رابط المحاضرة
//                             </th>
//                           </tr>
//                         </thead>

//                         <tbody className="text-[15px]">
//                           {day.lectures.map((lec, idx) => {
//                             const active =
//                               !!lec?.isActive && !!lec?.lectureLink;
//                             const start12 = fmtTime12(lec.startTime);
//                             const end12 = fmtTime12(lec.endTime);
//                             const start24 = fmtTime24(lec.startTime);
//                             const end24 = fmtTime24(lec.endTime);

//                             return (
//                               <tr
//                                 key={lec.id || idx}
//                                 className={[
//                                   idx % 2 === 0 ? "bg-white" : "bg-zinc-50",
//                                   "hover:bg-amber-50 transition-colors",
//                                 ].join(" ")}
//                               >
//                                 <td className="py-3.5 px-4 text-zinc-900 border-t border-zinc-200 font-medium">
//                                   <div className="flex items-center gap-2 flex-wrap">
//                                     <span>{lec.courseName ?? "—"}</span>
//                                     <LinkBadge active={active} />
//                                   </div>
//                                 </td>

//                                 <td className="py-3.5 px-4 text-zinc-800 border-t border-zinc-200">
//                                   {lec.teacherName ?? "—"}
//                                 </td>

//                                 {/* الوقت بصيغة: من ... إلى ... + title بصيغة 24h */}
//                                 <td
//                                   className="py-3.5 px-4 text-zinc-800 border-t border-zinc-200"
//                                   title={`${start24} — ${end24} (24h)`}
//                                 >
//                                   <div className="flex flex-wrap items-center gap-2">
//                                     <span className="text-xs text-slate-500">
//                                       من
//                                     </span>
//                                     <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-bold">
//                                       {start12}
//                                     </span>
//                                     <span className="text-xs text-slate-500">
//                                       إلى
//                                     </span>
//                                     <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-bold">
//                                       {end12}
//                                     </span>
//                                   </div>
//                                 </td>

//                                 <td className="py-3.5 px-4 text-zinc-800 border-t border-zinc-200">
//                                   <LectureLinkCell lec={lec} />
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="text-zinc-700 bg-white border border-zinc-200 p-6 text-center rounded-xl">
//                       لا توجد محاضرات في هذا اليوم.
//                     </div>
//                   )}
//                 </section>
//               ))
//             ) : (
//               <div className="text-zinc-700 text-center bg-white border border-zinc-200 p-6 rounded-xl">
//                 لا توجد أيام مجدولة.
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// -----------------------------------------------------------------------
// النسخة الجديده للصفحة بعد إعادة التصميم
// -----------------------------------------------------------------------

import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../api/BASE_URL";
import Typography from "@mui/material/Typography";

const AR_DAYS = [
  "السبت",
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
];
const dayIndex = (name) => {
  const i = AR_DAYS.indexOf(name ?? "");
  return i === -1 ? 7 : i;
};

const fmtTime12 = (t) => {
  if (!t) return "—";
  let [h = "0", m = "00"] = String(t)
    .split(":")
    .map((x) => x.padStart(2, "0"));
  let hh = parseInt(h, 10);
  const ampm = hh >= 12 ? "PM" : "AM";
  hh = hh % 12;
  if (hh === 0) hh = 12;
  return `${String(hh).padStart(2, "0")}:${m} ${ampm}`;
};

const toMinutes = (t) => {
  if (!t) return -1;
  const [h = "0", m = "0"] = String(t).split(":");
  return +h * 60 + +m;
};

export default function StudentSchedule() {
  const token = useSelector((s) => s.auth?.token);
  const studentId = useSelector((s) => s.auth?.id);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [schedule, setSchedule] = useState(null);

  const normalize = (data) => ({
    name: data?.name ?? data?.scheduleName ?? "—",
    scheduleTime: data?.scheduleTime ?? null,
    studyLevel: data?.studyLevel ?? null,
    semester: data?.semester ?? null,
    days: Array.isArray(data?.scheduleDayes)
      ? [...data.scheduleDayes]
          .sort((a, b) => dayIndex(a.dayName) - dayIndex(b.dayName))
          .map((d) => ({
            ...d,
            lectures: Array.isArray(d.lectures)
              ? [...d.lectures].sort(
                  (x, y) => toMinutes(x.startTime) - toMinutes(y.startTime)
                )
              : [],
          }))
      : [],
  });

  async function fetchSchedule() {
    if (!studentId) {
      setErr("تعذّر تحديد الطالب.");
      setSchedule(null);
      return;
    }
    try {
      setLoading(true);
      setErr("");
      const url = `${BASE_URL}/api/Student/Student-Schedule/${studentId}`;
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedule(normalize(data));
    } catch (e) {
      setErr(
        e?.response?.data?.title ||
          e?.response?.data?.message ||
          "حصل خطأ أثناء تحميل الجدول"
      );
      setSchedule(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, token]);

  const LectureLinkCell = ({ lec }) => {
    const active = !!lec?.isActive && !!lec?.lectureLink;
    if (!lec?.lectureLink)
      return <span className="text-zinc-400">لا يوجد</span>;
    return (
      <a
        href={lec.lectureLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!active}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition",
          active
            ? "bg-emerald-600 text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            : "bg-zinc-200 text-zinc-500 cursor-not-allowed pointer-events-none",
        ].join(" ")}
        title={active ? "ادخل للمحاضرة الآن" : "الرابط غير متاح حالياً"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
          <path
            fill="currentColor"
            d="M14 3h7v7h-2V6.41l-9.29 9.3l-1.42-1.42l9.3-9.29H14zM5 5h6v2H7v10h10v-4h2v6H5z"
          />
        </svg>
        {active ? "انضم الآن" : "غير متاح"}
      </a>
    );
  };

  const Skeleton = () => (
    <div className="space-y-6">
      {/* Skeleton لبطاقة الميتا */}
      <div className="h-10 bg-zinc-300 rounded-xl animate-pulse" />

      {/* Skeleton لعدة أيام */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-4 ">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="h-28 bg-zinc-200 rounded-xl animate-pulse" />
            <div className="h-28 bg-zinc-200 rounded-xl animate-pulse col-span-5" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-zinc-50 py-4 px-4 md:px-8 text-[17px] md:text-[18px] leading-8"
    >
      <div className="flex items-center gap-3 mb-6 justify-center">
        <Typography
          variant="h4"
          className="!font-black text-slate-900 tracking-tight"
        >
          جدول الطالب
        </Typography>
      </div>

      {loading && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Skeleton />
        </div>
      )}
      {!loading && !err && schedule && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* عرض الهاتف */}
          <div className="block md:hidden">
            {schedule.days.length > 0 ? (
              <div className="space-y-4 p-4">
                {schedule.days.map((day) => {
                  const isToday =
                    day.dayName === (AR_DAYS[new Date().getDay()] ?? "");

                  return (
                    <div
                      key={day.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* عنوان اليوم */}
                      <div
                        className={`text-white text-center py-3 px-4 font-bold text-lg ${
                          isToday ? "bg-[#1a4a66]" : "bg-[#1a4a66]"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {day.dayName}
                          {/* {isToday && <span className="text-xl">⭐</span>} */}
                        </div>
                      </div>

                      {/* المحاضرات */}
                      <div className="p-4">
                        {Array.isArray(day.lectures) &&
                        day.lectures.length > 0 ? (
                          <div className="space-y-3">
                            {day.lectures.map((lec, idx) => {
                              const active =
                                !!lec?.isActive && !!lec?.lectureLink;
                              const start12 = fmtTime12(lec.startTime);
                              const end12 = fmtTime12(lec.endTime);

                              return (
                                <div
                                  key={lec.id || idx}
                                  className={`rounded-lg p-3 w-full shadow-md transition-all duration-200 hover:shadow-lg text-center ${
                                    active
                                      ? "bg-green-500 hover:bg-green-600 text-white"
                                      : "bg-blue-400 hover:bg-blue-500 text-white"
                                  }`}
                                >
                                  <div className="font-bold text-sm mb-2">
                                    {lec.courseName ?? "—"}
                                  </div>

                                  <div className="text-xs opacity-90 mb-1">
                                    المعلم: {lec.teacherName ?? "—"}
                                  </div>

                                  <div className="text-xs opacity-80 mb-2">
                                    {start12} - {end12}
                                  </div>

                                  <LectureLinkCell lec={lec} />
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <span className="text-gray-500 italic text-sm">
                              لا توجد محاضرات
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl text-gray-500">
                  لا توجد أيام في الجدول
                </h3>
              </div>
            )}
          </div>

          {/* عرض الكمبيوتر والتابلت */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-[#1a4a66]">
                  <th className="text-white font-bold text-center py-4 px-6 text-lg w-1/6 min-w-32">
                    اليوم
                  </th>
                  <th className="text-white font-bold text-center py-4 px-6 text-lg w-5/6">
                    المحاضرات
                  </th>
                </tr>
              </thead>

              <tbody>
                {schedule.days.length > 0 ? (
                  schedule.days.map((day) => {
                    const isToday =
                      day.dayName === (AR_DAYS[new Date().getDay()] ?? "");

                    return (
                      <tr
                        key={day.id}
                        className="hover:bg-gray-50 border-b border-gray-200"
                      >
                        {/* عمود اليوم */}
                        <td
                          className={`text-center font-bold text-base lg:text-lg py-6 px-4 border-r-4 ${
                            isToday
                              ? "bg-gray-100 border-r-gray-100"
                              : "bg-gray-100 border-r-gray-100"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {day.dayName}
                            {/* {isToday && <span className="text-xl">⭐</span>} */}
                          </div>
                        </td>

                        {/* عمود المحاضرات */}
                        <td className="text-center py-6 px-4">
                          {Array.isArray(day.lectures) &&
                          day.lectures.length > 0 ? (
                            <div className="flex flex-wrap gap-2 lg:gap-4 justify-center items-center min-h-16">
                              {day.lectures.map((lec, idx) => {
                                const active =
                                  !!lec?.isActive && !!lec?.lectureLink;
                                const start12 = fmtTime12(lec.startTime);
                                const end12 = fmtTime12(lec.endTime);

                                return (
                                  <div
                                    key={lec.id || idx}
                                    className={`rounded-xl p-3 lg:p-4 min-w-40 lg:min-w-52 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg flex-shrink-0 ${
                                      active
                                        ? "bg-green-500 hover:bg-green-600 text-white"
                                        : "bg-blue-400 hover:bg-blue-500 text-white"
                                    }`}
                                  >
                                    <div className="font-bold text-xs lg:text-sm mb-1">
                                      {lec.courseName ?? "—"}
                                    </div>

                                    <div className="text-xs opacity-90 mb-1">
                                      المعلم: {lec.teacherName ?? "—"}
                                    </div>

                                    <div className="text-xs opacity-80 mb-2">
                                      {start12} - {end12}
                                    </div>

                                    <LectureLinkCell lec={lec} />
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="min-h-16 flex items-center justify-center">
                              <span className="text-gray-500 italic text-sm">
                                لا توجد محاضرات
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center py-16">
                      <h3 className="text-xl text-gray-500">
                        لا توجد أيام في الجدول
                      </h3>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
