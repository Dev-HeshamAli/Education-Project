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
  Card,
  CardContent,
} from "@mui/material";
import { PlayCircleOutline, School } from "@mui/icons-material";
import { actUpdateCourseVideo } from "../../store/shared/lectures/updateCourseVideo/actUpdateCourseVideo";
import { useEffect } from "react";
import { resetUpdateVideoState } from "../../store/shared/lectures/updateCourseVideo/updateCourseVideoSlice";

// ✅ Validation Schema
const schema = yup.object().shape({
  LectureVideo: yup
    .string()
    .required("Lecture video link is required")
    .url("Please enter a valid video URL"),
  CartonVideo: yup
    .string()
    .url("Please enter a valid cartoon video URL")
    .nullable(),
  // SummaryFile: yup
  //   .mixed()
  //   .test("fileRequired", "Summary file is required", (value) => {
  //     return value && value.length > 0;
  //   }),
});

const FormUpdateLec = ({
  lectureId,
  summaryFile,
  lectureCartonVideo,
  lectureVideo,
  CartonVideoSummaryFile,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { success, error, loading } = useSelector((state) => state.updateLec);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      LectureVideo: lectureVideo || "",
      CartonVideo: lectureCartonVideo || "",
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("Id", lectureId); // 👈 يجي من props
    formData.append("LectureVideo", data.LectureVideo);
    formData.append("CartonVideo", data.CartonVideo || "");
    formData.append("SummaryFile", data.SummaryFile[0]); // ملف واحد
    formData.append("CartonVideoSummaryFile", data.CartonVideoSummaryFile[0]); // ملف واحد

    dispatch(actUpdateCourseVideo({ data: formData, token }));
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(resetUpdateVideoState());
        reset();
      }, 2000);

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
          Update Lecture
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Update lecture links and upload summary file
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
                Lecture updated successfully!
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
                  Updating lecture... Please wait
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
            <TextField
              label="Lecture Video Link"
              fullWidth
              {...register("LectureVideo")}
              error={!!errors.LectureVideo}
              helperText={errors.LectureVideo?.message}
            />

            <TextField
              label="Cartoon Video Link"
              fullWidth
              {...register("CartonVideo")}
              error={!!errors.CartonVideo}
              helperText={errors.CartonVideo?.message}
            />

            <Box variant="outlined" component="label">
              <input
                type="file"
                {...register("SummaryFile")}
                accept=".pdf,.doc,.docx"
              />
            </Box>
            {summaryFile && (
              <Typography variant="body2">
                Current Lec summary File: <strong>{summaryFile}</strong>
              </Typography>
            )}
            {errors.SummaryFile && (
              <Typography color="error" variant="body2">
                {errors.SummaryFile.message}
              </Typography>
            )}
            <Box variant="outlined" component="label">
              <input
                type="file"
                {...register("CartonVideoSummaryFile")}
                accept=".pdf,.doc,.docx"
              />
            </Box>
            {CartonVideoSummaryFile && (
              <Typography variant="body2">
                Current Cartoon summary File:
                <strong>{CartonVideoSummaryFile}</strong>
              </Typography>
            )}
            {errors.CartonVideoSummaryFile && (
              <Typography color="error" variant="body2">
                {errors.CartonVideoSummaryFile.message}
              </Typography>
            )}

            {/* Submit Button */}
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
              {loading ? "Updating..." : "Update Lecture"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default FormUpdateLec;