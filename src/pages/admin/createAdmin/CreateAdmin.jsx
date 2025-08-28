import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import adminSchema from "./adminSchema";
import InputField from "./InputField";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createAdmin } from "../../../store/admin/createAdmin/actpostAdminData";
// import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { resetAdminMessages } from "../../../store/admin/createAdmin/createAdminSlice";

const CreateAdmin = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [showPassword, setShowPassword] = useState(false);
  const { successMessage, error, loading } = useSelector(
    (state) => state.admin
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(adminSchema),
    mode: "onBlur",
  });

  const onSubmit = (data) => {
    dispatch(createAdmin({ adminData: data, token }));
    reset();
  };

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(resetAdminMessages());
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white shadow-xl rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Admin</h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center">
            {successMessage}
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
              error={errors.thirdName}
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
              label="SSN"
              name="ssn"
              register={register}
              error={errors.ssn}
            />
            <InputField
              label="Birth Date"
              name="birthDate"
              type="date"
              register={register}
              error={errors.birthDate}
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
                : "bg-[#1976d2] hover:bg-[#15256f] text-white"
            }`}
          >
            {loading === "pending" ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;
