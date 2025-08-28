// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   IconButton,
//   Paper,
//   Dialog,
//   Box,
//   Chip,
// } from "@mui/material";
// import { Edit, Trash2, Plus } from "lucide-react";
// import LecDetails from "./LecDetails";
// import { useState } from "react";
// import CreateDay from "./CreateDay";
// import AddLecToSchedule from "../AddLecToSchedule";
// import { useSelector } from "react-redux";

// // ترتيب أيام الأسبوع للمرجع
// const daysOfWeek = [
//   "السبت",
//   "الأحد",
//   "الاثنين",
//   "الثلاثاء",
//   "الأربعاء",
//   "الخميس",
//   "الجمعة",
// ];

// // الأيام المتاحة للإنشاء
// const availableDays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];

// export default function ScheduleTable({ data = [], academicScheduleId }) {
//   const [lecDetailsOpen, setLecDetailsOpen] = useState(false);
//   const [selectedLecture, setSelectedLecture] = useState(null);
//   const [openAddLec, setopenAddLec] = useState(false);
//   const [openCreateDay, setopenCreateDay] = useState(false);
//   const [scheduleDayesId, setscheduleDayesId] = useState(null);
//   // const [newDay, setNewDay] = useState(null);
//   const [scheduleDayesIdForUpdate, setscheduleDayesIdForUpdate] =
//     useState(null);

//   const { studyLevelId, semesterId } = useSelector(
//     (state) => state.selectionIds
//   );

//   const handleOpenDetails = (lecture) => {
//     console.log(lecture);
//     setSelectedLecture(lecture);
//     setLecDetailsOpen(true);
//   };

//   // استخراج الأيام الموجودة فعلياً في البيانات وترتيبها
//   const getExistingDaysOrdered = () => {
//     // استخراج الأيام الفريدة من البيانات
//     const existingDays = [...new Set(data.map((d) => d.dayName))];

//     // ترتيب الأيام حسب ترتيب أيام الأسبوع
//     return existingDays.sort((a, b) => {
//       return daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b);
//     });
//   };

//   const existingDays = getExistingDaysOrdered();

//   const handleOpenCreateLec = (day) => {
//     // setNewDay(day);

//     // دور على اليوم في الداتا
//     const matchedDay = data.find((d) => d.dayName === day);

//     if (matchedDay) {
//       setscheduleDayesId(matchedDay.id);
//     }
//   };
//   const handleOpenUpdateLec = (day) => {
//     // دور على اليوم في الداتا
//     const matchedDay = data.find((d) => d.dayName === day);

//     if (matchedDay) {
//       setscheduleDayesIdForUpdate(matchedDay.id);
//     }
//   };

//   return (
//     <TableContainer
//       component={Paper}
//       sx={{
//         mt: 3,
//         boxShadow: 4,
//         borderRadius: 3,
//         direction: "rtl",
//       }}
//     >
//       {/* Dialog لعرض تفاصيل المحاضرة */}
//       {lecDetailsOpen && (
//         <Dialog open={lecDetailsOpen} onClose={() => setLecDetailsOpen(false)}>
//           <LecDetails
//             lecture={selectedLecture}
//             scheduleDayesIdForUpdate={scheduleDayesIdForUpdate}
//           />
//         </Dialog>
//       )}

//       {/* Dialog لإنشاء يوم جديد */}
//       {openCreateDay && (
//         <Dialog open={openCreateDay} onClose={() => setopenCreateDay(false)}>
//           <CreateDay
//             academicScheduleId={academicScheduleId}
//             daysOfWeek={availableDays}
//             onClose={() => setopenCreateDay(false)}
//           />
//         </Dialog>
//       )}

//       {openAddLec && (
//         <Dialog
//           open={openAddLec}
//           onClose={() => setopenAddLec(false)}
//           fullWidth
//           maxWidth="md" // sm, md, lg, xl
//           sx={{
//             "& .MuiDialog-paper": {
//               width: "700px", // العرض اللي يناسبك
//               borderRadius: "12px",
//             },
//           }}
//         >
//           <AddLecToSchedule
//             scheduleDayesId={scheduleDayesId}
//             studyLevelId={studyLevelId}
//             semesterId={semesterId}
//             // newDay={newDay}
//             onClose={() => setopenCreateDay(false)}
//           />
//         </Dialog>
//       )}

//       <Table>
//         {/* عنوان الأعمدة */}
//         <TableHead>
//           <TableRow sx={{ bgcolor: "#2972b1" }}>
//             <TableCell
//               align="center"
//               sx={{
//                 fontWeight: "bold",
//                 color: "white",
//                 fontSize: "16px",
//                 width: "15%",
//                 minWidth: "120px",
//               }}
//             >
//               اليوم
//             </TableCell>
//             <TableCell
//               align="center"
//               sx={{
//                 fontWeight: "bold",
//                 color: "white",
//                 fontSize: "16px",
//                 width: "70%",
//               }}
//             >
//               المحاضرات
//             </TableCell>
//             <TableCell
//               align="center"
//               sx={{
//                 fontWeight: "bold",
//                 color: "white",
//                 fontSize: "16px",
//                 width: "15%",
//                 minWidth: "150px",
//               }}
//             >
//               الإجراءات
//             </TableCell>
//           </TableRow>
//         </TableHead>

//         {/* الصفوف = الأيام الموجودة فعلياً في البيانات */}
//         <TableBody>
//           {existingDays.length > 0 ? (
//             existingDays.map((day, rowIndex) => {
//               // نجيب المحاضرات الخاصة باليوم من الداتا
//               const dayLectures = data
//                 .filter((d) => d.dayName === day)
//                 .flatMap((d) => d.lectures);

//               return (
//                 <TableRow key={`${day}-${rowIndex}`} hover>
//                   {/* اليوم */}
//                   <TableCell
//                     align="center"
//                     sx={{
//                       fontWeight: "bold",
//                       bgcolor: "#f5f5f5",
//                       fontSize: "18px",
//                       borderRight: "3px solid #315879",
//                     }}
//                   >
//                     {day}
//                   </TableCell>

//                   {/* المحاضرات */}
//                   <TableCell align="center">
//                     {dayLectures.length > 0 ? (
//                       <Box
//                         sx={{
//                           display: "flex",
//                           flexWrap: "wrap",
//                           gap: 1,
//                           justifyContent: "center",
//                           alignItems: "center",
//                           minHeight: "60px",
//                         }}
//                       >
//                         {dayLectures.map((lecture) => (
//                           <Chip
//                             key={lecture.id}
//                             label={
//                               <Box sx={{ textAlign: "center" }}>
//                                 <Typography
//                                   variant="body2"
//                                   sx={{ fontWeight: "bold", fontSize: "13px" }}
//                                 >
//                                   {lecture.courseName}
//                                 </Typography>
//                                 <Typography
//                                   variant="caption"
//                                   sx={{ fontSize: "11px", opacity: 0.8 }}
//                                 >
//                                   {lecture.startTime.slice(0, 5)} -{" "}
//                                   {lecture.endTime.slice(0, 5)}
//                                 </Typography>
//                               </Box>
//                             }
//                             onClick={() => {
//                               handleOpenDetails(lecture),
//                                 handleOpenUpdateLec(day);
//                             }}
//                             sx={{
//                               bgcolor: lecture.isActive ? "#4caf50" : "#2196f3",
//                               color: "white",
//                               cursor: "pointer",
//                               minWidth: "120px",
//                               height: "auto",
//                               padding: "8px 4px",
//                               "&:hover": {
//                                 bgcolor: lecture.isActive
//                                   ? "#45a049"
//                                   : "#1976d2",
//                                 transform: "scale(1.02)",
//                               },
//                               transition: "all 0.2s ease",
//                             }}
//                           />
//                         ))}
//                       </Box>
//                     ) : (
//                       <Box
//                         sx={{
//                           minHeight: "60px",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <Typography
//                           color="text.secondary"
//                           fontSize="14px"
//                           sx={{ fontStyle: "italic" }}
//                         >
//                           لا توجد محاضرات
//                         </Typography>
//                       </Box>
//                     )}
//                   </TableCell>

//                   {/* الإجراءات */}
//                   <TableCell align="center">
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "center",
//                         gap: 1,
//                         flexWrap: "wrap",
//                       }}
//                     >
//                       <IconButton
//                         color="primary"
//                         title="اضافة محاضرة"
//                         onClick={() => {
//                           handleOpenCreateLec(day), setopenAddLec(true);
//                         }}
//                         sx={{
//                           "&:hover": {
//                             transform: "scale(1.1)",
//                             bgcolor: "rgba(25, 118, 210, 0.1)",
//                           },
//                         }}
//                       >
//                         <Plus size={23} />
//                       </IconButton>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               );
//             })
//           ) : (
//             <TableRow>
//               <TableCell colSpan={3} align="center">
//                 <Box
//                   sx={{
//                     py: 8,
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     gap: 2,
//                   }}
//                 >
//                   <Typography
//                     variant="h6"
//                     color="text.secondary"
//                     sx={{ mb: 2 }}
//                   >
//                     لا توجد أيام في الجدول الأكاديمي
//                   </Typography>
//                   <IconButton
//                     onClick={() => setopenCreateDay(true)}
//                     color="primary"
//                     size="large"
//                     sx={{
//                       bgcolor: "rgba(25, 118, 210, 0.1)",
//                       "&:hover": {
//                         bgcolor: "rgba(25, 118, 210, 0.2)",
//                         transform: "scale(1.1)",
//                       },
//                     }}
//                   >
//                     <Plus size={32} />
//                   </IconButton>
//                   <Typography variant="body2" color="text.secondary">
//                     اضغط لإضافة يوم جديد
//                   </Typography>
//                 </Box>
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }
// --------------------الجدول من غير تغيير لغه + طباعه ---------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Paper,
  Dialog,
  Box,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import { Edit, Trash2, Plus, Printer, Languages } from "lucide-react";
import LecDetails from "./LecDetails";
import { useEffect, useState } from "react";
import CreateDay from "./CreateDay";
import AddLecToSchedule from "../AddLecToSchedule";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudyLevels } from "../../../store/shared/studyLevel/actGetStudyLevels";
import { fetchSemesters } from "../../../store/shared/semesters/actGetSemesters";
import { fetchAcademicYears } from "../../../store/shared/academicYears/actGetAcademicYears";

// ترتيب أيام الأسبوع للمرجع
const daysOfWeek = {
  ar: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
  en: [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ],
};

// الأيام المتاحة للإنشاء
const availableDays = {
  ar: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
};

// ترجمة أيام الأسبوع
const dayTranslations = {
  السبت: "Saturday",
  الأحد: "Sunday",
  الاثنين: "Monday",
  الثلاثاء: "Tuesday",
  الأربعاء: "Wednesday",
  الخميس: "Thursday",
  الجمعة: "Friday",
  Saturday: "السبت",
  Sunday: "الأحد",
  Monday: "الاثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
};

// النصوص المترجمة
const translations = {
  ar: {
    day: "اليوم",
    lectures: "المحاضرات",
    actions: "الإجراءات",
    noLectures: "لا توجد محاضرات",
    noDays: "لا توجد أيام في الجدول الأكاديمي",
    addDay: "اضغط لإضافة يوم جديد",
    addLecture: "اضافة محاضرة",
    print: "طباعة الجدول",
    toggleLanguage: "تبديل اللغة",
  },
  en: {
    day: "Day",
    lectures: "Lectures",
    actions: "Actions",
    noLectures: "No lectures",
    noDays: "No days in the academic schedule",
    addDay: "Click to add a new day",
    addLecture: "Add lecture",
    print: "Print Schedule",
    toggleLanguage: "Toggle Language",
  },
};

export default function ScheduleTable({ data = [], academicScheduleId }) {
  const dispatch = useDispatch();
  const [lecDetailsOpen, setLecDetailsOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [openAddLec, setopenAddLec] = useState(false);
  const [openCreateDay, setopenCreateDay] = useState(false);
  const [scheduleDayesId, setscheduleDayesId] = useState(null);
  const [scheduleDayesIdForUpdate, setscheduleDayesIdForUpdate] =
    useState(null);
  const [isEnglish, setIsEnglish] = useState(false);

  const { studyLevelId, semesterId, academicYearId } = useSelector(
    (state) => state.selectionIds
  );

  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const semesters = useSelector((state) => state.semestersId.list);
  const academicYears = useSelector((state) => state.academicYearsId.list);

  useEffect(() => {
    dispatch(fetchStudyLevels());
    dispatch(fetchSemesters());
    dispatch(fetchAcademicYears());
  }, [dispatch]);

  const currentLang = isEnglish ? "en" : "ar";
  const t = translations[currentLang];

  const handleOpenDetails = (lecture) => {
    console.log(lecture);
    setSelectedLecture(lecture);
    setLecDetailsOpen(true);
  };

  // استخراج الأيام الموجودة فعلياً في البيانات وترتيبها
  const getExistingDaysOrdered = () => {
    // استخراج الأيام الفريدة من البيانات
    const existingDays = [...new Set(data.map((d) => d.dayName))];

    // ترجمة الأيام إذا كانت اللغة إنجليزية
    const translatedDays = existingDays.map((day) =>
      isEnglish ? dayTranslations[day] || day : day
    );

    // ترتيب الأيام حسب ترتيب أيام الأسبوع
    return translatedDays.sort((a, b) => {
      return (
        daysOfWeek[currentLang].indexOf(a) - daysOfWeek[currentLang].indexOf(b)
      );
    });
  };

  const existingDays = getExistingDaysOrdered();

  const handleOpenCreateLec = (day) => {
    // تحويل اليوم إلى العربية إذا كان بالإنجليزية للبحث في البيانات
    const originalDay = isEnglish ? dayTranslations[day] || day : day;

    // دور على اليوم في الداتا
    const matchedDay = data.find((d) => d.dayName === originalDay);

    if (matchedDay) {
      setscheduleDayesId(matchedDay.id);
    }
  };

  const handleOpenUpdateLec = (day) => {
    // تحويل اليوم إلى العربية إذا كان بالإنجليزية للبحث في البيانات
    const originalDay = isEnglish ? dayTranslations[day] || day : day;

    // دور على اليوم في الداتا
    const matchedDay = data.find((d) => d.dayName === originalDay);

    if (matchedDay) {
      setscheduleDayesIdForUpdate(matchedDay.id);
    }
  };

  const handleToggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  const handlePrint = () => {
    const studyLevelName =
      studyLevels.find((s) => s.id === studyLevelId)?.level || studyLevelId;

    const semesterName =
      semesters.find((s) => s.id === semesterId)?.name || semesterId;

    const academicYearName =
      academicYears.find((s) => s.id === academicYearId)?.date ||
      academicYearId;

    const printContent = `
  <!DOCTYPE html>
  <html dir="${isEnglish ? "ltr" : "rtl"}">
    <head>
      <meta charset="utf-8">
      <title>Academic Schedule</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, sans-serif;
          direction: ${isEnglish ? "ltr" : "rtl"};
          margin: 20px;
          background-color: #fff;
          color: #222;
        }
        .schedule-header {
          text-align: center;
          margin-bottom: 25px;
          padding-bottom: 12px;
          border-bottom: 4px solid #000;
          color: #000;
        }
        .schedule-header h1 {
          font-size: 30px;
          margin: 0 0 6px 0;
          font-weight: bold;
        }
        .schedule-meta {
          margin-top: 12px;
          font-size: 15px;
          color: #444;
          display: flex;
          justify-content: center;
          gap: 35px;
          flex-wrap: wrap;
        }
        .schedule-meta span {
          font-weight: bold;
          color: #000;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          border: 2px solid #000;
          margin-top: 15px;
        }
        th {
          background-color: #007acc;
          color: white;
          padding: 12px 10px;
          text-align: center;
          font-weight: bold;
          font-size: 16px;
          border: 1px solid #000;
        }
        td {
          padding: 10px 8px;
          text-align: center;
          border: 1px solid #000;
          vertical-align: top;
          font-size: 14px;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .day-cell {
          background-color: #f1f6fb;
          font-weight: bold;
          font-size: 15px;
          width: 20%;
          color: #000;
        }
        .lecture-cell {
          width: 80%;
        }
        .lectures-wrapper {
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        .lecture-item {
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 8px 12px;
          font-size: 13px;
          min-width: 130px;
          max-width: 170px;
          background-color: #eaf5ff;
          text-align: center;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
        }
        .lecture-name {
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 4px;
          color:  #000;
        }
        .lecture-time {
          font-size: 12px;
          color: #333;
          margin-bottom: 3px;
        }
        .lecture-teacher {
          font-size: 12px;
          color: #555;
          font-style: italic;
        }
        .no-lectures {
          color: #999;
          font-style: italic;
          font-size: 13px;
        }
        @media print {
          body { margin: 10px; }
          .schedule-header { page-break-after: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
      </style>
    </head>
    <body>
      <div class="schedule-header">
        <h1>${isEnglish ? "Academic Schedule" : "الجدول الأكاديمي"}</h1>
        <p>${new Date().toLocaleDateString(isEnglish ? "en-US" : "ar-EG")}</p>
        <div class="schedule-meta">
          <div><span>${
            isEnglish ? "Study Level:" : "المستوى الدراسي:"
          }</span> ${studyLevelName}</div>
          <div><span>${
            isEnglish ? "Semester:" : "الترم:"
          }</span> ${semesterName}</div>
          <div><span>${
            isEnglish ? "Academic Year:" : "العام الأكاديمي:"
          }</span> ${academicYearName}</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>${t.day}</th>
            <th>${t.lectures}</th>
          </tr>
        </thead>
        <tbody>
          ${
            existingDays.length > 0
              ? existingDays
                  .map((day) => {
                    const originalDay = isEnglish
                      ? dayTranslations[day] || day
                      : day;
                    const dayLectures = data
                      .filter((d) => d.dayName === originalDay)
                      .flatMap((d) => d.lectures);

                    return `
              <tr>
                <td class="day-cell">${day}</td>
                <td class="lecture-cell">
                  <div class="lectures-wrapper">
                    ${
                      dayLectures.length > 0
                        ? dayLectures
                            .map(
                              (lecture) => `
                      <div class="lecture-item">
                        <div class="lecture-name">${lecture.courseName}</div>
                        <div class="lecture-time">${lecture.startTime.slice(
                          0,
                          5
                        )} - ${lecture.endTime.slice(0, 5)}</div>
                        <div class="lecture-teacher">${
                          lecture.teacherName ||
                          (isEnglish
                            ? "Teacher not assigned"
                            : "لم يتم تعيين المدرس")
                        }</div>
                      </div>
                    `
                            )
                            .join("")
                        : `<div class="no-lectures">${t.noLectures}</div>`
                    }
                  </div>
                </td>
              </tr>
            `;
                  })
                  .join("")
              : `
            <tr>
              <td colspan="2" class="no-lectures">${t.noDays}</td>
            </tr>
          `
          }
        </tbody>
      </table>
    </body>
  </html>
`;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <>
      {/* أزرار التحكم */}
      <Box sx={{ mb: 2, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          startIcon={<Languages size={20} />}
          onClick={handleToggleLanguage}
          sx={{
            color: "#2972b1",
            borderColor: "#2972b1",
            "&:hover": {
              borderColor: "#1e5a8a",
              backgroundColor: "rgba(41, 114, 177, 0.1)",
            },
          }}
        >
          {t.toggleLanguage}
        </Button>

        <Button
          variant="contained"
          startIcon={<Printer size={20} />}
          onClick={handlePrint}
          sx={{
            backgroundColor: "#2972b1",
            "&:hover": {
              backgroundColor: "#1e5a8a",
            },
          }}
        >
          {t.print}
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          mt: 3,
          boxShadow: 4,
          borderRadius: 3,
          direction: isEnglish ? "ltr" : "rtl",
        }}
      >
        {/* Dialog لعرض تفاصيل المحاضرة */}
        {lecDetailsOpen && (
          <Dialog
            open={lecDetailsOpen}
            onClose={() => setLecDetailsOpen(false)}
          >
            <LecDetails
              lecture={selectedLecture}
              scheduleDayesIdForUpdate={scheduleDayesIdForUpdate}
            />
          </Dialog>
        )}

        {/* Dialog لإنشاء يوم جديد */}
        {openCreateDay && (
          <Dialog open={openCreateDay} onClose={() => setopenCreateDay(false)}>
            <CreateDay
              academicScheduleId={academicScheduleId}
              daysOfWeek={availableDays[currentLang]}
              onClose={() => setopenCreateDay(false)}
            />
          </Dialog>
        )}

        {openAddLec && (
          <Dialog
            open={openAddLec}
            onClose={() => setopenAddLec(false)}
            fullWidth
            maxWidth="md"
            sx={{
              "& .MuiDialog-paper": {
                width: "700px",
                borderRadius: "12px",
              },
            }}
          >
            <AddLecToSchedule
              scheduleDayesId={scheduleDayesId}
              studyLevelId={studyLevelId}
              semesterId={semesterId}
              onClose={() => setopenCreateDay(false)}
            />
          </Dialog>
        )}

        <Table>
          {/* عنوان الأعمدة */}
          <TableHead>
            <TableRow sx={{ bgcolor: "#2972b1" }}>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: "16px",
                  width: "15%",
                  minWidth: "120px",
                }}
              >
                {t.day}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: "16px",
                  width: "70%",
                }}
              >
                {t.lectures}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: "16px",
                  width: "15%",
                  minWidth: "150px",
                }}
              >
                {t.actions}
              </TableCell>
            </TableRow>
          </TableHead>

          {/* الصفوف = الأيام الموجودة فعلياً في البيانات */}
          <TableBody>
            {existingDays.length > 0 ? (
              existingDays.map((day, rowIndex) => {
                // تحويل اليوم إلى العربية إذا كان بالإنجليزية للبحث في البيانات
                const originalDay = isEnglish
                  ? dayTranslations[day] || day
                  : day;

                // نجيب المحاضرات الخاصة باليوم من الداتا
                const dayLectures = data
                  .filter((d) => d.dayName === originalDay)
                  .flatMap((d) => d.lectures);

                return (
                  <TableRow key={`${day}-${rowIndex}`} hover>
                    {/* اليوم */}
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        bgcolor: "#f5f5f5",
                        fontSize: "18px",
                        borderRight: isEnglish ? "none" : "3px solid #315879",
                        borderLeft: isEnglish ? "3px solid #315879" : "none",
                      }}
                    >
                      {day}
                    </TableCell>

                    {/* المحاضرات */}
                    <TableCell align="center">
                      {dayLectures.length > 0 ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "60px",
                          }}
                        >
                          {dayLectures.map((lecture) => (
                            <Chip
                              key={lecture.id}
                              label={
                                <Box sx={{ textAlign: "center" }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: "bold",
                                      fontSize: "13px",
                                    }}
                                  >
                                    {lecture.courseName}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ fontSize: "11px", opacity: 0.8 }}
                                  >
                                    {lecture.startTime.slice(0, 5)} -{" "}
                                    {lecture.endTime.slice(0, 5)}
                                  </Typography>
                                </Box>
                              }
                              onClick={() => {
                                handleOpenDetails(lecture);
                                handleOpenUpdateLec(day);
                              }}
                              sx={{
                                bgcolor: lecture.isActive
                                  ? "#4caf50"
                                  : "#2196f3",
                                color: "white",
                                cursor: "pointer",
                                minWidth: "120px",
                                height: "auto",
                                padding: "8px 4px",
                                "&:hover": {
                                  bgcolor: lecture.isActive
                                    ? "#45a049"
                                    : "#1976d2",
                                  transform: "scale(1.02)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            minHeight: "60px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            color="text.secondary"
                            fontSize="14px"
                            sx={{ fontStyle: "italic" }}
                          >
                            {t.noLectures}
                          </Typography>
                        </Box>
                      )}
                    </TableCell>

                    {/* الإجراءات */}
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <IconButton
                          color="primary"
                          title={t.addLecture}
                          onClick={() => {
                            handleOpenCreateLec(day);
                            setopenAddLec(true);
                          }}
                          sx={{
                            "&:hover": {
                              transform: "scale(1.1)",
                              bgcolor: "rgba(25, 118, 210, 0.1)",
                            },
                          }}
                        >
                          <Plus size={23} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Box
                    sx={{
                      py: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {t.noDays}
                    </Typography>
                    <IconButton
                      onClick={() => setopenCreateDay(true)}
                      color="primary"
                      size="large"
                      sx={{
                        bgcolor: "rgba(25, 118, 210, 0.1)",
                        "&:hover": {
                          bgcolor: "rgba(25, 118, 210, 0.2)",
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <Plus size={32} />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      {t.addDay}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
