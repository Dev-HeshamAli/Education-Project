import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  MenuItem,
  Select,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { actStage } from "../../store/academicYear/stage/actStage";
import { resetCreatePlanState } from "../../store/academicYear/stage/stageSlice";

const CreateStage = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.stage);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(actStage({ data, token }));
  };

  useEffect(() => {
    if (success || error) {
      setTimeout(() => dispatch(resetCreatePlanState()), 3000);
      if (success) reset();
    }
  }, [success, error, dispatch, reset]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f9f9f9"
    >
      <Card sx={{ width: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" mb={3} align="center">
            Create New Stage
          </Typography>

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
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateStage;
