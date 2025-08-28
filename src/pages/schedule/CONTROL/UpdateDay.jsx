import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Chip,
  Alert,
  Fade,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { resetUpdateScheduleDayState } from "../../../store/schedule/updateScheduleDay/updateScheduleDaySlice";
import { actUpdateScheduleDay } from "../../../store/schedule/updateScheduleDay/actUpdateScheduleDay";

const UpdateDay = ({ daysOfWeek = [], availableDays = [] }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { success, error } = useSelector((state) => state.updateScheduleDay);

  const [selectedDayId, setSelectedDayId] = useState("");
  const [newDayName, setNewDayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDay = daysOfWeek.find((day) => day.id === selectedDayId);

  // الحصول على الأيام المتاحة فقط (غير الموجودة في الجدول)
  const getAvailableDaysForSelection = () => {
    const existingDayNames = daysOfWeek.map((day) => day.dayName);
    return availableDays.filter((day) => !existingDayNames.includes(day));
  };

  const availableDaysForSelection = getAvailableDaysForSelection();

  const handleSubmit = async () => {
    if (!selectedDayId || !newDayName) {
      return;
    }

    setIsSubmitting(true);

    const data = {
      id: selectedDayId,
      dayName: newDayName,
    };

    dispatch(actUpdateScheduleDay({ data, token }));
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setSelectedDayId("");
    setNewDayName("");
  };

  useEffect(() => {
    if (success || error) {
      const time = setTimeout(() => {
        dispatch(resetUpdateScheduleDayState());
      }, 3000);

      return () => clearTimeout(time);
    }
  }, [success, error, dispatch]);

  const isFormValid = selectedDayId && newDayName;

  return (
    <>
      {success && (
        <Alert
          severity="success"
          sx={{
            m: 3,
          }}
        >
          {success}
        </Alert>
      )}
      {error && (
        <Alert
          severity="error"
          sx={{
            m: 3,
          }}
        >
          {error}
        </Alert>
      )}
      <DialogTitle
        sx={{
          textAlign: "center",
          pb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          fontSize: "1.4rem",
          fontWeight: 600,
        }}
      >
        <EditIcon color="primary" />
        تعديل يوم في الجدول
      </DialogTitle>

      <Divider sx={{ mx: 3 }} />

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* عرض معلومات إضافية */}
          <Box
            sx={{
              bgcolor: "primary.50",
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "primary.100",
            }}
          >
            <Typography
              variant="body2"
              color="primary.dark"
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
            >
              <ScheduleIcon fontSize="small" />
              الأيام المتاحة للإضافة
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {availableDaysForSelection.length > 0 ? (
                availableDaysForSelection.map((day, index) => (
                  <Chip
                    key={index}
                    label={day}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  جميع الأيام موجودة بالجدول بالفعل
                </Typography>
              )}
            </Box>
          </Box>

          {/* اختيار اليوم اللي موجود في الجدول */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="select-day-label">
              اختر اليوم المراد تعديله
            </InputLabel>
            <Select
              labelId="select-day-label"
              value={selectedDayId}
              label="اختر اليوم المراد تعديله"
              onChange={(e) => setSelectedDayId(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.1)",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                  },
                },
              }}
            >
              {daysOfWeek.length === 0 ? (
                <MenuItem disabled>
                  <em>لا توجد أيام في الجدول</em>
                </MenuItem>
              ) : (
                daysOfWeek.map((day) => (
                  <MenuItem key={day.id} value={day.id}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        width: "100%",
                      }}
                    >
                      <Typography>{day.dayName}</Typography>
                      <Chip
                        label={`${day.lectures?.length || 0} محاضرة`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* عرض اليوم المختار */}
          <Fade in={Boolean(selectedDay)}>
            <Box>
              {selectedDay && (
                <Alert
                  severity="info"
                  variant="outlined"
                  sx={{
                    bgcolor: "info.50",
                    "& .MuiAlert-message": { width: "100%" },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    اليوم المختار: <strong>{selectedDay.dayName}</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    عدد المحاضرات: {selectedDay.lectures?.length || 0}
                  </Typography>
                </Alert>
              )}
            </Box>
          </Fade>

          {/* اختيار اليوم الجديد من الأيام المتاحة فقط */}
          <FormControl fullWidth variant="outlined" disabled={!selectedDayId}>
            <InputLabel id="select-new-day-label">اختر اليوم الجديد</InputLabel>
            <Select
              labelId="select-new-day-label"
              value={newDayName}
              label="اختر اليوم الجديد"
              onChange={(e) => setNewDayName(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.1)",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                  },
                },
              }}
            >
              {availableDaysForSelection.length === 0 ? (
                <MenuItem disabled>
                  <em>لا توجد أيام متاحة للإضافة</em>
                </MenuItem>
              ) : (
                availableDaysForSelection.map((day, index) => (
                  <MenuItem key={index} value={day}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {day}
                      <Chip
                        label="متاح"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
            {!selectedDayId && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, mx: 1.5 }}
              >
                يجب اختيار يوم من الجدول أولاً
              </Typography>
            )}
            {selectedDayId && availableDaysForSelection.length === 0 && (
              <Typography
                variant="caption"
                color="warning.main"
                sx={{ mt: 0.5, mx: 1.5 }}
              >
                جميع الأيام موجودة في الجدول بالفعل - لا يمكن التعديل
              </Typography>
            )}
          </FormControl>

          {/* عرض معاينة التغيير */}
          <Fade in={isFormValid}>
            <Box>
              {isFormValid && (
                <Alert
                  severity="success"
                  variant="outlined"
                  icon={<CheckIcon />}
                  sx={{
                    bgcolor: "success.50",
                    "& .MuiAlert-message": { width: "100%" },
                  }}
                >
                  <Typography variant="body2">
                    <strong>معاينة التغيير:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    سيتم تغيير <strong>{selectedDay?.dayName}</strong> إلى{" "}
                    <strong>{newDayName}</strong>
                  </Typography>
                </Alert>
              )}
            </Box>
          </Fade>
        </Box>
      </DialogContent>

      <Divider sx={{ mx: 3 }} />

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          color="inherit"
          sx={{
            minWidth: 100,
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: 2,
            },
          }}
        >
          إلغاء
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            !isFormValid ||
            isSubmitting ||
            availableDaysForSelection.length === 0
          }
          sx={{
            minWidth: 100,
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: 4,
            },
            "&:disabled": {
              transform: "none",
            },
          }}
        >
          {isSubmitting ? "جاري الحفظ..." : "حفظ التعديل"}
        </Button>
      </DialogActions>
    </>
  );
};

export default UpdateDay;
