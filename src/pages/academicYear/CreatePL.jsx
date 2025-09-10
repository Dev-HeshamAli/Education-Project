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
import { actCreatePlanLevel } from "../../store/academicYear/createPlanLevel/actCreatePlanLevel";
import { resetCreateStudyLevelState } from "../../store/academicYear/createPlanLevel/createPlanLevelSlice";
import { fetchPlans } from "../../store/shared/plan/actGetPlan";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";

const CreatePL = ({ selectedPlan }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.planLevel);
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
      setTimeout(() => dispatch(resetCreateStudyLevelState()), 3000);
      if (success) reset();
    }
  }, [success, error, dispatch, reset]);

  const onSubmit = (formData) => {
    if (formData.discount > 100) return alert("Discount must not exceed 100%");

    const payload = {
      ...formData,
      discount: formData.discount / 100, // 👈 حوّل من % إلى 0–1
    };

    dispatch(actCreatePlanLevel({ data: payload, token }));
  };

  useEffect(() => {
    if (selectedPlan && plans?.length) {
      const matchedPlan = plans.find((plan) => plan.id === selectedPlan);

      if (matchedPlan) {
        reset((prev) => ({
          ...prev,
          planId: matchedPlan.id, // 👈 خلي القيمة الافتراضية هي اللي جايه من البروبس
        }));
      }
    }
  }, [selectedPlan, plans, reset]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Card sx={{ width: 450, p: 3 }}>
        <CardContent>
          <Typography variant="h5" mb={3} align="center">
            Create Plan Level
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
              rules={{ required: "Discount is required", min: 0, max: 100 }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Discount (%)"
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
              {loading ? "Adding..." : "Add Plan Level"}
            </Button>

            {success && (
              <Alert severity="success" sx={{ mt: 3 }}>
                Created successfully!
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

export default CreatePL;
