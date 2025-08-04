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
import { actStage } from "../../store/academicYear/stage/actStage";
import { resetCreatePlanState } from "../../store/academicYear/stage/stageSlice";

const stageOptions = [
  { label: "Primary", value: "Primary" },
  { label: "Kindergarten", value: "Kindergarten" },
];

const CreateStage = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.plan);

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
            Create Stage
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth required>
              <InputLabel id="stage-label">Stage</InputLabel>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Stage is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      labelId="stage-label"
                      label="Stage"
                      error={!!fieldState.error}
                    >
                      {stageOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <Typography variant="caption" color="error">
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </>
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
