import { useEffect, useState } from "react";
import { Calendar, LogOut, User, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { actGetTeacherInfo } from "../../store/shared/teacher/teacherInfo/actGetTeacherInfo";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../store/auth/authSlice";
import { actLogout } from "../../store/auth/logout/actLogout";
import { BsWhatsapp, BsTelephone } from "react-icons/bs";
import { BiMessageSquareDetail } from "react-icons/bi";
import Logo from "../../components/sidbar/Logo";
import { setLoading } from "../../store/LOCAL_DATA/loaderSlice";
import Loader from "../../components/landingPage/Loader";

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
    dispatch(setLoading(true));
    dispatch(
      actLogout({
        data: { userId: userid, refToken: refreshToken },
        token,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(logout());
      }
      dispatch(setLoading(false));
    });
  };

  useEffect(() => {
    dispatch(actGetTeacherInfo({ id: id, token: token }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      dispatch(actGetTeacherInfo({ id: id, token: token }));
    }
  }, [success, navigate, dispatch, id, token]);

  const t = {
    schedule: "الجدول الدراسي",
    logout: "تسجيل الخروج",
    classes: "الفصول الدراسية",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 rtl">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200 py-2">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/home"
              className="flex items-center "
              title="الصفحة الرئيسية"
            >
              <Logo />
              {/* الاسم يظهر بس من sm وطالع */}
              <span className="hidden lg:inline text-xl font-extrabold text-blue-400">
                EDU-SMART.AI
              </span>
            </Link>

            {/* Buttons */}
            {/* <div className="flex items-center "> */}
            {/* Schedule */}

            {isSchedulePage ? (
              <button
                onClick={() => {
                  navigate("/teacher");
                }}
                className="flex items-center space-x-2 rtl:space-x-reverse bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">الملف الشخصي</span>
              </button>
            ) : (
              <button
                onClick={() =>
                  isSchedulePage
                    ? navigate("/teacher")
                    : navigate("/teacher/schedule")
                }
                className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isSchedulePage
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span className="hidden sm:inline">{t.schedule}</span>
              </button>
            )}

            {/* Classes */}
            {isClassPage ? (
              <button
                onClick={() => {
                  navigate("/teacher");
                }}
                className="flex items-center space-x-2 rtl:space-x-reverse bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">الملف الشخصي</span>
              </button>
            ) : (
              <button
                onClick={() =>
                  isClassPage
                    ? navigate("/teacher")
                    : navigate("/teacher/students")
                }
                className={`flex items-center  px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isClassPage
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                <Users className="h-5 w-5" />
                <span className="hidden sm:inline">{t.classes}</span>
              </button>
            )}

            {/* Reports / Contact */}
            {isReportsPage ? (
              <button
                title="الملف الشخصي"
                onClick={() => navigate("/teacher")}
                className="flex items-center  px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">الملف الشخصي</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:from-blue-600 hover:to-indigo-600 transition-colors duration-300"
                >
                  <BiMessageSquareDetail className="h-5 w-5" />
                  <span className="hidden sm:inline">تواصل معنا</span>
                </button>
                {open && (
                  <ul className="absolute left-1 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border">
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
                    <li
                      onClick={() => navigate("/teacher/report")}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 cursor-pointer"
                    >
                      <BiMessageSquareDetail className="inline ml-2 text-red-500" />
                      كتابة شكوى
                    </li>
                  </ul>
                )}
              </div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center  px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
            {/* </div> */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
        <Loader />
      </div>
    </div>
  );
};

export default TeacherPage;
