import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayCircleOutline as PlayIcon,
} from "@mui/icons-material";
import { actGetlectures } from "../../store/shared/lectures/actGetlectures";
import { actGetLectureVideo } from "../../store/shared/lectures/lectureVideo/actGetLectureVideo";
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

  const {
    video,
    loading: videoLoading,
    error: videoError,
  } = useSelector((state) => state.video);

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [courseId, setCourseId] = useState(selectionIds.courseId || null);

  // ✅ حفظ courseId في localStorage وارجاعه لو الصفحة ريفريش
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

  // إنشاء Object URL للفيديو وتنظيفه
  useEffect(() => {
    if (video && !videoLoading) {
      const url = video;
      setVideoUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [video, videoLoading]);

  const handleLectureClick = async (lectureId) => {
    // const lec = lectureId.lecture;
    const videoName = lectureId.videoName;

    setSelectedLecture(lectureId);

    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl("");
    }

    dispatch(actGetLectureVideo({ token, videoName: videoName }));
  };

  const handleAddLecture = () => {
    setLectureForm(true);
  };

  const handleDeleteLecture = (lectureId, event) => {
    const lecId = lectureId.lecture;

    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this lecture?"))
      dispatch(actDeleteCourseVideo({ token, lecId: lecId, courseId }));
  };

  // إعادة ضبط حالة الحذف بعد 4 ثواني
  useEffect(() => {
    if (deleteError || deleteSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetDeleteVideoState());
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [dispatch, deleteError, deleteSuccess]);

  // ✅ مسح courseId من localStorage عند الخروج من الصفحة
  useEffect(() => {
    return () => {
      localStorage.removeItem("courseId");
    };
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 350,
          bgcolor: "white",
          borderRight: "2px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          boxShadow: 2,
        }}
      >
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
            <FormUpdateLec lectureId={selectedLecture} />
          </Dialog>
        )}

        {/* Course Header */}
        <Box sx={{ p: 2, bgcolor: "#2a4155", color: "white" }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {lectures?.courseName || "Course Name"}
          </Typography>
        </Box>

        {/* Add Lecture Button */}
        <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
          {deleteSuccess && (
            <Alert sx={{ m: 2 }} severity="success">
              Lecture deleted successfully
            </Alert>
          )}
          {deleteError && (
            <Alert sx={{ m: 2 }} severity="error">
              {deleteError}
            </Alert>
          )}
          {deleteLoading && (
            <Alert sx={{ m: 2 }} severity="info">
              Loading...
            </Alert>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<AddIcon />}
            onClick={handleAddLecture}
            sx={{
              py: 1.5,
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Add New Lecture
          </Button>
        </Box>

        {/* Lectures List */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <Typography
            variant="h6"
            sx={{ p: 2, fontWeight: "bold", color: "#2a4155" }}
          >
            Lectures ({lectures?.lectures?.length || 0})
          </Typography>

          {lectures?.lectures && lectures.lectures.length > 0 ? (
            <List sx={{ p: 0 }}>
              {lectures.lectures.map((lectureId, index) => (
                <ListItem
                  key={lectureId}
                  disablePadding
                  sx={{ borderBottom: "1px solid #f0f0f0" }}
                >
                  <ListItemButton
                    onClick={() => handleLectureClick(lectureId)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedLecture === lectureId
                          ? "#e3f2fd"
                          : "transparent",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <Box sx={{ mr: 2, color: "#2a4155" }}>
                      <PlayIcon />
                    </Box>

                    <ListItemText
                      primary={`Lecture ${index + 1}`}
                      primaryTypographyProps={{
                        fontWeight:
                          selectedLecture === lectureId ? "bold" : "normal",
                        color:
                          selectedLecture === lectureId ? "#1976d2" : "inherit",
                      }}
                    />
                  </ListItemButton>

                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => {
                        setSelectedLecture(lectureId);
                        setUpdateLectureForm(true);
                      }}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={(e) => handleDeleteLecture(lectureId, e)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info" sx={{ m: 2 }}>
              No lectures available for this course
            </Alert>
          )}
        </Box>
      </Box>

      {/* Main Content - Video Player */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedLecture ? (
          <Card sx={{ m: 3, flex: 1 }}>
            <CardContent sx={{ height: "100%" }}>
              <Typography variant="h5" gutterBottom color="#2a4155">
                Lecture {lectures?.lectures?.indexOf(selectedLecture) + 1}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{
                  width: "100%",
                  height: "calc(100% - 80px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#000",
                  borderRadius: 1,
                }}
              >
                {videoLoading ? (
                  <Box sx={{ textAlign: "center", color: "white" }}>
                    <CircularProgress sx={{ color: "white", mb: 2 }} />
                    <Typography variant="h6">Loading video...</Typography>
                  </Box>
                ) : videoError ? (
                  <Box sx={{ textAlign: "center", color: "white" }}>
                    <Typography variant="h6" color="error" gutterBottom>
                      Error loading video
                    </Typography>
                    <Typography variant="body2">{videoError}</Typography>
                  </Box>
                ) : videoUrl ? (
                  <video
                    controls
                    preload="none"
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    src={videoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
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
            <PlayIcon sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" gutterBottom>
              Select a Lecture to Watch
            </Typography>
            <Typography variant="body1">
              Choose a lecture from the sidebar to start watching
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LecVideo;
