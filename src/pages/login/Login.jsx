// src/pages/auth/Login.jsx
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress } from "@mui/material";
import { Eye, EyeClosed } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { fetchAdminById } from "../../store/admin/getAdminInfo/fetchAdminById";
import { loginUser } from "../../store/auth/PostUserData";
import { resetLoginMessages } from "../../store/auth/authSlice";
import Navbar from "../../components/main/Navbar";
import Footer from "../../components/main/Footer";
// ✅ Schema برسائل عربية
const schema = yup.object().shape({
  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "صيغة البريد الإلكتروني غير صحيحة"
    ),
  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .min(8, "يجب ألا تقل كلمة المرور عن 8 أحرف"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error, role, id } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    dispatch(loginUser(data));
    reset();
  };

  useEffect(() => {
    if (token && Array.isArray(role)) {
      if (role.includes("Admin__Role")) {
        navigate("/dashboard", { replace: true });
        // ✅ نفس لوجيك الكود الأصلي
        dispatch(fetchAdminById({ id, token }));
      } else if (role.includes("Student")) {
        navigate("/student", { replace: true });
      } else if (role.includes("Teacher")) {
        navigate("/teacher", { replace: true });
      } else if (role.includes("Parent")) {
        navigate("/parent", { replace: true });
      } else {
        navigate("/");
      }
    } else if (error) {
      const timer = setTimeout(() => {
        dispatch(resetLoginMessages());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [token, navigate, error, dispatch, id, role]);

  return (
    <>
      <Navbar />
      <div dir="rtl" className="pt-20 pb-20 flex items-center justify-center bg-[#f9fafb]">
        <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-2xl text-center border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-[#051441]">تسجيل الدخول</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
              حدث خطأ أثناء تسجيل الدخول: {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-right">
            {/* البريد الإلكتروني */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">البريد الإلكتروني</label>
              <input
                {...register("email")}
                type="email"
                placeholder="ادخل بريدك الإلكتروني"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                autoComplete="email"
              />
              <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">كلمة المرور</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="ادخل كلمة المرور"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-orange-600 hover:underline"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? <EyeClosed /> : <Eye />}
                </button>
              </div>
              <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
            </div>

            {/* زر الدخول */}
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: "#f97316",
                "&:hover": { bgcolor: "#ea580c" },
                fontWeight: "bold",
                fontSize: "16px",
              }}
              fullWidth
              disabled={!isValid || Boolean(loading)}
              startIcon={
                loading && <CircularProgress sx={{ mr: 1 }} size={20} color="inherit" />
              }
            >
              {loading ? "جاري التحميل..." : "تسجيل الدخول"}
            </Button>
          </form>

          {/* روابط */}
          <p className="mt-6 text-sm text-gray-800">
            ليس لديك حساب؟
            <Link to="/register" className="text-orange-600 hover:underline font-semibold ml-1">
              أنشئ حساب الآن
            </Link>
          </p>
          <p className="mt-3 text-sm text-gray-800">
            نسيت كلمة المرور؟
            <Link to="/forgot-password" className="text-orange-600 hover:underline font-semibold ml-1">
              إعادة تعيين
            </Link>
          </p>
        </div>
      </div>
      <Footer/>
       <div className="bg-gray-900 py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-200">
            <p>
              حقوق النشر © 2024 Edu-Smart. جميع الحقوق محفوظة بواسطة{" "}
              <a
                href="https://envytheme.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                EnvyTheme
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
