// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import ParentInfo from "../../components/parent/ParentInfo";
// import ChildCard from "../../components/parent/ChildCard";
// import { BASE_URL } from "../../api/BASE_URL";
// import { Link } from "react-router-dom";

// export default function ParentProfile() {
//   const token = useSelector((s) => s.auth.token);
//   const { id } = useSelector((s) => s.auth);
//   const [profile, setProfile] = useState(null);
//   const [childrenData, setChildrenData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(`${BASE_URL}/api/Parent/profile/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setProfile(data);
//         setChildrenData(data?.children || []);

//       } catch (err) {

//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id && token) {
//       fetchProfile();
//     }
//   }, [id, token]);

//   return (
//     <div className="min-h-screen bg-[#f3f4f6]">
//       <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8 py-10">
//         {/* كارت معلومات وليّ الأمر */}
//         <ParentInfo parent={profile} isLoading={loading} />

//         {/* قسم الأبناء */}
//         <section dir="rtl" className="mt-8">
//           <header className="mb-6 flex items-center justify-between">
//             <h3 className="text-2xl font-extrabold text-slate-900">الأبناء</h3>
//             <span className="text-sm text-slate-600">
//               {childrenData.length > 0 ? `${childrenData.length} طالب` : ""}
//             </span>
//           </header>

//           {loading ? (
//             // Loading state للأبناء
//             <div className="grid grid-cols-12 gap-5">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3">
//                   <div className="h-80 bg-white rounded-2xl border border-neutral-200 animate-pulse">
//                     <div className="bg-slate-200 h-36 rounded-t-2xl"></div>
//                     <div className="p-4 space-y-3">
//                       <div className="h-4 bg-slate-200 rounded w-3/4"></div>
//                       <div className="h-3 bg-slate-200 rounded w-1/2"></div>
//                       <div className="space-y-2 mt-4">
//                         <div className="h-10 bg-slate-200 rounded-lg"></div>
//                         <div className="h-10 bg-slate-200 rounded-lg"></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : childrenData?.length > 0 ? (
//             <div className="grid grid-cols-12 gap-5">
//               {childrenData.map((child) => (
//                 <ChildCard key={child.id} child={child} />
//               ))}
//             </div>
//           ) : (
//             <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
//               <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
//                 <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//               </div>
//               <h4 className="text-lg font-semibold text-slate-900 mb-2">لا يوجد أبناء مسجلون</h4>
//               <p className="text-slate-600 mb-4">لم يتم تسجيل أي أبناء في حسابك حتى الآن</p>
//               <Link to="create-child" className="inline-flex items-center px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-sm font-semibold transition-colors">
//                 إضافة طالب جديد
//               </Link>
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }

import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ParentInfo from "../../components/parent/ParentInfo";
import ChildCard from "../../components/parent/ChildCard";
import { BASE_URL } from "../../api/BASE_URL";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { User } from "lucide-react";

export default function ParentProfile() {
  const token = useSelector((s) => s.auth.token);
  const { id } = useSelector((s) => s.auth);
  const [profile, setProfile] = useState(null);
  const [childrenData, setChildrenData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${BASE_URL}/api/Parent/profile/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(data);
        setChildrenData(data?.children || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchProfile();
    }
  }, [id, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* كارت معلومات وليّ الأمر */}
        <div className="flex justify-center mb-6">
          <Tooltip title="عرض بياناتي" arrow>
            <IconButton
              onClick={handleOpen}
              className="!bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 !text-white !shadow-md hover:!shadow-lg transition-all duration-300"
              size="large"
            >
              <User className="w-7 h-7" />
            </IconButton>
          </Tooltip>
        </div>

        {/* 🔹 Dialog بيانات وليّ الأمر */}
        <Dialog open={open} fullWidth maxWidth="md">
          <DialogTitle className="!text-2xl !font-bold !text-orange-500 text-center border-b pb-2 flex justify-space-between items-center gap-2">
            <IconButton
              onClick={handleClose}
              size="small"
              className="!text-red-500 hover:!text-red-600 "
              aria-label="close"
              title="close"
              sx={{ border: "2px solid" }}
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
            <Typography
              variant="h5"
              component="div"
              className="flex-grow"
              sx={{ fontWeight: "bold" }}
            >
              معلومات الحساب
            </Typography>
          </DialogTitle>
          <DialogContent className="!py-6">
            <ParentInfo parent={profile} isLoading={loading} />
          </DialogContent>
        </Dialog>
        {/* قسم الأبناء */}
        <section dir="rtl" className="mt-8 sm:mt-12">
          {/* Header مع زر الإضافة */}
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                أبنائي
              </h3>
              {childrenData.length > 0 && (
                <p className="text-slate-600 mt-2 font-medium">
                  لديك {childrenData.length}{" "}
                  {childrenData.length === 1
                    ? "طالب"
                    : childrenData.length === 2
                    ? "طالبان"
                    : "طلاب"}
                </p>
              )}
            </div>

            {/* زر إضافة طالب - يظهر دائماً في الأعلى */}
            <Link
              to="create-child"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 transform group"
            >
              <svg
                className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>إضافة ابن </span>
            </Link>
          </div>

          {loading ? (
            // Loading state للأبناء
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl opacity-30 blur"></div>
                    <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg">
                      <div className="bg-slate-200 h-40"></div>
                      <div className="p-5 space-y-4">
                        <div className="h-5 bg-slate-200 rounded-lg w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded-lg w-1/2"></div>
                        <div className="space-y-3 pt-3">
                          <div className="h-11 bg-slate-200 rounded-xl"></div>
                          <div className="h-11 bg-slate-200 rounded-xl"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : childrenData?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-6">
              {childrenData.map((child) => (
                <ChildCard key={child.id} child={child} />
              ))}
            </div>
          ) : (
            // Empty state - مصمم بشكل جذاب وواضح
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5">
                <svg
                  className="w-64 h-64 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>

              <div className="relative rounded-3xl border-2 border-dashed border-blue-300 bg-white/80 backdrop-blur-sm p-12 sm:p-16 text-center">
                {/* Icon */}
                <div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-12 h-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>

                {/* Text */}
                <h4 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
                  ابدأ رحلة ابنك التعليمية
                </h4>
                <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                  قم بإضافة أول طالب لك الآن وابدأ في متابعة تقدمه الدراسي
                </p>

                {/* CTA Button */}
                <Link
                  to="create-child"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 transition-all duration-300 hover:scale-105 transform group"
                >
                  <svg
                    className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>إضافة أول طالب</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Link>

                {/* Features */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-right">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 mb-1">
                        متابعة مستمرة
                      </h5>
                      <p className="text-sm text-slate-600">
                        راقب تقدم أبنائك بشكل دوري
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 mb-1">
                        محتوى تعليمي
                      </h5>
                      <p className="text-sm text-slate-600">
                        وصول لمواد دراسية متنوعة
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 mb-1">
                        تقارير مفصلة
                      </h5>
                      <p className="text-sm text-slate-600">
                        احصل على تحليلات شاملة
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
