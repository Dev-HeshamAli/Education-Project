import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import Skeleton from "@mui/material/Skeleton";
import EditTeacher from "./EditTeacher";
import { useState } from "react";
import { useSelector } from "react-redux";
import { User, Edit3, Phone, Briefcase, FileText, Users } from "lucide-react";
const TeacherProfile = () => {
  const { list: teacherData, loading } = useSelector(
    (state) => state.teacherInfo
  );

  // console.log(teacherData, "teacherData");

  const { id } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const t = {
    title: "الملف الشخصي",
    editProfile: "تعديل الملف الشخصي",
    schedule: "الجدول الدراسي",
    personalInfo: "المعلومات الشخصية",
    contactInfo: "معلومات التواصل",
    workInfo: "معلومات العمل",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    birthDate: "تاريخ الميلاد",
    ssn: "الرقم القومي",
    country: "البلد",
    governorate: "المحافظة",
    gender: "الجنس",
    status: "الحالة الاجتماعية",
    phones: "أرقام الهاتف",
    employer: "جهة العمل",
    active: "نشط",
    inactive: "غير نشط",
    quickActions: "بيانات أخرى",
    viewCV: "عرض السيرة الذاتية",
    birthCertificate: "عرض شهادة الميلاد",
    notAvailable: "غير متوفر",
    logout: "تسجيل الخروج",
  };
  return (
    <>
      <div>
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-white via-blue-300 to-blue-500 px-8 py-12">
            {loading ? (
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* صورة المدرس Skeleton */}
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg">
                  <Skeleton variant="circular" width={128} height={128} />
                </div>

                {/* بيانات المدرس Skeleton */}
                <div className="flex-1 space-y-3">
                  <Skeleton variant="text" width={200} height={32} />
                  <Skeleton variant="text" width={150} height={24} />
                  <Skeleton variant="rectangular" width={100} height={28} />
                </div>
              </div>
            ) : (
              <div
                style={{ position: "relative" }}
                className="flex flex-col md:flex-row items-center md:items-center md:justify-start gap-6"
              >
                {/* صورة المدرس */}
                <div className="relative cursor-pointer" onClick={handleOpen}>
                  <img
                    src={teacherData.photo}
                    alt="Teacher Photo"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <div
                    className={`absolute -bottom-2 -right-2 w-8 h-8 ${
                      teacherData.isActive ? "bg-green-500" : "bg-red-500"
                    } rounded-full border-4 border-white flex items-center justify-center`}
                  >
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* بيانات المدرس */}
                <div className="text-right md:text-left">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {teacherData.fullName}
                    <button
                      onClick={handleOpenEdit}
                      style={{
                        color: "white",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        borderRadius: "10px",
                        padding: "10px",
                        cursor: "pointer",
                        marginRight: "15px",
                      }}
                    >
                      <Edit3 className="h-5 w-5" />
                    </button>
                  </h1>
                  <p className="text-indigo-100 text-lg mb-2 text-right">
                    {teacherData.employer}
                  </p>
                  <div className="flex items-center gap-2 justify-start md:justify-start">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        teacherData.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {teacherData.isActive ? t.active : t.inactive}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2 rtl:space-x-reverse mb-4">
                    <User className="h-5 w-5 text-indigo-600" />
                    <span>{t.personalInfo}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem label={t.fullName} value={teacherData.fullName} />
                  <InfoItem label={t.email} value={teacherData.email} />
                  <InfoItem label={t.birthDate} value={teacherData.birthDate} />
                  <InfoItem label={t.ssn} value={teacherData.ssn} />

                  {/* <InfoItem
                    label={t.country}
                    value={teacherData.country || t.notAvailable}
                    icon={<MapPin className="h-4 w-4 text-gray-500" />}
                  /> */}

                  {/* <InfoItem
                    label={t.governorate}
                    value={teacherData.governorate || t.notAvailable}
                    icon={<MapPin className="h-4 w-4 text-gray-500" />}
                  /> */}

                  <InfoItem label={t.gender} value={teacherData.gender} />
                  <InfoItem label={t.status} value={teacherData.status} />
                </div>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 rtl:space-x-reverse mb-4">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span>{t.contactInfo}</span>
                  </h3>
                  <div className="space-y-3">
                    {teacherData.teacherPhones?.map((phone, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 rtl:space-x-reverse bg-white rounded-lg p-3"
                      >
                        <Phone className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-900 font-medium" dir="ltr">
                          {phone}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Information */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 rtl:space-x-reverse mb-4">
                    <Briefcase className="h-5 w-5 text-green-600" />
                    <span>{t.workInfo}</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-600 mb-1">{t.employer}</p>
                      <p className="text-gray-900 font-medium">
                        {teacherData.employer}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {t.quickActions}
                  </h3>
                  <div className="space-y-3">
                    <a
                      href={teacherData.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center space-x-3 rtl:space-x-reverse bg-white hover:bg-gray-50 rounded-lg p-3 transition-colors duration-200"
                    >
                      <FileText className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-900 font-medium">
                        {t.viewCV}
                      </span>
                    </a>

                    <a
                      href={teacherData.birthCertificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center space-x-3 rtl:space-x-reverse bg-white hover:bg-gray-50 rounded-lg p-3 transition-colors duration-200"
                    >
                      <Users className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-900 font-medium">
                        {t.birthCertificate}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Image Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent className="flex justify-center">
          <img
            src={teacherData.photo}
            alt="Teacher Large"
            className="max-w-full max-h-[80vh] rounded-lg object-cover"
          />
        </DialogContent>
      </Dialog>
      {/* Edit Teacher Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="lg">
        <EditTeacher
          teacherData={teacherData}
          onClose={handleCloseEdit}
          id={id}
        />
      </Dialog>
    </>
  );
};

const InfoItem = ({ label, value, icon }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <div className="p-3 bg-gray-50 rounded-lg flex items-center space-x-2 rtl:space-x-reverse">
      {icon}
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  </div>
);

export default TeacherProfile;
