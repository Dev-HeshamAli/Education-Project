import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  Mail,
  Phone,
  User,
  GraduationCap,
  Calendar,
  Users,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Clock,
  BookOpen,
  School,
  Lock,
} from "lucide-react";
import { actGetTeacherInfo } from "../../store/shared/teacher/teacherInfo/actGetTeacherInfo";
import { actGetTeacherSchedule } from "../../store/shared/teacher/teacherSchedule/actGetTeacherSchedule";
import { actGetStudentsInClass } from "../../store/shared/teacher/studentsInClass/actGetStudentsInClass";
import Avatar from "@mui/material/Avatar";

const TeacherProfile = ({ onClose }) => {
  const dispatch = useDispatch();
  const [selectedStudents, setSelectedStudents] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [expandedLevels, setExpandedLevels] = useState({});
  const [expandedSchedule, setExpandedSchedule] = useState({});

  const token = useSelector((state) => state.auth.token);
  const id = localStorage.getItem("2");

  const { list: teacherData, loading } = useSelector(
    (state) => state.teacherInfo
  );
  const { list: teacherSchedule, loading: scheduleLoading } = useSelector(
    (state) => state.teacherSchedule
  );
  const { list: studentInClass, loading: studentLoading } = useSelector(
    (state) => state.studentInClass
  );

  console.log(teacherData);

  useEffect(() => {
    dispatch(actGetTeacherInfo({ id: id, token: token }));
    dispatch(actGetTeacherSchedule({ token: token, id: id }));
    dispatch(actGetStudentsInClass({ id: id, token: token }));
  }, [dispatch, id, token]);

  const handleViewStudents = (students, className) => {
    setSelectedStudents({ students, className });
    setOpenDialog(true);
  };

  const formatTime = (time) => {
    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return time;
    }
  };

  const toggleLevel = (levelIndex) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [levelIndex]: !prev[levelIndex],
    }));
  };

  const toggleSchedule = (dayIndex) => {
    setExpandedSchedule((prev) => ({
      ...prev,
      [dayIndex]: !prev[dayIndex],
    }));
  };

  if (loading || scheduleLoading || studentLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-center text-gray-600">
            جاري تحميل البيانات...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar
                variant="circular"
                src={teacherData?.photo}
                alt="صورة المدرس"
                sx={{ width: "100px", height: "100px" }}
              />
              <div className="w-30 h-30 rounded-full border-4 border-white shadow-lg bg-gray-200 items-center justify-center hidden">
                <User size={60} className="text-gray-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-2">
                {teacherData?.fullName || "اسم المدرس"}
              </h2>
              <h3 className="text-xl opacity-90 mb-4">
                {teacherData?.employer || "مدرس"}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    teacherData?.isActive
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {teacherData?.isActive ? "نشط" : "غير نشط"}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white border border-white border-opacity-30">
                  {teacherData?.gender === "Male" ? "ذكر" : "أنثى"}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white border border-white border-opacity-30">
                  {teacherData?.status === "single" ? "أعزب" : "متزوج"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <User className="text-blue-600" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                    <p className="font-medium text-gray-800">
                      {teacherData?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Lock className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600"> كلمة المرور</p>
                    <p className="font-medium text-gray-800">
                      {teacherData?.password}
                    </p>
                  </div>
                </div>

                {teacherData?.teacherPhones?.map((phone, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Phone className="text-gray-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">
                        الهاتف {index + 1}
                      </p>
                      <p className="font-medium text-gray-800" dir="ltr">
                        {phone}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">تاريخ الميلاد</p>
                    <p className="font-medium text-gray-800">
                      {teacherData?.birthDate
                        ? new Date(teacherData.birthDate).toLocaleDateString(
                            "ar-EG"
                          )
                        : "غير محدد"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">الرقم القومي</p>
                    <p className="font-medium text-gray-800" dir="ltr">
                      {teacherData?.ssn}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <h4 className="font-bold mb-3 text-gray-800">Documents</h4>
                <div className="space-y-2">
                  {teacherData?.cv && (
                    <a
                      href={teacherData.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download size={18} className="text-blue-600" />
                      <span className="text-gray-700">السيرة الذاتية</span>
                    </a>
                  )}
                  {teacherData?.birthCertificate && (
                    <a
                      href={teacherData.birthCertificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download size={18} className="text-blue-600" />
                      <span className="text-gray-700"> شهادة الميلاد</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Classes and Courses */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <GraduationCap className="text-blue-600" />
                Class and Courses
              </h3>

              <div className="space-y-3">
                {studentInClass?.map((level, levelIndex) => (
                  <div
                    key={levelIndex}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleLevel(levelIndex)}
                      className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="text-blue-600" size={20} />
                        <span className="font-semibold text-gray-800">
                          Stady Level : {level.studyLevel}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {level.classes?.length || 0} Class
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {level.courses?.length || 0} Course
                        </span>
                      </div>
                      {expandedLevels[levelIndex] ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>

                    {expandedLevels[levelIndex] && (
                      <div className="p-4 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Classes */}
                          <div>
                            <h5 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                              <School size={18} className="text-green-600" />
                              Classes
                            </h5>
                            {level.classes?.length > 0 ? (
                              <div className="space-y-2">
                                {level.classes.map((classItem, classIndex) => (
                                  <div
                                    key={classIndex}
                                    className="border border-gray-200 rounded-lg p-3"
                                  >
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <p className="font-medium text-gray-800">
                                          {classItem.className}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          {classItem.students?.length || 0} طالب
                                        </p>
                                      </div>
                                      <button
                                        onClick={() =>
                                          handleViewStudents(
                                            classItem.students,
                                            classItem.className
                                          )
                                        }
                                        disabled={!classItem.students?.length}
                                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                      >
                                        <Eye size={14} />
                                        عرض الطلاب
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic text-sm">
                                لا توجد فصول مسجلة
                              </p>
                            )}
                          </div>

                          {/* Courses */}
                          <div>
                            <h5 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                              <BookOpen size={18} className="text-orange-600" />
                              Courses
                            </h5>
                            {level.courses?.length > 0 ? (
                              <div className="space-y-2">
                                {level.courses.map((course, courseIndex) => (
                                  <div
                                    key={courseIndex}
                                    className="border border-gray-200 rounded-lg p-3"
                                  >
                                    <p className="font-medium text-gray-800">
                                      {course.courseName}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic text-sm">
                                لا توجد مواد مسجلة
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <Clock className="text-blue-600" />
                الجدول الأسبوعي
              </h3>

              <div className="space-y-3">
                {teacherSchedule?.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleSchedule(dayIndex)}
                      className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="text-blue-600" size={20} />
                        <span className="font-semibold text-gray-800">
                          {day.dayName}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {day.lectures?.length || 0} محاضرة
                        </span>
                      </div>
                      {expandedSchedule[dayIndex] ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>

                    {expandedSchedule[dayIndex] && (
                      <div className="p-4 bg-white">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-200 text-center">
                                <th className=" p-3 font-semibold text-gray-700">
                                  المادة
                                </th>
                                <th className=" p-3 font-semibold text-gray-700">
                                  المرحلة
                                </th>
                                <th className=" p-3 font-semibold text-gray-700">
                                  البداية
                                </th>
                                <th className=" p-3 font-semibold text-gray-700">
                                  النهاية
                                </th>
                                <th className=" p-3 font-semibold text-gray-700">
                                  المدة
                                </th>
                                <th className=" p-3 font-semibold text-gray-700">
                                  الحالة
                                </th>
                                <th className="text-left p-3 font-semibold text-gray-700">
                                  الرابط
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {day.lectures?.length > 0 ? (
                                day.lectures.map((lecture, lectureIndex) => (
                                  <tr
                                    key={lectureIndex}
                                    className=" text-center border-b border-gray-100 hover:bg-gray-50"
                                  >
                                    <td className="p-3 font-medium text-gray-800">
                                      {lecture.courseName}
                                    </td>
                                    <td className="p-3 text-gray-700">
                                      {lecture.studyLevel}
                                    </td>
                                    <td className="p-3 text-gray-700" dir="ltr">
                                      {formatTime(lecture.startTime)}
                                    </td>
                                    <td className="p-3 text-gray-700" dir="ltr">
                                      {formatTime(lecture.endTime)}
                                    </td>
                                    <td className="p-3 text-gray-700" dir="ltr">
                                      {lecture.duration}
                                    </td>
                                    <td className="p-3">
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          lecture.isActive
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {lecture.isActive ? "نشط" : "غير نشط"}
                                      </span>
                                    </td>
                                    <td className="p-3">
                                      {lecture.lectureLink && (
                                        <a
                                          href={lecture.lectureLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-xs w-fit"
                                        >
                                          <Eye size={12} />
                                          الرابط
                                        </a>
                                      )}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan={7}
                                    className="text-center text-gray-500 py-8"
                                  >
                                    لا توجد محاضرات في هذا اليوم
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Students Dialog */}
        {openDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                    <Users className="text-blue-600" />
                     Students in {selectedStudents?.className}
                  </h3>
                  <button
                    onClick={() => setOpenDialog(false)}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedStudents?.students?.length > 0 ? (
                    selectedStudents.students.map((student, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                          {student.studentName.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">
                          {student.studentName}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      لا توجد طلاب في هذا الفصل
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setOpenDialog(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;