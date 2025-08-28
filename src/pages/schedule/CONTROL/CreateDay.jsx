import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
  Avatar,
  Divider,
  Alert,
} from "@mui/material";
import { Calendar, Save, X, CalendarDays, BookOpen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { actCreateScheduleDay } from "../../../store/schedule/createScheduleDay/actCreateScheduleDay";
import { resetCreateScheduleDayState } from "../../../store/schedule/createScheduleDay/createScheduleDaySlice";

// Schema للتحقق من صحة البيانات
const createDaySchema = yup.object().shape({
  dayName: yup
    .string()
    .required("يجب اختيار اليوم")
    .oneOf(
      ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
      "يرجى اختيار يوم صحيح"
    ),
  academicScheduleId: yup
    .number()
    .positive("معرف الجدول يجب أن يكون رقماً موجباً"),
});

const CreateDay = ({
  daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
  academicScheduleId,
  onClose,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { success, error } = useSelector((state) => state.createScheduleDay);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(createDaySchema),
    defaultValues: {
      dayName: "",
      academicScheduleId: academicScheduleId || "",
    },
  });

  // مراقبة القيم للعرض
  const watchedValues = watch();

  // دالة الإرسال
  const onSubmitForm = async (data) => {
    try {
      dispatch(actCreateScheduleDay({ data, token }));

      reset();
    } catch (error) {
      console.error("خطأ في إرسال البيانات:", error);
    }
  };

  // دالة الإلغاء
  const handleCancel = () => {
    reset();
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {}, [dispatch]);

  useEffect(() => {
    if (success || error) {
      const time = setTimeout(() => {
        dispatch(resetCreateScheduleDayState());
      }, 3000);

      return () => clearTimeout(time);
    }
  }, [success, error, dispatch]);
  return (
    <Card
      sx={{
        maxWidth: 500,
        mx: "auto",
        borderRadius: 4,
        boxShadow: 6,
        border: "1px solid #e3f2fd",
      }}
    >
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
      {/* Header */}
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              width: 56,
              height: 56,
            }}
          >
            <Calendar size={28} color="white" />
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
            إضافة يوم جديد
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            اختر اليوم لإضافته للجدول الأكاديمي
          </Typography>
        }
        sx={{
          bgcolor: "#f8f9fa",
          borderBottom: "2px solid #e3f2fd",
        }}
      />

      <CardContent sx={{ p: 4 }}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Stack spacing={3}>
            {/* اختيار اليوم */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: "bold", color: "#555" }}
              >
                اختيار اليوم
              </Typography>
              <Controller
                name="dayName"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors.dayName}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <InputLabel>اختر اليوم</InputLabel>
                    <Select
                      {...field}
                      label="اختر اليوم"
                      startAdornment={
                        <Box
                          sx={{ mr: 1, display: "flex", alignItems: "center" }}
                        >
                          <CalendarDays size={20} color="#666" />
                        </Box>
                      }
                    >
                      {daysOfWeek.map((day) => (
                        <MenuItem
                          key={day}
                          value={day}
                          sx={{
                            "&:hover": {
                              bgcolor: "#e3f2fd",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Calendar size={18} color="#1976d2" />
                            <Typography>{day}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.dayName && (
                      <FormHelperText>{errors.dayName.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {(watchedValues.dayName || watchedValues.academicScheduleId) && (
              <Box>
                <Divider sx={{ mb: 2 }} />
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 2, fontWeight: "bold", color: "#1976d2" }}
                >
                  معاينة البيانات:
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f8f9fa",
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  {watchedValues.dayName && (
                    <Typography variant="body2">
                      <strong>اليوم المختار:</strong> {watchedValues.dayName}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button
                type="button"
                variant="outlined"
                color="error"
                startIcon={<X size={18} />}
                onClick={handleCancel}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: "bold",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: 2,
                  },
                  transition: "all 0.2s ease",
                }}
              >
                إلغاء
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Save size={18} />}
                disabled={isSubmitting}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: "bold",
                  flex: 1,
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: 4,
                  },
                  "&:disabled": {
                    transform: "none",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {isSubmitting ? "جاري الحفظ..." : "حفظ اليوم"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateDay;
