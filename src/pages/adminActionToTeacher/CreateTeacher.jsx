import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Paper,
  Alert,
  IconButton,
  FormHelperText,
  InputAdornment,
  LinearProgress,
} from "@mui/material";
import { Eye, EyeClosed } from "lucide-react";

import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { actCreateTeacher } from "../../store/createTeacher/actCreateTeacher";
import { useEffect, useState } from "react";
import { resetCreateTeacherState } from "../../store/createTeacher/createTeacherSlice";

const schema = yup.object().shape({
  FirstName: yup.string().required("First name is required"),
  SecondName: yup.string().required("Second name is required"),
  ThirdName: yup.string().required("Third name is required"),
  BirthDate: yup.date().required("Birth date is required"),
  SSN: yup
    .string()
    .matches(/^[0-9]{14}$/, "SSN must be exactly 14 digits")
    .required("SSN is required"),
  Gender: yup.string().required("Gender is required"),
  Email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),
  Password: yup
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
  Status: yup.string().required("Status is required"),
  Employer: yup.string().required("Employer is required"),
  Phones: yup
    .array()
    .of(
      yup.object().shape({
        number: yup
          .string()
          .matches(/^01[0-9]{9}$/, "Invalid phone number")
          .required("Phone number is required"),
      })
    )
    .min(1, "At least one phone number is required"),
  PhotoPath: yup.mixed().required("Photo is required"),
  BirthCertificate: yup.mixed().required("Birth certificate is required"),
  CVPath: yup.mixed().required("CV is required"),
});

const CreateTeacher = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [showPassword, setShowPassword] = useState(false);

  const { loading, success, error } = useSelector(
    (state) => state.createTeacher
  );

  const {
    control,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      FirstName: "",
      SecondName: "",
      ThirdName: "",
      BirthDate: "",
      SSN: "",
      Gender: "",
      Email: "",
      Password: "",
      Status: "",
      Employer: "",
      Phones: [{ number: "" }],
      PhotoPath: null,
      BirthCertificate: null,
      CVPath: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Phones",
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("FirstName", data.FirstName);
    formData.append("SecondName", data.SecondName);
    if (data.ThirdName) formData.append("ThirdName", data.ThirdName);
    formData.append(
      "BirthDate",
      new Date(data.BirthDate).toISOString().split("T")[0]
    );
    formData.append("SSN", data.SSN);
    formData.append("Email", data.Email);
    formData.append("Password", data.Password);
    formData.append("Status", data.Status);
    if (data.Employer) formData.append("Employer", data.Employer);
    formData.append("Gender", data.Gender);

    data.Phones.forEach((phone) => {
      if (phone.number) {
        formData.append("Phones", phone.number);
      }
    });

    if (data.PhotoPath) {
      formData.append("PhotoPath", data.PhotoPath);
    }
    if (data.BirthCertificate) {
      formData.append("BirthCertificate", data.BirthCertificate);
    }
    if (data.CVPath) {
      formData.append("CVPath", data.CVPath);
    }

    dispatch(actCreateTeacher({ data: formData, token }));
    // reset();
  };

  const addPhoneField = () => {
    append({ number: "" });
  };

  const removePhoneField = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  useEffect(() => {
    if (success || error) {
      const timeout = setTimeout(() => {
        dispatch(resetCreateTeacherState());
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [success, dispatch, error]);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ color: "primary.main", fontWeight: 600 }}
        color="primary"
      >
        Create Teacher
      </Typography>

      {loading && (
        <LinearProgress
          sx={{
            mb: 3,
            borderRadius: 100,
            height: 5,
          }}
        />
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {typeof error === "string" ? error : JSON.stringify(error)}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Personal Information Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main", fontWeight: 600, mb: 3 }}
            >
              Personal Information
            </Typography>

            {/* First Name & Second Name in same row */}
            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              <Controller
                name="FirstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    required
                    variant="outlined"
                    error={!!errors.FirstName}
                    helperText={errors.FirstName?.message}
                    sx={{ flex: 1 }}
                  />
                )}
              />

              <Controller
                name="SecondName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Second Name"
                    required
                    variant="outlined"
                    error={!!errors.SecondName}
                    helperText={errors.SecondName?.message}
                    sx={{ flex: 1 }}
                  />
                )}
              />
            </Box>

            {/* Third Name & Birth Date in same row */}
            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              <Controller
                name="ThirdName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Third Name"
                    variant="outlined"
                    error={!!errors.ThirdName}
                    helperText={errors.ThirdName?.message}
                    sx={{ flex: 1 }}
                  />
                )}
              />

              <Controller
                name="BirthDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Birth Date"
                    type="date"
                    required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.BirthDate}
                    helperText={errors.BirthDate?.message}
                    sx={{ flex: 1 }}
                  />
                )}
              />
            </Box>

            {/* SSN & Gender in same row */}
            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              <Controller
                name="SSN"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="SSN"
                    required
                    variant="outlined"
                    error={!!errors.SSN}
                    helperText={errors.SSN?.message}
                    sx={{ flex: 1 }}
                  />
                )}
              />

              <Controller
                name="Gender"
                control={control}
                render={({ field }) => (
                  <FormControl
                    error={!!errors.Gender}
                    variant="outlined"
                    sx={{ flex: 1 }}
                  >
                    <InputLabel>Gender *</InputLabel>
                    <Select {...field} label="Gender *">
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                    <FormHelperText>{errors.Gender?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Box>
          </Box>

          {/* Account Information Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main", fontWeight: 600, mb: 3 }}
            >
              Account Information
            </Typography>

            {/* Email & Password in same row */}
            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              <Controller
                name="Email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    required
                    variant="outlined"
                    error={!!errors.Email}
                    helperText={errors.Email?.message}
                    sx={{ flex: 1 }}
                  />
                )}
              />

              {/* <Controller
                name="Password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    required
                    variant="outlined"
                    error={!!errors.Password}
                    helperText={errors.Password?.message}
                    sx={{ flex: 1 }}
                  />
                )}
              /> */}

              <Controller
                name="Password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    required
                    variant="outlined"
                    error={!!errors.Password}
                    helperText={errors.Password?.message}
                    sx={{ flex: 1 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showPassword ? <EyeClosed /> : <Eye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            {/* Status & Employer in same row */}
            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              {/* <Controller
                name="Status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Status"
                    required
                    variant="outlined"
                    error={!!errors.Status}
                    helperText={errors.Status?.message}
                    sx={{ flex: 1 }}
                  />
                )}
              /> */}

              <Controller
                name="Status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.Status}>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status" value={field.value || ""}>
                      <MenuItem value="single">Single</MenuItem>
                      <MenuItem value="married">Married</MenuItem>
                    </Select>
                    {errors.Status && (
                      <Typography variant="caption" color="error">
                        {errors.Status.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="Employer"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Employer"
                    variant="outlined"
                    error={!!errors.Employer}
                    helperText={errors.Employer?.message}
                  />
                )}
              />
            </Box>
          </Box>

          {/* Phone Numbers Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main", fontWeight: 600, mb: 3 }}
            >
              Contact Information
            </Typography>

            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                p: 3,
                backgroundColor: "#fafafa",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                Phone Numbers *
              </Typography>
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <Controller
                    name={`Phones.${index}.number`}
                    control={control}
                    render={({ field: phoneField }) => (
                      <TextField
                        {...phoneField}
                        label={`Phone ${index + 1}`}
                        fullWidth
                        variant="outlined"
                        error={!!errors.Phones?.[index]?.number}
                        helperText={errors.Phones?.[index]?.number?.message}
                        sx={{ mr: 1 }}
                      />
                    )}
                  />
                  {fields.length > 1 && (
                    <IconButton
                      color="error"
                      onClick={() => removePhoneField(index)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addPhoneField}
                variant="outlined"
                size="small"
              >
                Add Phone Number
              </Button>
              {errors.Phones && (
                <FormHelperText error sx={{ ml: 2, mt: 1 }}>
                  {errors.Phones.message}
                </FormHelperText>
              )}
            </Box>
          </Box>

          {/* File Uploads Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main", fontWeight: 600, mb: 3 }}
            >
              Documents
            </Typography>

            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {/* Photo Upload */}
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 3,
                  minWidth: 250,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  Photo
                </Typography>
                <Controller
                  name="PhotoPath"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files[0])}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                />
              </Box>

              {/* Birth Certificate Upload */}
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 3,
                  minWidth: 250,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  Birth Certificate
                </Typography>
                <Controller
                  name="BirthCertificate"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => onChange(e.target.files[0])}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                />
              </Box>

              {/* CV Upload */}
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 3,
                  minWidth: 250,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  CV
                </Typography>
                <Controller
                  name="CVPath"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => onChange(e.target.files[0])}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>

          {/* Submit Button */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                px: 8,
                py: 2,
                borderRadius: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                minWidth: 200,
              }}
            >
              {loading ? "Creating..." : "Create Teacher"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateTeacher;
