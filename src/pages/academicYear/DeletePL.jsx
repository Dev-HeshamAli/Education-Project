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
import { fetchPlans } from "../../store/shared/plan/actGetPlan";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { resetDeletePlanLevelState } from "../../store/academicYear/deletePlanLevel/deletePlanLevelSlice";
import { actDeletePlanLevel } from "../../store/academicYear/deletePlanLevel/actDeletePlanLevel";

const DeletePL = ({ deleteData }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector(
    (state) => state.deletePlanLevel
  );
  const plans = useSelector((state) => state.plansId.list);
  const studyLevels = useSelector((state) => state.studyLevelsId.list);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      planId: "",
      studyLevelId: "",
    },
  });

  // ✅ Load plans + studyLevels once
  useEffect(() => {
    dispatch(fetchPlans(token));
    dispatch(fetchStudyLevels(token));
  }, [dispatch, token]);

  // ✅ Reset success/error state after 3s
  useEffect(() => {
    if (success || error) {
      setTimeout(() => dispatch(resetDeletePlanLevelState()), 3000);
      if (success) reset();
    }
  }, [success, error, dispatch, reset]);

  // ✅ لما ييجي deleteData من الزرار
  useEffect(() => {
    if (!deleteData || !studyLevels?.length) return;

    // match level name → id
    const matchedLevel = studyLevels.find(
      (lvl) =>
        String(lvl.level).toUpperCase() ===
        String(deleteData.studyLevelName).toUpperCase()
    );

    reset({
      planId: deleteData.planId ?? "",
      studyLevelId: matchedLevel ? matchedLevel.id : "",
    });
  }, [deleteData, studyLevels, reset]);

  const onSubmit = (formData) => {
    // ✅ formData هنا فيه planId و studyLevelId كـ id فعلاً
    dispatch(
      actDeletePlanLevel({
        planId: formData.planId,
        studyLevelId: formData.studyLevelId,
        token,
      })
    );
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Card sx={{ width: 450, p: 3 }}>
        <CardContent>
          <Typography variant="h5" mb={3} align="center" color="error">
            Delete Plan Level
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ✅ Select Plan */}
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

            {/* ✅ Select Study Level */}
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

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="error"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Deleting..." : "Delete Plan Level"}
            </Button>

            {success && (
              <Alert severity="success" sx={{ mt: 3 }}>
                Deleted successfully!
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

export default DeletePL;
