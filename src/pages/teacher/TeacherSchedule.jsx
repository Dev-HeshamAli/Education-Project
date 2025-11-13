import React, { useEffect, useState } from "react";
import { Languages } from "lucide-react";
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

  // ترتيب الأيام
  const weekOrder = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  // ترتيب البيانات
  const sortedData = [...data].sort(
    (a, b) => weekOrder.indexOf(a.dayName) - weekOrder.indexOf(b.dayName)
  );

  const handleToggleLanguage = () => {
    setIsEnglish(!isEnglish);
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
    <div
      className="p-2 sm:p-4 lg:p-6 bg-gray-50 min-h-screen"
      dir={isEnglish ? "ltr" : "rtl"}
    >
      {/* أزرار التحكم */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-end no-print">
        <button
          onClick={handleToggleLanguage}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base"
        >
          <Languages size={16} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{texts.toggleLanguage}</span>
          <span className="sm:hidden">{isEnglish ? "ع" : "EN"}</span>
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm sm:text-base print:hidden"
        >
          🖨️ {texts.print}
        </button>
      </div>

      {/* الجدول - عرض مختلف للهاتف والكمبيوتر */}
      <div
        className="bg-white rounded-xl shadow-lg overflow-hidden print:block print:w-full print:shadow-none print:rounded-none"
        id="print-table"
      >
        {/* عرض الهاتف */}
        <div className="block md:hidden">
          {sortedData.length > 0 ? (
            <div className="space-y-4 p-4">
              {sortedData.map((dayData, rowIndex) => {
                const displayDay = isEnglish
                  ? dayTranslations[dayData.dayName] || dayData.dayName
                  : dayData.dayName;

                return (
                  <div
                    key={`${dayData.dayName}-${rowIndex}`}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* عنوان اليوم */}
                    <div className="bg-blue-600 text-white text-center py-3 px-4 font-bold text-lg">
                      {displayDay}
                    </div>

                    {/* المحاضرات */}
                    <div className="p-4">
                      {dayData.lectures.length > 0 ? (
                        <div className="space-y-3">
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
                                text-white rounded-lg p-3 w-full shadow-md 
                                transition-all duration-200 hover:shadow-lg cursor-pointer text-center
                              `}
                            >
                              <div className="font-bold text-sm mb-2 ">
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
                        <div className="text-center py-8">
                          <span className="text-gray-500 italic text-sm">
                            {texts.noLectures}
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
              <div className="flex flex-col items-center gap-4">
                <h3 className="text-xl text-gray-500 mb-4">
                  لا توجد أيام في الجدول
                </h3>
              </div>
            </div>
          )}
        </div>

        {/* عرض الكمبيوتر والتابلت */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[800px]">
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
              {sortedData.length > 0 ? (
                sortedData.map((dayData, rowIndex) => {
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
                        className={`text-center font-bold text-base lg:text-lg bg-gray-100 py-6 px-4 ${
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
                          <div className="flex flex-wrap gap-2 lg:gap-4 justify-center items-center min-h-16">
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
                                  text-white rounded-xl p-3 lg:p-4 min-w-40 lg:min-w-52 shadow-md 
                                  transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer
                                  flex-shrink-0
                                `}
                              >
                                <div className="font-bold text-xs lg:text-sm mb-1">
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
                                  {texts.duration}:{" "}
                                  {lecture.duration.slice(0, 5)}
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
      </div>

      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            margin: 16,
            maxHeight: "calc(100% - 32px)",
          },
        }}
      >
        <EditLecture
          selectedLecture={selectedLecture}
          onClose={handleCloseDialog}
        />
      </Dialog>
    </div>
  );
};

export default TeacherSchedule;