import { useEffect, useState } from "react";
import { Calendar, LogOut, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { actGetTeacherInfo } from "../../store/shared/teacher/teacherInfo/actGetTeacherInfo";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../store/auth/authSlice";
import { actLogout } from "../../store/auth/logout/actLogout";
import { BsWhatsapp, BsTelephone } from "react-icons/bs";
import { BiMessageSquareDetail } from "react-icons/bi";

const TeacherPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [location]);

  const isSchedulePage = location.pathname === "/teacher/schedule";
  const isClassPage = location.pathname === "/teacher/students";
  const isReportsPage = location.pathname === "/teacher/report";

  const { id, token, userid, refreshToken } = useSelector(
    (state) => state.auth
  );

  const { success } = useSelector((state) => state.updateTeacher);

  const handleLogout = () => {
    dispatch(
      actLogout({
        data: { userId: userid, refToken: refreshToken },
        token,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(logout());
      }
    });
  };

  useEffect(() => {
    dispatch(actGetTeacherInfo({ id: id, token: token }));
  }, [dispatch, id, token]);

  useEffect(() => {
    if (success) {
      dispatch(actGetTeacherInfo({ id: id, token: token }));
    }
  }, [success, navigate, dispatch, id, token]);

  const t = {
    schedule: "الجدول الدراسي",
    logout: "تسجيل الخروج",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 rtl">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200 py-2">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-xl font-bold text-gray-900">
                  <Link
                    to="/home"
                    className="flex items-center gap-3"
                    title="الصفحة الرئيسية"
                  >
                    <img
                      src="/public/logo.png"
                      className="h-10 w-auto"
                      alt="logo"
                    />
                    <span className="text-xl font-extrabold text-blue-400">
                      EDU-SMART.AI
                    </span>
                  </Link>
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {isSchedulePage ? (
                <button
                  onClick={() => {
                    navigate("/teacher");
                  }}
                  className="flex items-center space-x-2 rtl:space-x-reverse bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <User className="h-4 w-4" />
                  <span>الملف الشخصي</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate("/teacher/schedule");
                  }}
                  className="flex items-center space-x-2 rtl:space-x-reverse bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <Calendar className="h-4 w-4" />
                  <span>الجدول الدراسي</span>
                </button>
              )}
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {isClassPage ? (
                <button
                  onClick={() => {
                    navigate("/teacher");
                  }}
                  className="flex items-center space-x-2 rtl:space-x-reverse bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <User className="h-4 w-4" />
                  <span>الملف الشخصي</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate("/teacher/students");
                  }}
                  className="flex items-center space-x-2 rtl:space-x-reverse bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <span>الفصول الدراسية والطلاب</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {isReportsPage ? (
                <button
                  onClick={() => {
                    navigate("/teacher");
                  }}
                  className="flex items-center space-x-2 rtl:space-x-reverse bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <User className="h-4 w-4" />
                  <span>الملف الشخصي</span>
                </button>
              ) : (
                <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md px-4 py-2 cursor-pointer shadow-md hover:from-blue-600 hover:to-indigo-600 transition-colors duration-300">
                  <button
                    onClick={() => setOpen((v) => !v)}
                    className={`px-1 flex items-center gap-1`}
                  >
                    تواصل معنا
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        open ? "rotate-180" : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {open && (
                    <ul className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border">
                      <li>
                        <a
                          href="https://wa.me/201021355543"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                        >
                          <BsWhatsapp className="inline ml-2 text-green-600" />
                          واتساب: 01021355543
                        </a>
                      </li>
                      <li>
                        <a
                          href="tel:+201031165004"
                          className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                        >
                          <BsTelephone className="inline ml-2 text-blue-600" />
                          اتصال: 01031165004
                        </a>
                      </li>
                      <li>
                        <div
                          onClick={() => {
                            navigate("/teacher/report");
                          }}
                          className="block px-4 py-2 text-lg hover:bg-gray-100 text-gray-700"
                        >
                          <BiMessageSquareDetail className="inline ml-2 text-red-500" />
                          كتابة شكوى
                        </div>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => handleLogout()}
                className="flex items-center space-x-2 rtl:space-x-reverse bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>{t.logout}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default TeacherPage;
