import React, { useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { resetDeleteStatus } from "../../store/courses/deleteCourse/deleteCourseSlice";
import { actDeleteCourse } from "../../store/courses/deleteCourse/actDeleteCourse";

const DeleteCourse = ({ courseData, onClose }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const {
    success: successMessage,
    error: errorMessage,
    loading,
  } = useSelector((state) => state.deleteCourse);

  // إغلاق المودال بعد الحذف الناجح
  useEffect(() => {
    if (successMessage) {
      const timeoutId = setTimeout(() => {
        dispatch(resetDeleteStatus());
        onClose();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [successMessage, dispatch, onClose]);

  // تنظيف الحالة عند إغلاق المودال
  useEffect(() => {
    return () => {
      dispatch(resetDeleteStatus());
    };
  }, [dispatch]);

  const handleDeleteCourse = () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${courseData?.name}" course?`
      )
    ) {
      dispatch(actDeleteCourse({ token, id: courseData?.id }));
    }
  };

  return (
    <Box p={3} sx={{ minWidth: 400 }}>
      {loading && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress />
        </Box>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Typography variant="h5" gutterBottom color="error" textAlign="center">
        Delete Course
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
        Are you sure you want to delete this course? This action cannot be
        undone.
      </Typography>

      {courseData && (
        <Card sx={{ mb: 3, border: "1px solid #f44336" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: "#1976d2" }}>
              Course Details:
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body1">
                <strong>Name:</strong> {courseData.name}
              </Typography>

              <Typography variant="body1">
                <strong>Description:</strong> {courseData.description}
              </Typography>

              <Typography variant="body1">
                <strong>Old Price:</strong> {courseData.oldPrice}
              </Typography>

              <Typography variant="body1">
                <strong>Discount:</strong> {courseData.discountPercentage * 100}
                %
              </Typography>

              <Typography variant="body1">
                <strong>Final Price:</strong> {courseData.finalPrice}
              </Typography>

              <Typography variant="body1">
                <strong>Teachers:</strong> {courseData.teachers?.length || 0}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteCourse}
          disabled={loading || !courseData}
        >
          {loading ? "Deleting..." : "Delete Course"}
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteCourse;
