import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import ReportIcon from "@mui/icons-material/Report";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actGetTeacherProblems } from "../../store/shared/problems/teacherProblems/actGetTeacherProblems";
import { actsendProblem } from "../../store/shared/problems/sendTeacherProblem/actsendProblem";
import { actDeleteTeacherProblem } from "../../store/shared/problems/deleteTeacherProblem/actDeleteProblem";
import { clearMessageDeleteTeacherProblem } from "../../store/shared/problems/deleteTeacherProblem/deleteProblemSlice";
import { clearMessageSendProblem } from "../../store/shared/problems/sendTeacherProblem/sendProblemSlice";

const schema = yup.object().shape({
  problem: yup.string().required("من فضلك أدخل المشكلة").min(10),
});

const Reports = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { list: mockData } = useSelector((state) => state.teacherProblems);

  const { loading, success, error } = useSelector((state) => state.sendProblem);

  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = useSelector((state) => state.deleteProblemTeacher);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      problem: "",
    },
  });

  useEffect(() => {
    dispatch(actGetTeacherProblems(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (success || successDelete) {
      dispatch(actGetTeacherProblems(token));
    }
  }, [dispatch, token, success, successDelete]);

  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");

  const onSubmit = (data) => {
    dispatch(actsendProblem({ data: { problem: data.problem }, token }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this report?"))
      dispatch(actDeleteTeacherProblem({ id: id, token }));
  };

  const handleOpenDialog = (text) => {
    setDialogContent(text);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setDialogContent("");
  };

  // بدل الـ open state
  const [openAlert, setOpenAlert] = useState(false);

  // كل ما الرسالة أو حالة تتغير شغّل الـ Snackbar
  useEffect(() => {
    if (
      error ||
      success ||
      errorDelete ||
      successDelete ||
      loadingDelete ||
      loading
    ) {
      setOpenAlert(true);
    }
  }, [error, errorDelete, success, successDelete, loadingDelete, loading]);

  const handleClose = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    if (
      success ||
      errorDelete ||
      successDelete ||
      error ||
      loadingDelete ||
      loading
    ) {
      const timer = setTimeout(() => {
        dispatch(clearMessageDeleteTeacherProblem());
        dispatch(clearMessageSendProblem());
        reset();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [
    success,
    errorDelete,
    successDelete,
    error,
    dispatch,
    loadingDelete,
    loading,
    reset,
  ]);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: "#f8fafc",
      }}
    >
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={
            success
              ? "success"
              : errorDelete
              ? "error"
              : successDelete
              ? "success"
              : error
              ? "error"
              : loadingDelete
              ? "info"
              : loading
              ? "info"
              : ""
          }
          sx={{ width: "100%" }}
        >
          {errorDelete}
          {success && "تم إرسال البلاغ بنجاح"}
          {successDelete && "تم حذف البلاغ بنجاح"}
          {error}
          {loadingDelete && "جارٍ حذف البلاغ..."}
          {loading && "جارٍ إرسال البلاغ..."}
        </Alert>
      </Snackbar>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          gap: 2,
        }}
      >
        <ReportIcon
          sx={{
            fontSize: 40,
            color: "#1976d2",
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1a202c",
            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          البلاغات
        </Typography>
      </Box>

      {/* Form Section */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: "#2d3748",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SendIcon sx={{ color: "#1976d2" }} />
            إرسال بلاغ جديد
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="problem"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="أدخل المشكلة أو البلاغ"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.problem}
                  helperText={errors.problem?.message}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1976d2",
                    },
                  }}
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 4,
                fontSize: "1rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(25,118,210,0.4)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              إرسال البلاغ
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            backgroundColor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#2d3748",
            }}
          >
            البلاغات المرسلة ({mockData.length})
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#1976d2",
                  "& .MuiTableCell-head": {
                    color: "white",
                    fontWeight: 700,
                    fontSize: "1rem",
                    py: 2,
                  },
                }}
              >
                <TableCell>التاريخ</TableCell>
                <TableCell>المشكلة</TableCell>
                <TableCell>الرد</TableCell>
                <TableCell align="center">إجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.map((report) => (
                <TableRow
                  key={report.id}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "#f8fafc",
                    },
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                      transform: "scale(1.001)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <TableCell
                    sx={{
                      py: 2,
                      fontWeight: 500,
                      color: "#4a5568",
                    }}
                  >
                    {new Date(report.createdAt).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>

                  <TableCell
                    sx={{
                      py: 2,
                      maxWidth: 200,
                    }}
                  >
                    <Box
                      sx={{
                        color: "#1976d2",
                        cursor: "pointer",
                        fontWeight: 500,
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                      onClick={() =>
                        report.problem && handleOpenDialog(report.problem)
                      }
                    >
                      {report.problem
                        ? report.problem.length > 30
                          ? report.problem.substring(0, 30) + "..."
                          : report.problem
                        : "—"}
                    </Box>
                  </TableCell>

                  <TableCell sx={{ py: 2, maxWidth: 200 }}>
                    {report.response ? (
                      <Chip
                        label={
                          report.response.length > 20
                            ? report.response.substring(0, 20) + "..."
                            : report.response
                        }
                        variant="outlined"
                        color="success"
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "#e8f5e8",
                          },
                        }}
                        onClick={() => handleOpenDialog(report.response)}
                      />
                    ) : (
                      <Chip
                        label="في انتظار الرد"
                        variant="outlined"
                        color="warning"
                        size="small"
                      />
                    )}
                  </TableCell>

                  <TableCell align="center" sx={{ py: 2 }}>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(report.id)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#ffebee",
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {mockData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{
                      py: 6,
                      color: "#718096",
                      fontSize: "1.1rem",
                    }}
                  >
                    <ReportIcon
                      sx={{
                        fontSize: 48,
                        color: "#cbd5e0",
                        mb: 2,
                        display: "block",
                        mx: "auto",
                      }}
                    />
                    لا توجد بلاغات حالياً
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            fontWeight: 700,
            fontSize: "1.25rem",
          }}
        >
          تفاصيل البلاغ
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 3,
            backgroundColor: "#fafafa",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
              color: "#2d3748",
              fontSize: "1.1rem",
            }}
          >
            {dialogContent}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            backgroundColor: "#f8fafc",
          }}
        >
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
            }}
          >
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;
