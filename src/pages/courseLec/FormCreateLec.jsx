import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  LinearProgress,
  Paper,
  Stack,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { PlayCircleOutline, School } from "@mui/icons-material";
import { actCreateCourseVideo } from "../../store/shared/lectures/createCourseVideo/actCreateCourseVideo";
import { useEffect } from "react";
import { resetCreateVideoState } from "../../store/shared/lectures/createCourseVideo/createCourseVideoSlice";

// ✅ Schema
const schema = yup.object().shape({
  lecture: yup
    .number()
    .typeError("Lecture ID must be a number")
    .required("Lecture ID is required")
    .min(1, "Lecture ID must be positive"),
  lectureVideo: yup
    .string()
    .url("Must be a valid video URL")
    .required("Lecture video URL is required"),
  cartonVideo: yup
    .string()
    .url("Must be a valid video URL")
    .required("Carton video URL is required"),
  summaryFile: yup
    .mixed()
    .test("required", "Summary file is required", (value) => {
      return value && value.length > 0;
    }),
  CartonVideoSummaryFile: yup
    .mixed()
    .test("required", "Cartoon Summary File file is required", (value) => {
      return value && value.length > 0;
    }),
});

const FormCreateLec = () => {
  const dispatch = useDispatch();
  const courseId = localStorage.getItem("1"); // أو من Redux
  const token = useSelector((state) => state.auth.token);
  const { success, error, loading } = useSelector((state) => state.createLec);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ✅ تعديل الإرسال
  const onSubmit = (data) => {
    if (!courseId) {
      console.error("CourseId is missing!");
      return;
    }

    const formData = new FormData();
    formData.append("CourseId", Number(courseId));
    formData.append("Lecture", Number(data.lecture));
    formData.append("LectureVideo", data.lectureVideo);
    formData.append("CartonVideo", data.cartonVideo);
    formData.append("SummaryFile", data.summaryFile[0]); // فايل واحد
    formData.append("CartonVideoSummaryFile", data.CartonVideoSummaryFile[0]); // فايل واحد

    dispatch(actCreateCourseVideo({ data: formData, token }));
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetCreateVideoState());
        reset();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, success, error, reset]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(resetCreateVideoState());
        reset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, success, error, reset]);

  return (
    <Paper
      elevation={8}
      sx={{
        width: "100%",
        mx: "auto",
        background: "#2a4155",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          color: "white",
          textAlign: "center",
        }}
      >
        <School sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Create New Lecture
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Enter lecture info, video links, and upload summary file
        </Typography>
      </Box>

      {/* Form Content */}
      <Card sx={{ m: 0 }}>
        <CardContent sx={{ p: 2 }}>
          {/* Status Messages */}
          <Stack spacing={2} sx={{ mb: 3 }}>
            {success && (
              <Alert
                severity="success"
                variant="filled"
                sx={{ borderRadius: 2 }}
              >
                Lecture created successfully!
              </Alert>
            )}
            {error && (
              <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
                Error: {error}
              </Alert>
            )}
            {loading && (
              <>
                <Alert
                  severity="info"
                  variant="filled"
                  sx={{ borderRadius: 2 }}
                >
                  Creating lecture... Please wait
                </Alert>
                <LinearProgress
                  sx={{
                    borderRadius: 1,
                    height: 6,
                    background: "rgba(103, 126, 234, 0.2)",
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(45deg, #667eea, #764ba2)",
                    },
                  }}
                />
              </>
            )}
          </Stack>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Lecture ID */}
            <Box>
              <Typography variant="h6" gutterBottom color="text.primary">
                Lecture Number
              </Typography>
              <TextField
                placeholder="Enter lecture Number"
                type="number"
                variant="outlined"
                {...register("lecture")}
                error={!!errors.lecture}
                helperText={errors.lecture?.message}
                fullWidth
              />
            </Box>

            <Divider />

            {/* Lecture Video */}
            <Box>
              <Typography variant="h6" gutterBottom color="text.primary">
                Lecture Video Link
              </Typography>
              <TextField
                placeholder="Enter lecture video URL"
                type="url"
                variant="outlined"
                {...register("lectureVideo")}
                error={!!errors.lectureVideo}
                helperText={errors.lectureVideo?.message}
                fullWidth
              />
            </Box>

            {/* Carton Video */}
            <Box>
              <Typography variant="h6" gutterBottom color="text.primary">
                Cartoon Video Link
              </Typography>
              <TextField
                placeholder="Enter carton video URL"
                type="url"
                variant="outlined"
                {...register("cartonVideo")}
                error={!!errors.cartonVideo}
                helperText={errors.cartonVideo?.message}
                fullWidth
              />
            </Box>

            {/*Lecture Summary File */}
            <Box>
              <Typography variant="h6" gutterBottom color="text.primary">
                Upload Lecture Summary File
              </Typography>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                {...register("summaryFile")}
              />
              {errors.summaryFile && (
                <Typography color="error">
                  {errors.summaryFile.message}
                </Typography>
              )}
            </Box>
            {/* Summary File */}
            <Box>
              <Typography variant="h6" gutterBottom color="text.primary">
                Upload Cartoon Summary File
              </Typography>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                {...register("CartonVideoSummaryFile")}
              />
              {errors.CartonVideoSummaryFile && (
                <Typography color="error">
                  {errors.CartonVideoSummaryFile.message}
                </Typography>
              )}
            </Box>

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              startIcon={loading ? <PlayCircleOutline /> : <School />}
              sx={{
                py: 2,
                fontSize: "1.2rem",
                fontWeight: "bold",
                borderRadius: 2,
                background: "linear-gradient(45deg, #4caf50, #45a049)",
                "&:hover": {
                  background: "linear-gradient(45deg, #45a049, #3d8b40)",
                },
                "&:disabled": {
                  background: "linear-gradient(45deg, #ccc, #bbb)",
                },
              }}
            >
              {loading ? "Creating..." : "Create Lecture"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default FormCreateLec;