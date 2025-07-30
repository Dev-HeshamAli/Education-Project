import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),
  password: yup
    .string()
    .min(6, "At least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange", // <-- مهم عشان isValid يشتغل صح
  });

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 to-stone-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-center">
        <h2 className="text-3xl font-bold mb-6 text-blue-600">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold text-blue-700">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-semibold text-blue-700">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            disabled={!isValid}
            className={`w-full font-bold py-2 rounded-lg transition duration-200 ${
              isValid
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Login
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
