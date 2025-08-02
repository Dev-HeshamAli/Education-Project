import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/auth/PostUserData";
import { resetLoginMessages } from "../../store/auth/authSlice";
import { fetchAdminById } from "../../store/admin/getAdminInfo/fetchAdminById";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),
  password: yup.string().required("Password is required").min(8),
});

const Login = () => {
  const admin = JSON.parse(localStorage.getItem("userInfo"));
  const id = admin?.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.auth);
  // console.log(token);

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
    // console.log(data);
    reset();
  };

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
      dispatch(fetchAdminById(id));
    } else if (error) {
      const timer = setTimeout(() => {
        dispatch(resetLoginMessages());
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [token, navigate, error, dispatch, id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 to-stone-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-center">
        <h2 className="text-3xl font-bold mb-6 text-blue-500">Login</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:underline"
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </button>
            </div>
            <p className="text-red-500 text-sm mt-1">
              {errors.password?.message}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading === "pending"}
            className={`w-full font-bold py-2 rounded-lg transition duration-200 ${
              isValid
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading === "pending" ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-700">
          Don’t have an account?
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-semibold"
          >
            Create Account
          </Link>
        </p>
        <p className="mt-4 text-sm text-gray-700">
          Forgot Password?
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline font-semibold"
          >
            Reset Password
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
