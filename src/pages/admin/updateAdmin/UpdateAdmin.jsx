import { useForm } from "react-hook-form";
import InputField from "../createAdmin/InputField";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { Eye, EyeClosed } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { actUpdateAdmin } from "../../../store/admin/updateAdmin/actUpdateAdmin";
import { resetUpdateState } from "../../../store/admin/updateAdmin/updateAdminSlice";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  secondName: yup.string().required("Second name is required"),
  thirdName: yup.string(),
  phone: yup
    .string()
    .matches(/^01[0-9]{9}$/, "Invalid phone number")
    .required("Phone is required"),
  job: yup.string().required("Job is required"),
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),
  password: yup
    .string()
    .min(
      8,
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    )
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});

const UpdateAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, success } = useSelector((state) => state.updateAdmin);

  const admin = JSON.parse(localStorage.getItem("userInfo"));
  const id = admin?.id;
  // console.log(id, userData);

  const onSubmit = (data) => {
    const payload = {
      id,
      firstName: data.firstName,
      secondName: data.secondName,
      thirdName: data.thirdName,
      phone: data.phone,
      job: data.job,
      email: data.email,
      password: data.password,
    };
    // console.log(payload);
    dispatch(actUpdateAdmin({ ...payload, id }));
    localStorage.setItem("adminInfo", JSON.stringify(payload));
    reset();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("adminInfo"));

      if (
        userData &&
        typeof userData === "object" &&
        !Array.isArray(userData)
      ) {
        reset(userData);
      }
    } catch (error) {
      console.error("Error parsing adminInfo:", error);
    }
  }, [reset]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(resetUpdateState());
        navigate("/dashboard", { replace: true });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch, navigate]);

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white shadow-xl rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Admin</h2>
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="First Name"
              name="firstName"
              register={register}
              error={errors.firstName}
            />
            <InputField
              label="Second Name"
              name="secondName"
              register={register}
              error={errors.secondName}
            />
            <InputField
              label="Third Name"
              name="thirdName"
              register={register}
              // error={errors.thirdName}
            />
            <InputField
              label="Phone"
              name="phone"
              register={register}
              error={errors.phone}
            />
            <InputField
              label="Job"
              name="job"
              register={register}
              error={errors.job}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
            />
            <div className="relative">
              <InputField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                register={register}
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] text-gray-600"
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading === "pending"}
            className={`w-full py-2 px-4 rounded-md transition duration-300 font-semibold ${
              loading === "pending"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1976d2] hover:bg-[#1e1ca9] text-white"
            } `}
          >
            {loading === "pending" ? "Loading..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAdmin;
