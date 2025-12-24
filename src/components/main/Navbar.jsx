import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { BsWhatsapp, BsTelephone } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { UserCircle, ChevronDown, LogOut } from "lucide-react";
import { logout } from "../../store/auth/authSlice";
import { actLogout } from "../../store/auth/logout/actLogout";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false); // لقائمة "تواصل معنا"
  const [acctOpen, setAcctOpen] = useState(false); // لقائمة الحساب
  const acctRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 👇 حسب ستورك: عدّل الأسماء لو مختلفة
  const { token, role, userid, refreshToken } = useSelector((s) => s.auth);

  // RTL + لغة
  useEffect(() => {
    const html = document.documentElement;
    html.lang = "ar";
    html.dir = "rtl";
    html.classList.add("theme-light");
  }, []);

  // اقفل أي قوائم عند تغيير الروت
  useEffect(() => {
    setMenuOpen(false);
    setOpen(false);
    setAcctOpen(false);
  }, [location]);

  // اقفال قائمة الحساب عند الضغط خارجها
  useEffect(() => {
    function onDoc(e) {
      if (acctRef.current && !acctRef.current.contains(e.target))
        setAcctOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const toggleMenu = () => setMenuOpen((v) => !v);

  const baseLink = "px-1 hover:text-orange-600 transition-colors";
  const activeLink = "text-orange-600 font-semibold";

  const isPricingActive =
    location.pathname === "/home" && location.hash === "#pricing";

  // تحديد مسار الملف الشخصي حسب الدور
  const profilePath =
    role === "parent"
      ? "/parent/parent-profile"
      : role === "student"
      ? "/student/student-profile"
      : "/login"; // fallback

  const goProfile = () => navigate(profilePath);

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
    setAcctOpen(false);
    navigate("/home");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50" dir="rtl">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 h-20">
        {/* Logo */}
        <div className="order-1 flex items-center gap-3">
          <Link to="/home" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Edu-Smart Logo"
              className="h-[100px] w-[85px]"
            />
            <span className="text-xl font-bold text-[#051441]">
              Edu-Smart.ai
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex order-2 items-center gap-6 text-[16px] font-medium text-gray-700">
          <NavLink
            to="/home"
            end
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : ""} hidden xl:inline-block`
            }
          >
            الرئيسية
          </NavLink>

          <NavLink
            to="/vision"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : ""}`
            }
          >
            الرؤية والرسالة
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : ""}`
            }
          >
            إضافة ابن
          </NavLink>

          {/* Pricing مع هاش */}
          <Link
            to="/home#pricing"
            className={`${baseLink} ${isPricingActive ? activeLink : ""}`}
          >
            الرسوم الدراسية
          </Link>

          <NavLink
            to="/teachers"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : ""}`
            }
          >
            اعرف معلمك
          </NavLink>

          {/* تواصل معنا */}
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className={`${baseLink} flex items-center gap-1`}
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
              </ul>
            )}
          </div>
        </nav>

        {/* CTA / Account + Hamburger */}
        <div className="order-3 flex items-center gap-3">
          {/* لو مش لوجين: زر سجل الآن — لو لوجين: أظهار الأفاتار */}
          {!token ? (
            <Link
              to="/login"
              className="hidden lg:inline-block bg-gradient-to-r from-orange-400 to-orange-600 text-white py-3 px-6 rounded-full hover:opacity-90"
            >
              تسجيل الدخول
            </Link>
          ) : (
            <div className="hidden md:block relative" ref={acctRef}>
              <button
                onClick={() => setAcctOpen((v) => !v)}
                className="flex items-center gap-1 rounded-full p-1.5 hover:bg-gray-100 text-gray-700"
              >
                <UserCircle className="h-8 w-8" />
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    acctOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {acctOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl border bg-white text-gray-800 shadow-xl overflow-hidden z-50 flex flex-col">
                  <button
                    onClick={goProfile}
                    className="block w-full px-4 py-2.5 text-right hover:bg-gray-50 text-sm"
                  >
                    الملف الشخصي
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2.5 text-right hover:bg-gray-50 text-sm"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          )}

          {/* زر الموبايل */}
          <button
            onClick={toggleMenu}
            className="lg:hidden focus:outline-none text-gray-700"
          >
            <svg
              className="w-9 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="lg:hidden bg-white px-4 pb-4 pt-2 shadow-md rounded-b-xl flex flex-col gap-3 text-sm font-semibold text-right">
          <NavLink
            to="/home"
            end
            className={({ isActive }) =>
              `text-gray-700 ${
                isActive
                  ? "text-orange-600 font-semibold"
                  : "hover:text-orange-600"
              }`
            }
          >
            الرئيسية
          </NavLink>

          <NavLink
            to="/vision"
            className={({ isActive }) =>
              `text-gray-700 ${
                isActive
                  ? "text-orange-600 font-semibold"
                  : "hover:text-orange-600"
              }`
            }
          >
            الرؤية والرسالة
          </NavLink>

          <Link
            to="/home#pricing"
            className={`text-gray-700 ${
              isPricingActive
                ? "text-orange-600 font-semibold"
                : "hover:text-orange-600"
            }`}
          >
            الرسوم الدراسية
          </Link>

          <NavLink
            to="/teachers"
            className={({ isActive }) =>
              `text-gray-700 ${
                isActive
                  ? "text-orange-600 font-semibold"
                  : "hover:text-orange-600"
              }`
            }
          >
            اعرف معلمك
          </NavLink>

          <NavLink
            to="/register"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : ""}`
            }
          >
            إضافة ابن
          </NavLink>
          {/* تواصل معنا للموبايل */}
          <div className="relative text-right">
            <button
              onClick={() => setOpen((v) => !v)}
              className="text-gray-700 px-1 rounded hover:text-orange-500 focus:outline-none w-full text-right"
            >
              تواصل معنا
            </button>
            {open && (
              <ul className="mt-2 w-full bg-white border rounded-lg shadow-lg z-50 text-right">
                <li>
                  <a
                    href="https://wa.me/201021355543"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    <BsWhatsapp className="inline ml-2" />
                    واتساب: 01021355543
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+201031165004"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    <BsTelephone className="inline ml-2" />
                    اتصال: 01031165004
                  </a>
                </li>
              </ul>
            )}
          </div>

          {/* قسم الحساب للموبايل */}
          <div className="mt-2 pt-2 text-center">
            {!token ? (
              <Link
                to="/login"
                className="bg-orange-600 text-white py-2 px-4 rounded-lg text-center hover:opacity-90"
              >
                تسجيل الدخول
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    goProfile();
                  }}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border hover:bg-gray-50 text-sm justify-end"
                >
                  <UserCircle className="h-5 w-5" /> الملف الشخصي
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 bg-orange-600 hover:opacity-90 text-white text-sm"
                >
                  <LogOut className="h-5 w-5" /> تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
