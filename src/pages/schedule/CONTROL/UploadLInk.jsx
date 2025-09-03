import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { actCreateLink } from "../../../store/courses/uploadLink/actCreateLink";
import { useEffect } from "react";
import { clearCreateLinkMessagesError } from "../../../store/courses/uploadLink/createLinkSlice";

// Schema validation using Yup
const schema = yup.object().shape({
  LecId: yup.number().required("Lecture ID is required"),
  LectureLink: yup
    .string()
    .url("يجب إدخال رابط صحيح")
    .required("رابط المحاضرة مطلوب"),
});

const UploadLInk = ({ id, onClose, lectureLink }) => {
  const token = useSelector((state) => state.auth.token);
  const { loading, successMessage, errorMessage } = useSelector(
    (state) => state.uploadLinkCourse
  );
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      LecId: id,
      LectureLink: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("LecId", data.LecId);
      formData.append("LectureLink", data.LectureLink);

      dispatch(actCreateLink({ data: formData, token }));

      reset({ LecId: id, LectureLink: "" });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        dispatch(clearCreateLinkMessagesError());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage, onClose, dispatch]);

  return (
    <Container maxWidth="sm">
      {successMessage && (
        <Alert sx={{ mt: 3 }} severity="success">
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert sx={{ mt: 3 }} severity="error">
          {errorMessage}
        </Alert>
      )}

      {loading && (
        <Alert sx={{ mt: 3 }} severity="info">
          Loading please wait...
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 4 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <CloudUploadIcon
            sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            {lectureLink?.length > 0 ? "تعديل" : "رفع"} رابط المحاضرة
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Hidden field for LecId */}
          <Controller
            name="LecId"
            control={control}
            render={({ field }) => <input type="hidden" {...field} />}
          />

          {/* Visible field for LectureLink */}
          <Controller
            name="LectureLink"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="رابط المحاضرة"
                placeholder="https://example.com/lecture"
                variant="outlined"
                error={!!errors.LectureLink}
                helperText={errors.LectureLink?.message}
                sx={{ mb: 3 }}
                InputProps={{
                  dir: "ltr",
                }}
              />
            )}
          />

          {errors.LecId && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.LecId.message}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting}
            startIcon={<CloudUploadIcon />}
            sx={{
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            {isSubmitting
              ? "جاري الرفع..."
              : lectureLink?.length > 0
              ? "تعديل الرابط"
              : "رفع الرابط"}
          </Button>
        </form>

        <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>ملاحظة:</strong> تأكد من أن الرابط صحيح وقابل للوصول
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default UploadLInk;
