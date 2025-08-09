// src/pages/plan/CreatePlan.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  TextField,
} from "@mui/material";
import { actCreatePlan } from "../../store/academicYear/plan/actPlan";
import { resetCreatePlanState } from "../../store/academicYear/plan/planSlice";

const CreatePlan = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.plan);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(actCreatePlan({ data: data, token }));
  };

  useEffect(() => {
    if (success || error) {
      setTimeout(() => dispatch(resetCreatePlanState()), 3000);
      if (success) reset(); // reset form after success
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
            Create New Plan
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Plan name is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Plan Name"
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
              {loading ? "Adding..." : "Add Plan"}
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

export default CreatePlan;
