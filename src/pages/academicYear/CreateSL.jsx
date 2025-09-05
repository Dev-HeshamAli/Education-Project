import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  CircularProgress,
  MenuItem,
  TextField,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { actStudyLevel } from "../../store/academicYear/studyLevel/actStudyLevel";
import { fetchStages } from "../../store/shared/stage/actGetStage";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { actDeleteStudyLevel } from "../../store/academicYear/studyLevel/deleteStudyLevel/actDeleteStudyLevel";
import { clearMessageDeleteStudyLevel } from "../../store/academicYear/studyLevel/deleteStudyLevel/deleteStudyLevelSlice";
import { actUpdateStudyLevel } from "../../store/academicYear/studyLevel/updateStudyLevel/actUpdateStudyLevel";
import { resetUpdateStudyLevelState } from "../../store/academicYear/studyLevel/updateStudyLevel/updateStudyLevelSlice";
// import { fetchAcademicYears } from "../../store/shared/academicYears/actGetAcademicYears";

const schema = yup.object().shape({
  stage: yup.string().required("Stage is required"),
  name: yup.string().required("Level name is required"),
});

const CreateSL = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { loading, error, success } = useSelector((state) => state.studyLevel);
  const { error: deleteError, success: deleteSuccess } = useSelector(
    (state) => state.deleteStudyLevel
  );
  const { error: updateError, success: updateSuccess } = useSelector(
    (state) => state.updateStudyLevel
  );
  const stages = useSelector((state) => state.stageId.list || []);
  const studyLevels = useSelector((state) => state.studyLevelsId.list || []);
  // console.log(studyLevels);

  // const scademicYears = useSelector(
  //   (state) => state.academicYearsId.list || []
  // );

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      stage: "",
      name: "",
      maxStudents: "",
    },
  });

  // Fetch stages & studyLevels
  useEffect(() => {
    dispatch(fetchStages());
    dispatch(fetchStudyLevels(token));
    // dispatch(fetchAcademicYears(token));
  }, [dispatch, token]);

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      setMessage("Study Level created successfully.");
      setMessageType("success");
      reset();
      dispatch(fetchStudyLevels(token));
    } else if (error) {
      setMessage(error);
      setMessageType("error");
    }

    if (deleteSuccess || updateSuccess) {
      dispatch(fetchStudyLevels(token));
    }

    if (
      success ||
      error ||
      deleteSuccess ||
      deleteError ||
      updateSuccess ||
      updateError
    ) {
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageType("");
        dispatch(clearMessageDeleteStudyLevel());
        dispatch(resetUpdateStudyLevelState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [
    success,
    error,
    reset,
    dispatch,
    token,
    deleteSuccess,
    deleteError,
    updateSuccess,
    updateError,
  ]);

  const onSubmit = (formData) => {
    const matchedLevel = studyLevels.find(
      (lvl) => lvl.level.toLowerCase() === formData.name.toLowerCase()
    );

    if (matchedLevel) {
      setMessage("Study Level already exists.");
      setMessageType("error");
      return;
    }

    const matchedStage = stages.find(
      (s) => s.name.toLowerCase() === formData.stage.toLowerCase()
    );

    const payload = {
      name: formData.name,
      stageId: matchedStage?.id || null,
      maxStudntNumber: Number(formData.maxStudents) || null,
    };

    // console.log("Payload for creating Study Level:", payload);

    dispatch(actStudyLevel({ data: payload, token }));
  };

  // Handle Edit (Dialog open)
  const handleEdit = (level) => {
    setSelectedLevel(level);
    setOpenEditDialog(true);
  };

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this study level?"))
      dispatch(actDeleteStudyLevel({ id, token }));
  };

  // Handle Save in Dialog
  const handleSaveEdit = () => {
    if (!selectedLevel) return;

    const payload = {
      id: selectedLevel.id,
      name: selectedLevel.level,
      maxStudntNumber: Number(selectedLevel.maxStudntNumber),
    };

    dispatch(actUpdateStudyLevel({ data: payload, token }));
    setOpenEditDialog(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="100vh"
      bgcolor="#f9f9f9"
      py={6}
    >
      <Box
        width="100%"
        maxWidth="800px"
        display="flex"
        flexDirection="column"
        gap={4}
      >
        {message && (
          <Alert severity={messageType} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {deleteSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {deleteSuccess}
          </Alert>
        )}
        {deleteError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {deleteError}
          </Alert>
        )}

        {updateSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {updateSuccess}
          </Alert>
        )}
        {updateError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {updateError}
          </Alert>
        )}

        {/* FORM (create) */}
        <Card>
          <CardContent>
            <Typography variant="h5" mb={2} align="center">
              Create Study Level
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Stage Dropdown */}
              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel>Stage</InputLabel>
                <Controller
                  name="stage"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Stage">
                      {stages.map((stage) => (
                        <MenuItem key={stage.id} value={stage.name}>
                          {stage.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.stage && (
                  <Typography variant="caption" color="error">
                    {errors.stage.message}
                  </Typography>
                )}
              </FormControl>

              {/* Max Students */}
              <Controller
                name="maxStudents"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Max Students"
                    variant="outlined"
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              {/* Level Input */}
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Level Name"
                    variant="outlined"
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
                startIcon={
                  loading && <CircularProgress size={20} color="inherit" />
                }
              >
                {loading ? "Saving..." : "Add Study Level"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* TABLE */}
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Study Levels List
            </Typography>
            <Table
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#f5f5f5",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "600",
                      fontSize: "20px",
                      color: "#333",
                      padding: "16px",
                      borderRight: "1px solid #e0e0e0",
                    }}
                  >
                    Level
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "600",
                      fontSize: "20px",
                      color: "#333",
                      padding: "16px",
                      borderRight: "1px solid #e0e0e0",
                    }}
                  >
                    Max Students
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "600",
                      fontSize: "20px",
                      color: "#333",
                      padding: "16px",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studyLevels && studyLevels.length > 0 ? (
                  studyLevels.map((level, index) => (
                    <TableRow
                      key={level.id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f9f9f9",
                        },
                        backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "500",
                          fontSize: "18px",
                          color: "#555",
                          padding: "12px 16px",
                          borderRight: "1px solid #f0f0f0",
                        }}
                      >
                        {level.level}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "500",
                          fontSize: "18px",
                          color: "#555",
                          padding: "12px 16px",
                          borderRight: "1px solid #f0f0f0",
                        }}
                      >
                        {level.maxStudntNumber}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: "8px 16px",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => handleEdit(level)}
                            sx={{
                              minWidth: "70px",
                              fontSize: "15px",
                              borderRadius: "6px",
                              textTransform: "none",
                              fontWeight: "500",
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(level.id)}
                            sx={{
                              minWidth: "70px",
                              fontSize: "15px",
                              borderRadius: "6px",
                              textTransform: "none",
                              fontWeight: "500",
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{
                        padding: "40px 16px",
                        color: "#999",
                        fontSize: "14px",
                        fontStyle: "italic",
                      }}
                    >
                      لا توجد مستويات دراسية
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* EDIT DIALOG */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Edit Study Level</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              label="Level Name"
              fullWidth
              value={selectedLevel?.level || ""}
              onChange={(e) =>
                setSelectedLevel({ ...selectedLevel, level: e.target.value })
              }
            />
            <TextField
              type="number"
              margin="normal"
              label="Max Students"
              fullWidth
              value={selectedLevel?.maxStudntNumber || ""}
              onChange={(e) =>
                setSelectedLevel({
                  ...selectedLevel,
                  maxStudntNumber: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
            <Button
              onClick={handleSaveEdit}
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CreateSL;
