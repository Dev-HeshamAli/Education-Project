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
  // const scademicYears = useSelector(
  //   (state) => state.academicYearsId.list || []
  // );

  // console.log("scademicYears", scademicYears);
  // console.log(studyLevels);

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
    };

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
    };

    console.log("Edit payload:", payload);
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
            <Table sx={{ border: "1px solid #eee" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f1f1f1" }}>
                  <TableCell align="center">
                    <b>Name</b>
                  </TableCell>
                  <TableCell align="right">
                    <b style={{ marginRight: "70px" }}>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studyLevels && studyLevels.length > 0 ? (
                  studyLevels.map((level) => (
                    <TableRow key={level.id}>
                      <TableCell sx={{ fontWeight: "bold" }} align="center">
                        {level.level}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(level)}
                        >
                          <Button variant="outlined" color="primary">
                            Edit
                          </Button>
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(level.id)}
                        >
                          <Button variant="outlined" color="error">
                            Delete
                          </Button>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No Study Levels Found
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
