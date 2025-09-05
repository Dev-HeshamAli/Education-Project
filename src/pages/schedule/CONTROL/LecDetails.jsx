import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
  IconButton,
  Dialog,
  Box,
  Chip,
  Avatar,
  Grid,
  CardHeader,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  X,
  Clock,
  User,
  BookOpen,
  Calendar,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  UploadIcon,
} from "lucide-react";
import UpdateLec from "./UpdateLec";
import DeleteLec from "./DeleteLec";
import UploadLInk from "./UploadLInk";
import { useDispatch, useSelector } from "react-redux";
import { clearCreateLinkMessagesSuccess } from "../../../store/courses/uploadLink/createLinkSlice";
import { resetDeleteLinkState } from "../../../store/courses/deleteLecLink/deleteLecLinkSlice";
import { actDeleteLecLink } from "../../../store/courses/deleteLecLink/actDeleteLecLink";

const LecDetails = ({ lecture, scheduleDayesIdForUpdate, onClose }) => {
  const token = useSelector((state) => state.auth.token);
  const courseName = lecture.courseName || "غير محدد";
  const teacherName = lecture.teacherName || "غير محدد";
  const teacherId = lecture.teacherId || "غير محدد";
  const startTime = lecture.startTime;
  const endTime = lecture.endTime;
  const link = lecture.lectureLink;
  const id = lecture.id;

  const dispatch = useDispatch();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUploadLinkDialog, setOpenUploadLinkDialog] = useState(false);
  const { successMessage } = useSelector((state) => state.uploadLinkCourse);
  const { success, error, loading } = useSelector(
    (state) => state.deleteLecLink
  );

  useEffect(() => {
    if (successMessage || success) {
      const timer = setTimeout(() => {
        dispatch(resetDeleteLinkState());
        dispatch(clearCreateLinkMessagesSuccess());
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, onClose, dispatch, success]);

  const handelDeleteLink = () => {
    if (window.confirm("هل أنت متأكد من حذف رابط المحاضرة؟"))
      dispatch(actDeleteLecLink({ token, id }));
  };

  // تنسيق الوقت لعرض أجمل
  const formatTime = (time) => {
    if (!time) return "غير محدد";

    const [hours, minutes] = time.split(":").map(Number);

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // يخلي 0 -> 12
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  // تحويل مدة المحاضرة لصيغة مفهومة
  const formatDuration = (duration) => {
    if (!duration) return "غير محدد";
    const [hours, minutes] = duration.split(":");
    return `${hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : ""} ${
      minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : ""
    }`.trim();
  };

  // الحصول على الأحرف الأولى من اسم المدرس للأفاتار
  const getInitials = (name) => {
    if (!name) return "؟";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 6,
        bgcolor: "white",
        minWidth: 450,
        maxWidth: 600,
        border: "1px solid #e0e0e0",
      }}
    >
      {success && (
        <Alert severity="success" sx={{ my: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      {loading && (
        <Alert severity="info" sx={{ my: 2 }}>
          Loading...
        </Alert>
      )}

      {/* Dialog للتعديل */}
      {openEditDialog && (
        <Dialog
          open={openEditDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <Box sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              onClick={() => setOpenEditDialog(false)}
              size="large"
              sx={{
                bgcolor: "error.light",
                color: "#fff",
                mt: 1,
                mr: 2,
                "&:hover": {
                  bgcolor: "error.main",
                  transition: "all 0.2s ease",
                  transform: "scale(1.1)",
                },
              }}
            >
              <X size={20} />
            </IconButton>
          </Box>
          <UpdateLec
            scheduleDayesIdForUpdate={scheduleDayesIdForUpdate}
            id={id}
            courseName={courseName}
            teacherName={teacherName}
            startTime={startTime}
            endTime={endTime}
            teacherId={teacherId}
          />
        </Dialog>
      )}
      {/* Dialog للحذف */}
      {openDeleteDialog && (
        <Dialog
          open={openDeleteDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <DeleteLec
            id={id}
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
          />
        </Dialog>
      )}
      {/* Dialog لتحميل رابط */}
      {openUploadLinkDialog && (
        <Dialog
          open={openUploadLinkDialog}
          onClose={() => setOpenUploadLinkDialog(false)}
          fullWidth
        >
          <UploadLInk
            id={id}
            lectureLink={link}
            open={openUploadLinkDialog}
            onClose={() => setOpenUploadLinkDialog(false)}
          />
        </Dialog>
      )}

      {/* Header المحاضرة */}
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: lecture.isActive ? "#4caf50" : "#ff9800",
              width: 56,
              height: 56,
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            {getInitials(lecture.teacherName)}
          </Avatar>
        }
        title={
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#1a237e",
              fontSize: "22px",
            }}
          >
            {lecture.courseName}
          </Typography>
        }
        subheader={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Chip
              icon={
                lecture.isActive ? (
                  <CheckCircle size={16} />
                ) : (
                  <XCircle size={16} />
                )
              }
              label={lecture.isActive ? "نشطة" : "غير نشطة"}
              size="small"
              color={lecture.isActive ? "success" : "warning"}
              variant="outlined"
            />
          </Box>
        }
        sx={{
          bgcolor: "#f8f9fa",
          borderBottom: "2px solid #e3f2fd",
        }}
      />

      <CardContent sx={{ p: 3 }}>
        {/* معلومات المحاضرة */}
        <Grid container spacing={3}>
          {/* معلومات المدرس */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#e8f5e8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <User size={24} color="#4caf50" />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  اسم المدرس
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {lecture.teacherName}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* الأوقات */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#fff3e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Clock size={24} color="#ff9800" />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  وقت البداية
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {formatTime(lecture.startTime)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#ffebee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Clock size={24} color="#f44336" />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  وقت النهاية
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {formatTime(lecture.endTime)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* المدة */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#e3f2fd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Calendar size={24} color="#2196f3" />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  مدة المحاضرة
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {formatDuration(lecture.duration)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* رابط المحاضرة */}
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: lecture.lectureLink ? "#e8f5e8" : "#fafafa",
                border: "1px dashed #ccc",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LinkIcon
                  size={20}
                  color={lecture.lectureLink ? "#4caf50" : "#999"}
                />
                <Typography variant="body2" color="text.secondary">
                  رابط المحاضرة:
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{ mt: 1, wordBreak: "break-all" }}
              >
                <a
                  href={lecture.lectureLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#1976d2",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  {lecture.lectureLink?.length > 30
                    ? lecture.lectureLink.slice(0, 20) + "..."
                    : lecture.lectureLink || "لم يتم إضافة رابط بعد"}
                </a>
              </Typography>
            </Box>

            <IconButton
              title="حذف رابط المحاضرة"
              size="small"
              color="error"
              onClick={() => handelDeleteLink()}
              sx={{
                "&:hover": {
                  bgcolor: "rgba(244, 67, 54, 0.1)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
                display: lecture.lectureLink ? "block" : "none",
                mr: 1,
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* أزرار التحكم */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            onClick={() => setOpenUploadLinkDialog(true)}
            variant="contained"
            startIcon={<UploadIcon size={20} />}
            sx={{
              bgcolor: "#1976d2",
              borderRadius: 3,
              px: 3,
              py: 1,
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#1565c0",
                transform: "translateY(-1px)",
                boxShadow: 4,
              },
              transition: "all 0.2s ease",
            }}
          >
            {lecture.lectureLink ? "تعديل " : "اضافة"} رابط المحاضرة
          </Button>
          <Box>
            <IconButton
              title="حذف المحاضرة"
              size="small"
              color="error"
              onClick={() => setOpenDeleteDialog(true)}
              sx={{
                "&:hover": {
                  bgcolor: "rgba(244, 67, 54, 0.1)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
                mr: 1,
              }}
            >
              <DeleteIcon />
            </IconButton>

            <Button
              onClick={() => setOpenEditDialog(true)}
              variant="contained"
              startIcon={<EditIcon />}
              sx={{
                bgcolor: "#1976d2",
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "#1565c0",
                  transform: "translateY(-1px)",
                  boxShadow: 4,
                },
                transition: "all 0.2s ease",
              }}
            >
              تعديل المحاضرة
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default LecDetails;
