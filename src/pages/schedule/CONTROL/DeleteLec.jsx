import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Alert,
} from "@mui/material";
import { Delete, Warning, Close, CheckCircle } from "@mui/icons-material";
import { actDeleteLecFromSchedule } from "../../../store/schedule/deleteLecFromSchedule/actDeleteLecFromSchedule";
import { useDispatch, useSelector } from "react-redux";
import { resetDeleteLecFromScheduleState } from "../../../store/schedule/deleteLecFromSchedule/deleteLecFromScheduleSlice";

const DeleteLec = ({ id, open, onClose, lectureName = "المحاضرة" }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const { error: deleteError } = useSelector(
    (state) => state.deleteLecFromSchedule
  );

  const handleConfirmDelete = () => {
    setIsDeleting(true);

    // محاكاة عملية الحذف
    setTimeout(() => {
      dispatch(actDeleteLecFromSchedule({ token, id: id }));
      setIsDeleting(false);
      setIsDeleted(true);

      // إغلاق الحوار بعد عرض رسالة النجاح
      setTimeout(() => {
        setIsDeleted(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  const handleCancel = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  useEffect(() => {
    if (deleteError) {
      const timer = setTimeout(() => {
        dispatch(resetDeleteLecFromScheduleState());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [deleteError, dispatch]);

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      {deleteError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {deleteError}
        </Alert>
      )}
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: isDeleted ? "#4caf50" : "#f44336",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isDeleted ? <CheckCircle /> : <Warning />}
          <Typography variant="h6">
            {isDeleted ? "تم الحذف بنجاح" : "تأكيد الحذف"}
          </Typography>
        </Box>

        {!isDeleting && !isDeleted && (
          <IconButton onClick={handleCancel} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {isDeleted ? (
          <Box textAlign="center">
            <CheckCircle
              sx={{
                fontSize: 60,
                color: "#4caf50",
                mb: 2,
              }}
            />
            <Typography variant="h6" gutterBottom>
              تم حذف المحاضرة بنجاح!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error" sx={{ mb: 2 }} icon={<Delete />}>
              <Typography variant="body1">
                أنت على وشك حذف <strong>{lectureName}</strong>
              </Typography>
            </Alert>

            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                تحذير: هذا الإجراء لا يمكن التراجع عنه
              </Typography>
            </Alert>

            <Typography textAlign="center" color="text.secondary">
              هل أنت متأكد من أنك تريد المتابعة؟
            </Typography>
          </Box>
        )}
      </DialogContent>

      {!isDeleted && (
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleCancel}
            disabled={isDeleting}
            variant="outlined"
            color="inherit"
          >
            إلغاء
          </Button>

          <Button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            variant="contained"
            color="error"
          >
            {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default DeleteLec;
