// src/pages/plan/CreatePlan.jsx
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
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { actCreatePlan } from "../../store/academicYear/plan/actPlan";
import { resetCreatePlanState } from "../../store/academicYear/plan/planSlice";

const planOptions = [
  { label: "Online Plan", value: "Online Plan" },
  { label: "Offline Plan", value: "Offline Plan" },
  { label: "Online Course Plan", value: "Online Course Plan" },
];

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
            Add New Academic Plan
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth required>
              <InputLabel id="plan-label">Plan</InputLabel>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Plan is required" }}
                render={({ field, fieldState }) => (
                  <Select
                    {...field}
                    labelId="plan-label"
                    label="Plan"
                    error={!!fieldState.error}
                  >
                    {planOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

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
