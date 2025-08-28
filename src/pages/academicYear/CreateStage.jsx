import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Alert,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { actStage } from "../../store/academicYear/stage/actStage";
import { resetCreateStageState } from "../../store/academicYear/stage/stageSlice";
import { fetchStages } from "../../store/shared/stage/actGetStage";
import { actDeleteStage } from "../../store/academicYear/stage/deleteStage/actDeleteStage";
import { resetDeleteStageState } from "../../store/academicYear/stage/deleteStage/deleteStageSlice";

const CreateStage = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.stage);
  const { error: errorDelete, success: successDelete } = useSelector(
    (state) => state.deleteStage
  );
  const stages = useSelector((state) => state.stageId.list);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const [showForm, setShowForm] = useState(false);

  const onSubmit = (data) => {
    dispatch(actStage({ data, token }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this stage?"))
      dispatch(actDeleteStage({ id, token }));
  };

  useEffect(() => {
    dispatch(fetchStages(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (success || error || successDelete || errorDelete) {
      setTimeout(() => {
        dispatch(resetCreateStageState());
        dispatch(resetDeleteStageState());
        dispatch(fetchStages(token));
      }, 2000);
      if (success) {
        reset();
        setShowForm(false);
      }
    }
  }, [success, error, dispatch, reset, token, successDelete, errorDelete]);

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
        {success && (
          <Alert severity="success" sx={{ mt: 3 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
        {successDelete && (
          <Alert severity="success" sx={{ mt: 3 }}>
            {successDelete}
          </Alert>
        )}
        {errorDelete && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {errorDelete}
          </Alert>
        )}

        {!showForm && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
            sx={{ alignSelf: "flex-start" }}
          >
            Create New Stage
          </Button>
        )}

        {/* FORM */}
        {showForm && (
          <Card>
            <CardContent sx={{ position: "relative" }}>
              <Typography variant="h5" mb={3} align="center">
                Create New Stage
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setShowForm(false)}
                sx={{ position: "absolute", top: 10, right: 10 }}
              >
                Close
              </Button>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Stage name is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Stage Name"
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
                  {loading ? "Adding..." : "Add Stage"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* TABLE */}
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Stages List
            </Typography>
            <Table sx={{ border: "1px solid #eee" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f1f1f1" }}>
                  <TableCell align="center">
                    <b>Name</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stages && stages.length > 0 ? (
                  stages.map((stage) => (
                    <TableRow
                      key={stage.id}
                      hover
                      sx={{ "&:hover": { backgroundColor: "#fafafa" } }}
                    >
                      <TableCell align="center">{stage.name}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(stage.id)}
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
                    <TableCell colSpan={3} align="center">
                      No Stages Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default CreateStage;
