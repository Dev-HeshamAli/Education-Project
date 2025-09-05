import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchSchoolClassId } from "../../store/shared/schoolClass/actGetSchoolClassId";
import { updateSchoolClass } from "../../store/schoolClass/updateSchoolClass/schoolClassActions";
import { resetSchoolClassState } from "../../store/schoolClass/updateSchoolClass/updateSchoolClassSlice";

const schema = yup.object().shape({
  studyLevelId: yup.string().required("Study level is required"),
  classId: yup.string().required("Class is required"),
  name: yup.string().required("Class name is required"),
  capacity: yup
    .number()
    .typeError("Capacity must be a number")
    .required("Capacity is required")
    .positive("Capacity must be positive")
    .integer("Capacity must be a whole number"),
});

const UpdateSchoolClass = ({ studyLevelId, classId, capacity, className }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const schoolClasses = useSelector((state) => state.schoolClassId.list);
  const { error, success, loading } = useSelector(
    (state) => state.updateSchoolClass
  );

  const [dataLoaded, setDataLoaded] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      studyLevelId: "",
      classId: "",
      name: "",
      capacity: "",
    },
  });

  const watchedValues = watch();
  const { studyLevelId: watchedStudyLevelId, classId: watchedClassId } =
    watchedValues;

  // Load study levels on component mount
  useEffect(() => {
    if (token && !studyLevels?.length) {
      dispatch(fetchStudyLevels(token));
    }
  }, [dispatch, token, studyLevels?.length]);

  // Set initial values after data is loaded
  useEffect(() => {
    if (
      studyLevelId &&
      classId &&
      capacity &&
      className &&
      studyLevels?.length &&
      !dataLoaded
    ) {
      const initialData = {
        studyLevelId: String(studyLevelId),
        classId: String(classId),
        name: className,
        capacity: Number(capacity),
      };

      reset(initialData);
      setDataLoaded(true);

      // Load classes for the selected study level
      dispatch(fetchSchoolClassId({ token, id: studyLevelId }));
    }
  }, [
    studyLevelId,
    classId,
    capacity,
    className,
    studyLevels,
    reset,
    dataLoaded,
    dispatch,
    token,
  ]);

  // Load classes when study level changes
  useEffect(() => {
    if (token && watchedStudyLevelId && watchedStudyLevelId !== studyLevelId) {
      dispatch(fetchSchoolClassId({ token, id: watchedStudyLevelId }));
      // Reset class-related fields
      setValue("classId", "");
      setValue("name", "");
      setValue("capacity", "");
    }
  }, [dispatch, token, watchedStudyLevelId, studyLevelId, setValue]);

  // Auto-fill data when a new class is selected
  useEffect(() => {
    if (watchedClassId && schoolClasses?.length > 0) {
      const selectedClass = schoolClasses.find(
        (cls) => cls.id === Number(watchedClassId)
      );

      if (selectedClass) {
        // Only fill data if it's not the original class or if data is empty
        if (Number(watchedClassId) !== Number(classId) || !watchedValues.name) {
          setValue("name", selectedClass.name);
          setValue("capacity", Number(selectedClass.capacity));
        }
      }
    }
  }, [watchedClassId, schoolClasses, setValue, classId, watchedValues.name]);

  // Clear success/error messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(resetSchoolClassState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleStudyLevelChange = (value, field) => {
    field.onChange(value);
  };

  const handleClassChange = (value, field) => {
    field.onChange(value);
  };

  const onSubmit = (data) => {
    const payload = {
      id: Number(data.classId),
      name: data.name.trim(),
      capacity: Number(data.capacity),
      studyLevelId: Number(data.studyLevelId),
    };

    dispatch(updateSchoolClass({ data: payload, token }));
  };

  const getStudyLevelName = (id) => {
    const level = studyLevels?.find((level) => level.id === Number(id));
    return level?.level || "";
  };

  const getClassName = (id) => {
    const cls = schoolClasses?.find((cls) => cls.id === Number(id));
    return cls?.name || "";
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ p: 2 }}
    >
      <Card sx={{ width: "100%", maxWidth: 500 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 3, color: "primary.main" }}
          >
            Update School Class
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Display current data */}
          {dataLoaded && (
            <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "primary.main", fontSize: "1rem" }}
              >
                Current Data:
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2">
                  <strong>Level:</strong> {getStudyLevelName(studyLevelId)}
                </Typography>
                <Typography variant="body2">
                  <strong>Class:</strong> {getClassName(classId)}
                </Typography>
                <Typography variant="body2">
                  <strong>Name:</strong> {className}
                </Typography>
                <Typography variant="body2">
                  <strong>Capacity:</strong> {capacity}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Success and error messages */}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Study Level Select */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Study Level *</InputLabel>
              <Controller
                name="studyLevelId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Study Level *"
                    onChange={(e) =>
                      handleStudyLevelChange(e.target.value, field)
                    }
                    error={!!errors.studyLevelId}
                  >
                    {studyLevels?.map((level) => (
                      <MenuItem key={level.id} value={level.id}>
                        {level.level}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.studyLevelId && (
                <Typography
                  color="error"
                  variant="caption"
                  sx={{ mt: 1, ml: 1 }}
                >
                  {errors.studyLevelId.message}
                </Typography>
              )}
            </FormControl>

            {/* Class Select */}
            {watchedStudyLevelId && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Class *</InputLabel>
                <Controller
                  name="classId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Class *"
                      onChange={(e) => handleClassChange(e.target.value, field)}
                      error={!!errors.classId}
                    >
                      {schoolClasses
                        ?.filter((cls) => cls.id === Number(classId)) // يعرض بس الفصل الحالي
                        .map((cls) => (
                          <MenuItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />

                {errors.classId && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ mt: 1, ml: 1 }}
                  >
                    {errors.classId.message}
                  </Typography>
                )}
              </FormControl>
            )}

            {/* Class Name Field */}
            {watchedClassId && (
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Class Name *"
                    sx={{ mb: 2 }}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    variant="outlined"
                  />
                )}
              />
            )}

            {/* Capacity Field */}
            {watchedClassId && (
              <Controller
                name="capacity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Capacity *"
                    type="number"
                    inputProps={{ min: 1 }}
                    sx={{ mb: 2 }}
                    error={!!errors.capacity}
                    helperText={errors.capacity?.message}
                    variant="outlined"
                  />
                )}
              />
            )}

            {/* Submit Button */}
            {watchedClassId && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={!isValid || loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                }}
              >
                {loading ? "Updating..." : "Update Class"}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UpdateSchoolClass;
