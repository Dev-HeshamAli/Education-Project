import React, { useEffect, useState } from "react";
import { Languages, Printer } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { actGetTeacherSchedule } from "../../store/shared/teacher/teacherSchedule/actGetTeacherSchedule";
import Dialog from "@mui/material/Dialog";
import EditLecture from "./EditLecture";

const TeacherSchedule = () => {
  const dispatch = useDispatch();
  const [isEnglish, setIsEnglish] = useState(false);
  const { token, id } = useSelector((state) => state.auth);
  const { list: data } = useSelector((state) => state.teacherSchedule);
  const [open, setOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const { success } = useSelector((state) => state.activeLecture);
  const { success: endLecSuccess } = useSelector((state) => state.endLec);

  const handleCloseDialog = () => setOpen(false);

  useEffect(() => {
    dispatch(actGetTeacherSchedule({ token, id: id }));
  }, [token, id, dispatch]);

  useEffect(() => {
    if (success || endLecSuccess) {
      dispatch(actGetTeacherSchedule({ token, id: id }));
    }
  }, [success, token, id, dispatch, endLecSuccess]);

  // ترجمة النصوص
  const t = {
    ar: {
      day: "اليوم",
      lectures: "المحاضرات",
      actions: "الإجراءات",
      noLectures: "لا توجد محاضرات",
      toggleLanguage: "English",
      print: "طباعة",
      studyLevel: "المستوى الدراسي",
      courseName: "اسم المقرر",
      duration: "المدة",
    },
    en: {
      day: "Day",
      lectures: "Lectures",
      actions: "Actions",
      noLectures: "No lectures",
      toggleLanguage: "العربية",
      print: "Print",
      studyLevel: "Study Level",
      courseName: "Course Name",
      duration: "Duration",
    },
  };

  const currentLang = isEnglish ? "en" : "ar";
  const texts = t[currentLang];

  // ترجمة أيام الأسبوع
  const dayTranslations = {
    الأحد: "Sunday",
    الاثنين: "Monday",
    الثلاثاء: "Tuesday",
    الأربعاء: "Wednesday",
    الخميس: "Thursday",
    الجمعة: "Friday",
    السبت: "Saturday",
  };

  const handleToggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  const handlePrint = () => {
    window.print();
  };

  // تحويل الوقت من 24 ساعة إلى 12 ساعة
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? "PM" : "AM";
    return `${hour12}:${minutes} ${period}`;
  };

  const handleLectureClick = (lecture) => {
    setSelectedLecture(lecture);
    setOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50" dir={isEnglish ? "ltr" : "rtl"}>
      <style>
        {`
    @media print {
      * {
        color: black !important;
        background: white !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  `}
      </style>

      {/* أزرار التحكم */}
      <div className="mb-6 flex gap-4 justify-end">
        <button
          onClick={handleToggleLanguage}
          className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Languages size={20} />
          {texts.toggleLanguage}
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Printer size={20} />
          {texts.print}
        </button>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          {/* عنوان الأعمدة */}
          <thead>
            <tr className="bg-blue-600">
              <th className="text-white font-bold text-center py-4 px-6 text-lg w-1/6 min-w-32">
                {texts.day}
              </th>
              <th className="text-white font-bold text-center py-4 px-6 text-lg w-5/6">
                {texts.lectures}
              </th>
            </tr>
          </thead>

          {/* محتوى الجدول */}
          <tbody>
            {data.length > 0 ? (
              data.map((dayData, rowIndex) => {
                // ترجمة اليوم حسب اللغة المختارة
                const displayDay = isEnglish
                  ? dayTranslations[dayData.dayName] || dayData.dayName
                  : dayData.dayName;

                return (
                  <tr
                    key={`${dayData.dayName}-${rowIndex}`}
                    className="hover:bg-gray-50 border-b border-gray-200"
                  >
                    {/* عمود اليوم */}
                    <td
                      className={`text-center font-bold text-lg bg-gray-100 py-6 px-4 ${
                        isEnglish
                          ? "border-l-4 border-l-blue-800"
                          : "border-r-4 border-r-blue-800"
                      }`}
                    >
                      {displayDay}
                    </td>

                    {/* عمود المحاضرات */}
                    <td className="text-center py-6 px-4">
                      {dayData.lectures.length > 0 ? (
                        <div className="flex flex-wrap gap-4 justify-center items-center min-h-16">
                          {dayData.lectures.map((lecture) => (
                            <div
                              onClick={() => handleLectureClick(lecture)}
                              key={lecture.id}
                              className={`
                                ${
                                  lecture.isActive
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-blue-400 hover:bg-blue-600"
                                } 
                                text-white rounded-xl p-4 min-w-52 shadow-md 
                                transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer
                              `}
                            >
                              <div className="font-bold text-sm mb-1">
                                {lecture.courseName}
                              </div>

                              <div className="text-xs opacity-90 mb-1">
                                {texts.studyLevel}: {lecture.studyLevel}
                              </div>

                              <div className="text-xs opacity-80 mb-1">
                                {formatTime(lecture.startTime)} -{" "}
                                {formatTime(lecture.endTime)}
                              </div>

                              <div className="text-xs opacity-80">
                                {texts.duration}: {lecture.duration.slice(0, 5)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="min-h-16 flex items-center justify-center">
                          <span className="text-gray-500 italic text-sm">
                            {texts.noLectures}
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
                  <div className="flex flex-col items-center gap-4">
                    <h3 className="text-xl text-gray-500 mb-4">
                      لا توجد أيام في الجدول
                    </h3>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <EditLecture
          selectedLecture={selectedLecture}
          onClose={handleCloseDialog}
        />
      </Dialog>
    </div>
  );
};

export default TeacherSchedule;
