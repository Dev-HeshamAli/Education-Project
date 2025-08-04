// ✅ CreatePL.jsx
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
  TextField,
} from "@mui/material";
import { actUpdatePlanLevel } from "../../store/academicYear/updatePlanLevel/actUpdatePlanLevel";
import { resetUpdatePlanLevelState } from "../../store/academicYear/updatePlanLevel/updatePlanLevelSlice";
import { fetchPlans } from "../../store/shared/plan/actGetPlan";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";

const UpdatePL = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.updatePlanLevel);
  const plans = useSelector((state) => state.plansId.list);
  const studyLevels = useSelector((state) => state.studyLevelsId.list);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      planId: "",
      studyLevelId: "",
      price: "",
      discount: "",
    },
  });

  useEffect(() => {
    dispatch(fetchPlans(token));
    dispatch(fetchStudyLevels(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (success || error) {
      setTimeout(() => dispatch(resetUpdatePlanLevelState()), 3000);
      if (success) reset();
    }
  }, [success, error, dispatch, reset]);

  const onSubmit = (formData) => {
    if (formData.discount > 0.99) return alert("Discount must not exceed 1");
    dispatch(actUpdatePlanLevel({ data: formData, token }));
    console.log("Form Data:", formData);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f4f4f4"
    >
      <Card sx={{ width: 450, p: 3 }}>
        <CardContent>
          <Typography variant="h5" mb={3} align="center">
            Update Plan Level
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="plan-label">Plan</InputLabel>
              <Controller
                name="planId"
                control={control}
                rules={{ required: "Plan is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      labelId="plan-label"
                      label="Plan"
                      error={!!fieldState.error}
                    >
                      {plans.map((plan) => (
                        <MenuItem key={plan.id} value={plan.id}>
                          {plan.name}
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

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="level-label">Study Level</InputLabel>
              <Controller
                name="studyLevelId"
                control={control}
                rules={{ required: "Study Level is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      labelId="level-label"
                      label="Study Level"
                      error={!!fieldState.error}
                    >
                      {studyLevels.map((level) => (
                        <MenuItem key={level.id} value={level.id}>
                          {level.level}
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

            <Controller
              name="price"
              control={control}
              rules={{ required: "Price is required", min: 0 }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Price"
                  fullWidth
                  type="number"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Controller
              name="discount"
              control={control}
              rules={{ required: "Discount is required", min: 0, max: 1 }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Discount (e.g., 0.2)"
                  fullWidth
                  type="number"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Adding..." : "Update Plan Level"}
            </Button>

            {success && (
              <Alert severity="success" sx={{ mt: 3 }}>
                Updated successfully!
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UpdatePL;
