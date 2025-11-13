import React, { useEffect } from "react";
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
  BookOpen,
  School,
  CreditCard,
  MapPin,
  UserCheck,
  AlertCircle,
  CheckCircle,
  FileText,
  Heart,
} from "lucide-react";
import { actGetStudentInfo } from "../../store/shared/student/studentInfo/actGetStudentInfo";
import { actGetStudentCourses } from "../../store/shared/student/studentCourses/actGetStudentCourses";
import Avatar from "@mui/material/Avatar";

const StudentProfile = ({ onClose }) => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const id = localStorage.getItem("3");

  const { list: studentData, loading } = useSelector(
    (state) => state.studentInfo
  );

  const { list: studentCourses, loading: studentLoading } = useSelector(
    (state) => state.studentCourses
  );

  useEffect(() => {
    dispatch(actGetStudentInfo({ id: id, token: token }));
    dispatch(actGetStudentCourses({ token: token, id: id }));
  }, [dispatch, id, token]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const calculateAge = (birthDate) => {
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        return age - 1;
      }
      return age;
    } catch {
      return "غير محدد";
    }
  };

  if (loading || studentLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-center text-gray-600">
            جاري تحميل البيانات...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
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
                src={studentData?.photo}
                alt="صورة الطالب"
                sx={{ width: "100px", height: "100px" }}
              />
              <div className="w-30 h-30 rounded-full border-4 border-white shadow-lg bg-pink-100 items-center justify-center hidden">
                <User size={60} className="text-pink-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-2">
                {studentData?.fullName || "اسم الطالب"}
              </h2>
              <h3 className="text-xl opacity-90 mb-2">
                {studentData?.stage} - {studentData?.studyLevel}
              </h3>
              <h4 className="text-lg opacity-80 mb-4">
                {studentData?.school_Class} - {studentData?.semester}
              </h4>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    studentData?.isPayed
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {studentData?.isPayed ? "مدفوع الرسوم" : "غير مدفوع الرسوم"}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white border border-white border-opacity-30">
                  {studentData?.gender === "Male" ? "ذكر" : "أنثى"}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white border border-white border-opacity-30">
                  {studentData?.plan}
                </span>
                {studentData?.isDisabled && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-500 text-white">
                    ذوي الاحتياجات الخاصة
                  </span>
                )}
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
                <User className="text-pink-600" />
                المعلومات الشخصية
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                    <p className="font-medium text-gray-800">
                      {studentData?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">رقم الهاتف</p>
                    <p className="font-medium text-gray-800" dir="ltr">
                      {studentData?.phone_Number}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">تاريخ الميلاد</p>
                    <p className="font-medium text-gray-800">
                      {studentData?.birthDate
                        ? formatDate(studentData.birthDate)
                        : "غير محدد"}
                    </p>
                    <p className="text-xs text-gray-500">
                      العمر: {calculateAge(studentData?.birthDate)} سنة
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">البلد</p>
                    <p className="font-medium text-gray-800">
                      {studentData?.country || "غير محدد"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">ولي الأمر</p>
                    <p className="font-medium text-gray-800">
                      {studentData?.parentName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <h4 className="font-bold mb-3 text-gray-800 flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" />
                  المستندات
                </h4>
                <div className="space-y-2">
                  {studentData?.last_educational_qualification && (
                    <a
                      href={studentData.last_educational_qualification}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download size={18} className="text-blue-600" />
                      <span className="text-gray-700">المؤهل التعليمي</span>
                    </a>
                  )}
                  {studentData?.medical_reports && (
                    <a
                      href={studentData.medical_reports}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Heart size={18} className="text-red-600" />
                      <span className="text-gray-700">التقارير الطبية</span>
                    </a>
                  )}
                  {!studentData?.last_educational_qualification &&
                    !studentData?.medical_reports && (
                      <p className="text-gray-500 italic text-sm text-center py-4">
                        لا توجد مستندات متاحة
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <GraduationCap className="text-pink-600" />
                المعلومات الأكاديمية
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                  <div className="flex items-center gap-2 mb-2">
                    <School className="text-pink-600" size={20} />
                    <span className="font-semibold text-gray-800">
                      المرحلة التعليمية
                    </span>
                  </div>
                  <p className="text-lg font-bold text-black-700">
                    {studentData?.stage}
                  </p>
                  <p className="text-sm text-gray-600">
                    {studentData?.studyLevel}
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-blue-600" size={20} />
                    <span className="font-semibold text-gray-800">
                      الفصل الدراسي
                    </span>
                  </div>
                  <p className="text-lg font-bold text-blue-700">
                    {studentData?.school_Class}
                  </p>
                  <p className="text-sm text-gray-600">
                    {studentData?.semester}
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="text-green-600" size={20} />
                    <span className="font-semibold text-gray-800">
                      خطة الدراسة
                    </span>
                  </div>
                  <p className="text-lg font-bold text-green-700">
                    {studentData?.plan}
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="text-yellow-600" size={20} />
                    <span className="font-semibold text-gray-800">
                      حالة الدفع
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {studentData?.isPayed ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <AlertCircle className="text-red-600" size={20} />
                    )}
                    <span
                      className={`font-bold ${
                        studentData?.isPayed ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {studentData?.isPayed ? "مدفوع" : "غير مدفوع"}
                    </span>
                  </div>
                </div>

                {studentData?.isDisabled && (
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="text-orange-600" size={20} />
                      <span className="font-semibold text-gray-800">
                        احتياجات خاصة
                      </span>
                    </div>
                    <p className="text-orange-700 font-medium">
                      طالب من ذوي الاحتياجات الخاصة
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Courses */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <BookOpen className="text-pink-600" />
                المواد الدراسية
              </h3>

              {studentCourses && studentCourses.length > 0 ? (
                <div className="space-y-3">
                  {studentCourses.map((course, index) => (
                    <div
                      key={course.id || index}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-800 text-lg">
                          {course.name}
                        </h4>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <GraduationCap size={16} className="text-gray-400" />
                          <span> {course.studyLevel}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span> {course.semsterName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">
                    لا توجد مواد دراسية مسجلة
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    سيتم عرض المواد المسجلة هنا
                  </p>
                </div>
              )}
            </div>

            {/* Statistics Summary */}
            <div className="lg:col-span-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <GraduationCap className="text-pink-600" />
                ملخص سريع
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-pink-600">
                    {calculateAge(studentData?.birthDate)}
                  </div>
                  <div className="text-sm text-gray-600">العمر (بالسنوات)</div>
                </div>

                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">
                    {studentCourses?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">عدد المواد</div>
                </div>

                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div
                    className={`text-2xl font-bold ${
                      studentData?.isPayed ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {studentData?.isPayed ? "✓" : "✗"}
                  </div>
                  <div className="text-sm text-gray-600">حالة الدفع</div>
                </div>

                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">
                    {studentData?.studyLevel?.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-600">المستوى الدراسي</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;