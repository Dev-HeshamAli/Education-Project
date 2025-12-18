import { ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../store/auth/authSlice";
import { actLogout } from "../../store/auth/logout/actLogout";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/LOCAL_DATA/loaderSlice";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const menuRef = useRef(null);

  const links = [
    { to: "all-courses", label: "  كل المواد " },
    { to: "current-courses", label: "  مشاهدة الحصص المسجلة " },
    { to: "class-Schedule", label: "  جدول الحصص " },
  ];

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const { userid, token, refreshToken } = useSelector((state) => state.auth);
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

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 bg-slate-800 backdrop-blur border-b border-black/10"
    >
      {/* <div className="h-1 bg-[linear-gradient(90deg,#f97316_0%,#ea580c_100%)]" /> */}
      <nav className="mx-auto max-w-8xl px-3 sm:px-6 lg:px-0">
        <div className="flex items-center justify-between h-20">
          {/* Logo -> يودّي للـ Home */}
          <Link
            to="/home"
            className="flex items-center gap-3"
            title="الصفحة الرئيسية"
          >
            <img
              src="/assets/img/Logoo.png"
              className="h-10 w-auto"
              alt="logo"
            />
            <span className="text-xl font-extrabold text-white">
              Edu-Smart.ai
            </span>
          </Link>

          {/* Links */}
          {/* <ul className="hidden md:flex items-center gap-8 text-[16px] font-semibold text-slate-200">
            {links.map((l) => (
              <li key={l.to} className="group">
                <Link
                  to={l.to}
                  className="inline-block py-2 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
                <span className="block h-[2px] w-0 bg-orange-400 group-hover:w-full transition-all" />
              </li>
            ))}
          </ul> */}
          <ul className="hidden lg:flex items-center gap-3 text-[15px] font-semibold">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-lg font-semibold px-5 py-2 rounded-lg bg-[#fff] text-black hover:bg-gradient-to-r from-orange-100 hover:from-gray-500 hover:to-gray-600 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 border border-slate-600 hover:border-gray-400"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Profile */}
          <div className="flex items-center gap-3">
            {/* <div className="hidden md:block relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1 rounded-full p-1.5 hover:bg-white/10 text-slate-200"
              >
                <UserCircle className="h-8 w-8" />
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {menuOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl border border-neutral-800 bg-[#111827] text-slate-100 shadow-2xl overflow-hidden z-50 flex flex-col">
                  <Link
                    to="student-profile"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full px-4 py-2.5 text-left hover:bg-white/5 text-sm"
                  >
                    الملف الشخصي
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2.5 text-left hover:bg-white/5 text-sm"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div> */}
            <div className="mt-2 flex w-max items-center gap-3 rounded-xl text-slate-100 shadow-2xl overflow-hidden z-50 px-3 py-2">
              <button
                onClick={handleLogout}
                className="text-lg font-semibold px-4 py-1 rounded-lg bg-red-600 hover:bg-red-700 transition hidden lg:block"
              >
                تسجيل الخروج
              </button>
              <button
                className="px-4 py-1 rounded-lg bg-[#fff] text-black hover:bg-gradient-to-r from-orange-100 hover:from-gray-500 hover:to-gray-600 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 border border-slate-600 hover:border-gray-400 hidden lg:flex justify-center "
                onClick={() => {
                  navigate("student-profile");
                }}
              >
                {/* <UserCircle className="h-6 w-6 " /> */}
                <span className="text-lg font-semibold ">الملف الشخصي</span>
              </button>
            </div>

            {/* Mobile menu */}
            <button
              className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-200 hover:bg-white/10"
              onClick={() => setOpen((v) => !v)}
              aria-label="القائمة"
            >
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
                {open ? (
                  <path
                    fillRule="evenodd"
                    d="M6.225 4.811a1 1 0 011.414 0L12 9.172l4.36-4.36a1 1 0 111.415 1.415L13.414 10.6l4.361 4.36a1 1 0 01-1.415 1.415L12 12.017l-4.36 4.36a1 1 0 01-1.415-1.415l4.361-4.36-4.36-4.36a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M3.75 6.75A.75.75 0 014.5 6h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 5.25A.75.75 0 014.5 11h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`lg:hidden origin-top transition-all ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="pt-2 pb-4 border-t border-black/10">
            <ul className="flex flex-col gap-1 text-[16px] font-semibold text-white/90">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block px-2 py-2 rounded-lg hover:bg-white/10 "
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t border-white/10 pt-3 flex flex-col gap-2 px-2">
              <Link
                to="student-profile"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-white/10 hover:bg-white/10 text-sm bg-white"
              >
                <UserCircle className="h-5 w-5" /> الملف الشخصي
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 bg-[#f91616] hover:bg-[#671b06] text-white text-sm"
              >
                <LogOut className="h-5 w-5" /> تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Loader */}
    </header>
  );
}
