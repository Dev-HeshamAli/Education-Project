import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Alert,
  Dialog,
  Card,
  CardContent,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayCircleOutline as PlayIcon,
  ExpandMore as ExpandMoreIcon,
  PictureAsPdf as PdfIcon,
  Person as PersonIcon,
  VideoLibrary as VideoIcon,
  OndemandVideo as LiveIcon,
} from "@mui/icons-material";
import { actGetlectures } from "../../store/shared/lectures/actGetlectures";
import { actDeleteCourseVideo } from "../../store/shared/lectures/deleteCourseVideo/actDeleteCourseVideo";
import { resetDeleteVideoState } from "../../store/shared/lectures/deleteCourseVideo/deleteCourseVideoSlice";
import FormCreateLec from "./FormCreateLec";
import FormUpdateLec from "./FormUpdateLec";

const LecVideo = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const selectionIds = useSelector((state) => state.selectionIds);
  const lectures = useSelector((state) => state.lectures.list);

  const [lectureForm, setLectureForm] = useState(false);
  const [updateLectureForm, setUpdateLectureForm] = useState(false);
  const { success } = useSelector((state) => state.createLec);
  const { success: updateSuccess } = useSelector((state) => state.updateLec);
  const {
    success: deleteSuccess,
    error: deleteError,
    loading: deleteLoading,
  } = useSelector((state) => state.deleteLec);

  const [selectedLecture, setSelectedLecture] = useState(null);

  const [videoUrl, setVideoUrl] = useState("");
  const [courseId, setCourseId] = useState(selectionIds.courseId || null);

  // حفظ courseId
  useEffect(() => {
    const savedCourseId = localStorage.getItem("1");
    if (!courseId && savedCourseId) {
      setCourseId(savedCourseId);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      localStorage.setItem("1", courseId);
      dispatch(actGetlectures({ token, id: courseId }));
    }
  }, [dispatch, token, courseId, success, updateSuccess, deleteSuccess]);

  const getPlayableUrl = (url) => {
    if (!url) return "";

    // لو اللينك من Google Drive
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.+?)\//);
      const fileId = match ? match[1] : null;

      if (fileId) {
        // ممكن نستخدم preview أو download
        return {
          iframe: `https://drive.google.com/file/d/${fileId}/preview`,
          video: `https://drive.google.com/uc?export=download&id=${fileId}`,
        };
      }
    }

    // لو مش Google Drive هنرجع اللينك زي ما هو
    return { iframe: url, video: url };
  };

  const handleLectureClick = (lecture) => {
    setSelectedLecture(lecture);
    setVideoUrl(lecture.lectureVideo);
  };
  const handleLectureClickCartoon = (lecture) => {
    setSelectedLecture(lecture);
    setVideoUrl(lecture.lectureCartonVideo);
  };

  const handleAddLecture = () => {
    setLectureForm(true);
  };

  const handleDeleteLecture = (lecture, event) => {
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this lecture?"))
      dispatch(
        actDeleteCourseVideo({
          token,
          courseId: lecture.id,
        })
      );
  };

  // إعادة ضبط حالة الحذف
  useEffect(() => {
    if (deleteError || deleteSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetDeleteVideoState());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, deleteError, deleteSuccess]);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f8fafc" }}>
      {/* Enhanced Sidebar */}
      <Box
        sx={{
          width: 380,
          bgcolor: "white",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          position: "relative",
        }}
      >
        {/* Dialogs */}
        {lectureForm && (
          <Dialog
            fullWidth
            maxWidth="sm"
            open={lectureForm}
            onClose={() => setLectureForm(false)}
          >
            <FormCreateLec />
          </Dialog>
        )}
        {updateLectureForm && (
          <Dialog
            fullWidth
            maxWidth="sm"
            open={updateLectureForm}
            onClose={() => setUpdateLectureForm(false)}
          >
            <FormUpdateLec
              lectureId={selectedLecture?.id}
              lectureVideo={selectedLecture?.lectureVideo}
              lectureCartonVideo={selectedLecture?.lectureCartonVideo}
              summaryFile={selectedLecture?.summaryFile}
              CartonVideoSummaryFile={selectedLecture?.cartonVideoSummaryFile}
            />
          </Dialog>
        )}

        {/* Enhanced Course Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #1976d2 100%)",
            color: "white",
            p: 3,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "relative", zIndex: 2 }}>
            <Typography
              variant="h5"
              fontWeight="700"
              gutterBottom
              sx={{ mb: 1 }}
            >
              {lectures[0]?.courseName || "Course Name"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <VideoIcon sx={{ fontSize: 20 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {lectures?.length || 0} Lectures Available
              </Typography>
            </Box>
          </Box>
          {/* Background Pattern */}
          <Box
            sx={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }}
          />
        </Box>

        {/* Enhanced Add Button Section */}
        <Box sx={{ p: 3, borderBottom: "1px solid #e2e8f0" }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddIcon />}
            onClick={handleAddLecture}
            sx={{
              py: 2,
              fontSize: "16px",
              fontWeight: "600",
              background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)",
              borderRadius: 3,
              textTransform: "none",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Add New Lecture
          </Button>
        </Box>

        {/* Enhanced Alerts */}
        {(deleteSuccess || deleteError || deleteLoading) && (
          <Box sx={{ px: 3, pt: 2 }}>
            {deleteSuccess && (
              <Alert
                severity="success"
                sx={{
                  borderRadius: 2,
                  "& .MuiAlert-icon": { fontSize: 20 },
                }}
              >
                Lecture deleted successfully
              </Alert>
            )}
            {deleteError && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: 2,
                  "& .MuiAlert-icon": { fontSize: 20 },
                }}
              >
                {deleteError}
              </Alert>
            )}
          </Box>
        )}

        {/* Enhanced Lectures List */}
        <Box sx={{ flex: 1, overflow: "auto", px: 2, py: 1 }}>
          <Typography
            variant="h6"
            sx={{
              px: 1,
              py: 2,
              fontWeight: "600",
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <LiveIcon sx={{ color: "#667eea" }} />
            Lectures Library
          </Typography>

          {lectures && lectures.length > 0 ? (
            <Box sx={{ pb: 2 }}>
              {lectures.map((lecture) => (
                <Accordion
                  key={lecture.id}
                  sx={{
                    mb: 2,
                    borderRadius: "12px !important",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    boxShadow:
                      selectedLecture?.id === lecture.id
                        ? "0 8px 25px rgba(102, 126, 234, 0.2)"
                        : "0 2px 8px rgba(0,0,0,0.06)",
                    "&:before": { display: "none" },
                    backgroundColor:
                      selectedLecture?.id === lecture.id
                        ? "rgba(102, 126, 234, 0.05)"
                        : "white",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#667eea" }} />}
                    sx={{
                      background:
                        selectedLecture?.id === lecture.id
                          ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
                          : "#f8fafc",
                      minHeight: 64,
                      "& .MuiAccordionSummary-content": {
                        alignItems: "center",
                        my: 2,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor:
                            selectedLecture?.id === lecture.id
                              ? "#667eea"
                              : "#e2e8f0",
                          color:
                            selectedLecture?.id === lecture.id
                              ? "white"
                              : "#64748b",
                          width: 40,
                          height: 40,
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {lecture.lecture}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          fontWeight="600"
                          color={
                            selectedLecture?.id === lecture.id
                              ? "#667eea"
                              : "#1e293b"
                          }
                          sx={{ fontSize: "16px" }}
                        >
                          Lecture {lecture.lecture}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ bgcolor: "white", p: 3 }}>
                    {/* Resources */}
                    <Box sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                        }}
                      >
                        {lecture.summaryFile && (
                          <Chip
                            icon={<PdfIcon />}
                            label="Lecture Summary File"
                            component="a"
                            href={lecture.summaryFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            clickable
                            sx={{
                              bgcolor: "#fef2f2",
                              color: "#dc2626",
                              fontWeight: "500",
                              justifyContent: "flex-start",
                              "& .MuiChip-icon": { color: "#dc2626" },
                              "&:hover": { bgcolor: "#fee2e2" },
                            }}
                          />
                        )}
                        {lecture.cartonVideoSummaryFile && (
                          <Chip
                            icon={<PdfIcon />}
                            label="Cartoon Summary File"
                            component="a"
                            href={lecture.cartonVideoSummaryFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            clickable
                            sx={{
                              bgcolor: "#1976d21f", // بنفسجي جميل
                              color: "#1976d2 ",
                              fontWeight: "500",
                              justifyContent: "flex-start",
                              "& .MuiChip-icon": { color: "#1976d2 " }, // ذهبي للأيقونة
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PlayIcon />}
                        onClick={() => handleLectureClick(lecture)}
                        sx={{
                          flex: 1,
                          background:
                            "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                          fontWeight: "600",
                          borderRadius: 2,
                          textTransform: "none",
                          "&:hover": {
                            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                          },
                        }}
                      >
                        Lecture
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PlayIcon />}
                        onClick={() => handleLectureClickCartoon(lecture)}
                        sx={{
                          flex: 1,
                          background:
                            "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                          fontWeight: "600",
                          borderRadius: 2,
                          textTransform: "none",
                          "&:hover": {
                            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                          },
                        }}
                      >
                        Cartoon
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedLecture(lecture);
                          setUpdateLectureForm(true);
                        }}
                        sx={{
                          bgcolor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          "&:hover": {
                            bgcolor: "#667eea",
                            color: "white",
                            borderColor: "#667eea",
                          },
                        }}
                      >
                        <EditIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteLecture(lecture, e)}
                        sx={{
                          bgcolor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          "&:hover": {
                            bgcolor: "#dc2626",
                            color: "white",
                            borderColor: "#dc2626",
                          },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ) : (
            <Alert
              severity="info"
              sx={{
                m: 2,
                borderRadius: 2,
                bgcolor: "#f0f9ff",
                border: "1px solid #bae6fd",
              }}
            >
              No lectures available for this course
            </Alert>
          )}
        </Box>
      </Box>

      {/* Enhanced Main Content - Video Player */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#f8fafc",
        }}
      >
        {selectedLecture ? (
          <Card
            sx={{
              m: 4,
              flex: 1,
              borderRadius: 4,
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent sx={{ height: "100%", p: 0 }}>
              {/* Video Header */}
              <Box sx={{ p: 3, borderBottom: "1px solid #e2e8f0" }}>
                <Typography
                  variant="h4"
                  fontWeight="700"
                  color="#1e293b"
                  sx={{ mb: 1 }}
                >
                  Lecture {selectedLecture.lecture}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "#667eea", width: 32, height: 32 }}>
                    <PersonIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="body1" color="text.secondary">
                    {selectedLecture.teacherName}
                  </Typography>
                </Box>
              </Box>

              {/* Video Container */}
              <Box
                sx={{
                  width: "100%",
                  height: "calc(100% - 110px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#000",
                  borderRadius: 1,
                }}
                onContextMenu={(e) => e.preventDefault()}
              >
                {videoUrl ? (
                  videoUrl.includes("youtube.com") ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={videoUrl.replace("watch?v=", "embed/")}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin allow-presentation"
                    ></iframe>
                  ) : videoUrl.includes("drive.google.com") ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={getPlayableUrl(videoUrl).iframe}
                      allow="autoplay"
                      style={{ border: "none" }}
                    ></iframe>
                  ) : (
                    <video
                      controls
                      controlsList="nodownload noremoteplayback"
                      disablePictureInPicture
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      src={videoUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <Typography variant="h6" color="white">
                    Select a lecture to load video
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "text.secondary",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#e2e8f0",
                width: 120,
                height: 120,
                mb: 3,
                color: "#64748b",
              }}
            >
              <PlayIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography
              variant="h4"
              fontWeight="600"
              gutterBottom
              color="#1e293b"
            >
              Select a Lecture to Watch
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Choose a lecture from the sidebar to start your learning journey
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LecVideo;