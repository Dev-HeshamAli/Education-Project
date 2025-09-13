import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Box,
  IconButton,
  InputAdornment,
  Typography,
  Paper,
  Chip,
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Card,
  CardContent,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Visibility,
  VisibilityOff,
  PhotoCamera,
  Description,
  Edit,
  Close,
  PictureAsPdf,
  Delete,
} from "@mui/icons-material";
import { GridAddIcon } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { actUpdateTeacher } from "../../store/createTeacher/updateTeacher/actUpdateTeacher";
import { Line } from "@nivo/line";
import { resetUpdateTeacherState } from "../../store/createTeacher/updateTeacher/updateTeacherSlice";

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  secondName: yup.string().required("Second Name is required"),
  thirdName: yup.string().nullable(),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  status: yup.string().required("Status is required"),
  employer: yup.string().required("Employer is required"),
  teacherPhones: yup
    .array()
    .of(
      yup
        .string()
        .matches(/^01[0-9]{9}$/, "Invalid phone number")
        .required("Phone number is required")
    )
    .min(1, "At least one phone number is required"),
});
// eslint-disable-next-line no-unused-vars
const FilePreviewCard = ({ title, file, icon: Icon, onEdit, onView }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof file === "string") {
      setPreviewUrl(file);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const isImage =
    file &&
    (file instanceof File
      ? file.type?.startsWith("image/")
      : typeof file === "string" && /\.(jpe?g|png|gif|svg|webp)$/i.test(file));

  const isPdf =
    file &&
    (file instanceof File
      ? file.type === "application/pdf"
      : typeof file === "string" && /\.pdf$/i.test(file));

  const fileLabel =
    file instanceof File
      ? file.name
      : typeof file === "string"
      ? file.split("/").pop()
      : "";

  return (
    <Card
      sx={{
        width: 240,
        borderRadius: 2,
        boxShadow: 3,
        textAlign: "center",
        p: 2,
      }}
    >
      <CardContent>
        {isImage ? (
          <Avatar
            src={previewUrl}
            sx={{
              width: 90,
              height: 90,
              mx: "auto",
              cursor: "pointer",
              mb: 1,
            }}
            onClick={onView}
          />
        ) : isPdf ? (
          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: "error.main",
              mx: "auto",
              cursor: "pointer",
              mb: 1,
            }}
            onClick={onView}
          >
            <PictureAsPdf sx={{ fontSize: 40 }} />
          </Avatar>
        ) : (
          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: "primary.main",
              mx: "auto",
              mb: 1,
            }}
          >
            <Icon />
          </Avatar>
        )}

        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>

        {fileLabel && (
          <Chip
            label={fileLabel}
            size="small"
            sx={{ mt: 1, maxWidth: "90%" }}
          />
        )}

        <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
          <Button
            variant="outlined"
            size="small"
            component="label"
            startIcon={<Edit />}
          >
            {file ? "Change" : "Upload"}
            <input
              type="file"
              hidden
              accept={
                title === "Photo"
                  ? "image/*"
                  : title === "CV"
                  ? "image/*,.pdf"
                  : "*/*"
              }
              onChange={onEdit}
            />
          </Button>

          {file && (
            <Button variant="text" size="small" onClick={onView}>
              View
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const ImageDialog = ({ open, onClose, imageUrl, title }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {title}
      <IconButton onClick={onClose}>
        <Close />
      </IconButton>
    </DialogTitle>
    <DialogContent>
      <Box sx={{ textAlign: "center", p: 2 }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            style={{
              maxWidth: "100%",
              width: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
            }}
          />
        ) : (
          <Typography>No preview available</Typography>
        )}
      </Box>
    </DialogContent>
  </Dialog>
);

const EditTeacher = ({ teacherData, onClose, id }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [first, second, third] = teacherData?.fullName?.split(" ") || [
    "",
    "",
    "",
  ];

  const { loading, error, success } = useSelector(
    (state) => state.updateTeacher
  );

  const [imageDialog, setImageDialog] = useState({
    open: false,
    url: "",
    title: "",
  });

  const defaultValues = {
    firstName: first,
    secondName: second,
    thirdName: third,
    email: teacherData?.email || "",
    password: teacherData?.password || "",
    status: teacherData?.status || "",
    employer: teacherData?.employer || "",
    teacherPhones: teacherData?.teacherPhones || [""],
    photo: teacherData?.photo || "",
    cv: teacherData?.cv || "",
  };

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const photoFileList = watch("photo");
  const cvFileList = watch("cv");

  const getCurrent = (field, fallback) => {
    if (field instanceof FileList && field.length > 0) return field[0];
    return fallback;
  };

  const handleFileChange = (fieldName) => (e) =>
    setValue(fieldName, e.target.files);

  const handleViewImage = (file, title) => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setImageDialog({ open: true, url, title });
    } else {
      setImageDialog({ open: true, url: file, title });
    }
  };

  const handleViewFile = (file, title) => {
    const isPdf =
      file instanceof File
        ? file.type === "application/pdf"
        : typeof file === "string" && /\.pdf$/i.test(file);

    if (isPdf) {
      const url = file instanceof File ? URL.createObjectURL(file) : file;
      window.open(url, "_blank");
    } else {
      handleViewImage(file, title);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("Id", id);
    formData.append("FirstName", data.firstName);
    formData.append("SecondName", data.secondName);
    formData.append("ThirdName", data.thirdName || "");
    formData.append("Email", data.email);
    formData.append("Password", data.password);
    formData.append("Status", data.status);
    formData.append("Employer", data.employer);

    // Files
    const photoFile = getCurrent(photoFileList, teacherData.photo);
    if (photoFile) formData.append("PhotoPath", photoFile);

    const cvFile = getCurrent(cvFileList, teacherData.cv);
    if (cvFile) formData.append("CVPath", cvFile);

    // Phones
    data.teacherPhones.forEach((phone, i) => {
      formData.append(`Phones[${i}]`, phone);
    });

    // نخزن البيانات في متغير
    const formEntries = {};
    for (let [key, value] of formData.entries()) {
      formEntries[key] = value;
    }

    // console.log("Final FormData object:", formEntries);

    dispatch(actUpdateTeacher({ data: formEntries, token }));
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetUpdateTeacherState());
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => {
        dispatch(resetUpdateTeacherState());
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch, error, onClose]);
  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      {loading && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="info" sx={{ width: "100%" }}>
            <LinearProgress sx={{ mt: 1, mb: 1 }} />
            Updating teacher information
          </Alert>
        </Snackbar>
      )}
      {error && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      {success && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            {success}
          </Alert>
        </Snackbar>
      )}

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Edit Teacher Information
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            {/* Personal Info */}
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                  <Controller
                    name="thirdName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Third Name"
                        fullWidth
                        error={!!errors.thirdName}
                        helperText={errors.thirdName?.message}
                      />
                    )}
                  />
                  <Controller
                    name="secondName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Second Name"
                        fullWidth
                        error={!!errors.secondName}
                        helperText={errors.secondName?.message}
                      />
                    )}
                  />
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="First Name"
                        fullWidth
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                      />
                    )}
                  />
                </Stack>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />

                <Stack direction="row" spacing={2}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword((p) => !p)}
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Status"
                        fullWidth
                        error={!!errors.status}
                      >
                        <MenuItem value="single">Single</MenuItem>
                        <MenuItem value="married">Married</MenuItem>
                      </TextField>
                    )}
                  />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Controller
                    name="employer"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Employer"
                        fullWidth
                        error={!!errors.employer}
                        helperText={errors.employer?.message}
                      />
                    )}
                  />
                </Stack>

                {/* Teacher Phones */}
                <Controller
                  name="teacherPhones"
                  control={control}
                  render={({ field }) => (
                    <Stack spacing={1}>
                      <Typography variant="subtitle1">
                        Teacher Phones
                      </Typography>
                      {field.value &&
                        field.value.map((phone, index) => {
                          const phoneError =
                            errors.teacherPhones && errors.teacherPhones[index];

                          return (
                            <Stack direction="row" spacing={1} key={index}>
                              <TextField
                                value={phone}
                                onChange={(e) => {
                                  const newPhones = [...field.value];
                                  newPhones[index] = e.target.value;
                                  field.onChange(newPhones);
                                }}
                                label={`Phone ${index + 1}`}
                                fullWidth
                                error={!!phoneError}
                                helperText={phoneError?.message}
                              />

                              {/* زر الحذف */}
                              <IconButton
                                color="error"
                                onClick={() => {
                                  const newPhones = field.value.filter(
                                    (_, i) => i !== index
                                  );
                                  field.onChange(newPhones);
                                }}
                                disabled={field.value.length === 1}
                              >
                                <Delete />
                              </IconButton>

                              {/* زر الإضافة يظهر عند آخر رقم */}
                              {index === field.value.length - 1 && (
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    field.onChange([...field.value, ""])
                                  }
                                >
                                  <GridAddIcon />
                                </IconButton>
                              )}
                            </Stack>
                          );
                        })}
                    </Stack>
                  )}
                />
              </Stack>
            </Card>

            {/* Files Section */}
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Documents & Files
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <FilePreviewCard
                  title="Photo"
                  file={getCurrent(photoFileList, defaultValues.photo)}
                  icon={PhotoCamera}
                  onEdit={handleFileChange("photo")}
                  onView={() =>
                    handleViewImage(
                      getCurrent(photoFileList, defaultValues.photo),
                      "Teacher Photo"
                    )
                  }
                />
                <FilePreviewCard
                  title="CV"
                  file={getCurrent(cvFileList, defaultValues.cv)}
                  icon={Description}
                  onEdit={handleFileChange("cv")}
                  onView={() =>
                    handleViewFile(
                      getCurrent(cvFileList, defaultValues.cv),
                      "CV"
                    )
                  }
                />
              </Stack>
            </Card>

            {/* Actions */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button type="submit" variant="contained" size="large">
                Save Changes
              </Button>
              <Button
                onClick={onClose}
                variant="outlined"
                color="secondary"
                size="large"
              >
                Cancel
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>

      {/* Image Dialog */}
      <ImageDialog
        open={imageDialog.open}
        onClose={() => setImageDialog({ open: false, url: "", title: "" })}
        imageUrl={imageDialog.url}
        title={imageDialog.title}
      />
    </Box>
  );
};

export default EditTeacher;
