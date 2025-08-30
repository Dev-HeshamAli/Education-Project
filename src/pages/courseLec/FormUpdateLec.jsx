import { useForm, useWatch } from "react-hook-form";
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
  Chip,
  Stack,
  Divider,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import {
  Upload,
  VideoFile,
  Delete,
  PlayCircleOutline,
  School,
  CloudUpload,
} from "@mui/icons-material";
import { actUpdateCourseVideo } from "../../store/shared/lectures/updateCourseVideo/actUpdateCourseVideo";
import { useEffect, useState } from "react";
import { resetUpdateVideoState } from "../../store/shared/lectures/updateCourseVideo/updateCourseVideoSlice";

const schema = yup.object().shape({
  videoFile: yup
    .mixed()
    .required("Video file is required")
    .test("fileType", "Unsupported file type", (value) => {
      if (value && value[0]) {
        const fileType = value[0].type;
        return (
          fileType === "video/mp4" ||
          fileType === "video/webm" ||
          fileType === "video/ogg"
        );
      }
      return true;
    })
    .test("fileSize", "File size must be less than 1GB", (value) => {
      if (value && value[0]) {
        return value[0].size <= 500 * 1024 * 1024 * 1024; // 500MB
      }
      return true;
    }),
});

const FormUpdateLec = ({ lectureId }) => {
  const dispatch = useDispatch();
  const { courseId } = useSelector((state) => state.selectionIds);
  const token = useSelector((state) => state.auth.token);
  const { success, error, loading } = useSelector((state) => state.updateLec);
  const [dragOver, setDragOver] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const watchedVideoFile = useWatch({
    control,
    name: "videoFile",
  });

  const selectedFile = watchedVideoFile?.[0];

  const onSubmit = (data) => {
    if (!courseId) {
      console.error("CourseId is missing!");
      return;
    }
    const formData = new FormData();
    formData.append("CourseId", Number(courseId));
    formData.append("Lecture", Number(lectureId));
    formData.append("videoFile", data.videoFile[0]);

    const allData = {};
    for (let [key, value] of formData.entries()) {
      allData[key] = value;
    }

    dispatch(actUpdateCourseVideo({ data: allData, token }));
  };

  const handleFileRemove = () => {
    setValue("videoFile", null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      setValue("videoFile", files);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(resetUpdateVideoState());
        reset();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [dispatch, success, error, reset]);

  return (
    <Paper
      elevation={8}
      sx={{
        width: "100%",
        mx: "auto",

        // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
          Upload lecture video and enter required information
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
            <Box>
              <Typography variant="h6" gutterBottom color="text.primary">
                Lecture Video
              </Typography>

              {!selectedFile ? (
                <Box
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  sx={{
                    border: `2px dashed ${dragOver ? "#667eea" : "#ccc"}`,
                    borderRadius: 3,
                    p: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    bgcolor: dragOver ? "rgba(103, 126, 234, 0.1)" : "grey.50",
                    "&:hover": {
                      borderColor: "#667eea",
                      bgcolor: "rgba(103, 126, 234, 0.05)",
                    },
                  }}
                >
                  <CloudUpload
                    sx={{
                      fontSize: 64,
                      color: dragOver ? "#667eea" : "grey.400",
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    Drag and drop your video here
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Or click to select from your device
                  </Typography>
                  <Button
                    variant="contained"
                    component="label"
                    size="large"
                    startIcon={<Upload />}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      background: "linear-gradient(45deg, #667eea, #764ba2)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #5a67d8, #6b46c1)",
                      },
                    }}
                  >
                    Choose Video
                    <input
                      type="file"
                      hidden
                      accept="video/*"
                      {...register("videoFile")}
                    />
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                    Supported formats: MP4, WebM, OGG (Max 500MB)
                  </Typography>
                </Box>
              ) : (
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    border: "2px solid #667eea",
                    background:
                      "linear-gradient(135deg, rgba(103, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <VideoFile sx={{ fontSize: 48, color: "#667eea" }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" color="text.primary">
                          {selectedFile.name}
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                          <Chip
                            label={formatFileSize(selectedFile.size)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={selectedFile.type}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </Stack>
                      </Box>
                      <IconButton
                        onClick={handleFileRemove}
                        color="error"
                        sx={{
                          "&:hover": {
                            bgcolor: "error.lighter",
                          },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {errors.videoFile && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  {errors.videoFile.message}
                </Alert>
              )}
            </Box>

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
