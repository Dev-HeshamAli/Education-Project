import { useForm } from "react-hook-form";
import InputField from "../createAdmin/InputField";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState, useRef } from "react";
import * as yup from "yup";
import { Eye, EyeClosed } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { actUpdateAdmin } from "../../../store/admin/updateAdmin/actUpdateAdmin";
import { resetUpdateState } from "../../../store/admin/updateAdmin/updateAdminSlice";
import { fetchAdminById } from "../../../store/admin/getAdminInfo/fetchAdminById";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Alert,
  Button,
  Box,
} from "@mui/material";
import { logout } from "../../../store/auth/authSlice";
import { actDeleteAdmin } from "../../../store/admin/deleteAdmin/actDeleteAdmin";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  secondName: yup.string().required("Second name is required"),
  thirdName: yup.string().required("Third name is required"),
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
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Must contain lowercase letter")
    .matches(/[A-Z]/, "Must contain uppercase letter")
    .matches(/[0-9]/, "Must contain a number")
    .matches(/[^a-zA-Z0-9]/, "Must contain special character")
    .required("Password is required"),
});

const UpdateAdmin = () => {
  const { token, id } = useSelector((state) => state.auth);  
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, success } = useSelector((state) => state.updateAdmin);

  const userData = useSelector((state) => state.adminInfo.userData);
  // const id = JSON.parse(localStorage.getItem("id"));

  const hasLoadedData = useRef(false);
  const isDataLoaded = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = (data) => {
    const payload = { id, ...data };
    dispatch(actUpdateAdmin({ adminData: payload, token }));
  };
  const handelDelete = () => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      dispatch(actDeleteAdmin({ id, token })).unwrap();
      dispatch(logout());
    }
  };

  useEffect(() => {
    if (id && token && !hasLoadedData.current) {
      dispatch(fetchAdminById({ id, token }));
      hasLoadedData.current = true;
    }
  }, [dispatch, id, token]);

  useEffect(() => {
    if (userData && !isDataLoaded.current) {
      reset({
        firstName: userData.firstName || "",
        secondName: userData.secondName || "",
        thirdName: userData.thirdName || "",
        phone: userData.phone || "",
        job: userData.job || "",
        email: userData.email || "",
        password: userData.password || "",
      });
      isDataLoaded.current = true;
    }
  }, [userData, reset]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(resetUpdateState());
        dispatch(fetchAdminById({ id, token }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch, id, token]);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f4f6f8",
        p: 2,
      }}
    >
      <Card
        sx={{ width: "100%", maxWidth: 600, borderRadius: 4, boxShadow: 4 }}
      >
        <CardHeader
          title={
            <Typography variant="h5" fontWeight="bold" align="center">
              Admin Info
            </Typography>
          }
          sx={{
            bgcolor: "#2972b1",
            color: "white",
            borderRadius: "16px 16px 0 0",
            textAlign: "center",
          }}
        />

        <CardContent>
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Updated Successfully
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {!userData && !error && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Loading...
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                label="Email"
                name="email"
                type="email"
                register={register}
                error={errors.email}
              />

              <Box sx={{ position: "relative" }}>
                <InputField
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  register={register}
                  error={errors.password}
                />
                <Button
                  onClick={() => setShowPassword((prev) => !prev)}
                  size="small"
                  sx={{ position: "absolute", top: 35, right: 10 }}
                >
                  {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                </Button>
              </Box>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#2972b1",
                  "&:hover": { bgcolor: "#6f3ce0" },
                }}
                disabled={loading === "pending"}
              >
                {loading === "pending" ? "Please wait..." : "update Admin"}
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={() => handelDelete()}
              >
                Delete Admin
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UpdateAdmin;
