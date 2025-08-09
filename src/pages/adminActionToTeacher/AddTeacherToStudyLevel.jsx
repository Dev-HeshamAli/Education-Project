import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Container,
  Autocomplete,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchTeachersByName } from "../../store/shared/teacherByName/actGetTeacherByName";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { useEffect } from "react";
import { addTeacherToStudyLevel } from "../../store/addTeacherToStudyLevel/addTeacherToStudyLevel";
import { clearMessageAddTeacherToStudyLevel } from "../../store/addTeacherToStudyLevel/addTeacherToStudyLevelSlice";
const schema = yup.object().shape({
  name: yup.object().required("Please select a teacher"),
  studyLevel: yup.object().required("Please select a study level"),
});

const AddTeacherToStudyLevel = () => {
  const token = useSelector((state) => state.auth.token);
  const { loading, error, success } = useSelector(
    (state) => state.addTeacherToStudyLevel
  );
  const dispatch = useDispatch();

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: null,
      studyLevel: null,
    },
  });

  const teacherNames = useSelector((state) => state.teacherByName?.list || []);
  const studyLevels = useSelector((state) => state.studyLevelsId.list || []);

  const onSubmit = (data) => {
    if (data.name && data.studyLevel) {
      dispatch(
        addTeacherToStudyLevel({
          teacherId: data.name.id,
          studyLevelId: data.studyLevel.id,
          token,
        })
      );
    }
  };

  useEffect(() => {
    if (success || error) {
      setTimeout(() => {
        dispatch(clearMessageAddTeacherToStudyLevel());
      }, 3000);
    }
    if (success) {
      reset();
    }
  }, [success, error, dispatch, reset]);

  useEffect(() => {
    if (token) {
      dispatch(fetchStudyLevels(token));
    }
  }, [dispatch, token]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography sx={{ mb: 5 }} variant="h5" gutterBottom>
        Add Teacher To Study Level
      </Typography>

      {loading && (
        <Alert sx={{ m: 2 }} severity="info">
          Deleting teacher...
        </Alert>
      )}
      {error && (
        <Alert sx={{ m: 2 }} severity="error">
          {error}
        </Alert>
      )}
      {success && (
        <Alert sx={{ m: 2 }} severity="success">
          {success}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={teacherNames}
              getOptionLabel={(option) => option.name || ""}
              getOptionKey={(option) => option.id}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              onInputChange={(e, value) => {
                if (value && value.length >= 2) {
                  dispatch(fetchTeachersByName({ token, name: value }));
                }
              }}
              onChange={(e, value) => {
                setValue("name", value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search by Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.id}>
                  {option.name}
                </Box>
              )}
            />
          )}
        />

        <Controller
          name="studyLevel"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={studyLevels}
              getOptionLabel={(option) => option.level || ""}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              onChange={(e, value) => {
                setValue("studyLevel", value);
              }}
              renderInput={(params) => (
                <TextField
                  sx={{ mt: 2 }}
                  {...params}
                  label="Select Study Level"
                  error={!!errors.studyLevel}
                  helperText={errors.studyLevel?.message}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.id}>
                  {option.level}
                </Box>
              )}
            />
          )}
        />

        <Button
          disabled={loading}
          startIcon={
            loading && (
              <CircularProgress sx={{ mr: 1 }} size={20} color="inherit" />
            )
          }
          type="submit"
          variant="contained"
          color="primary"
        >
          {loading ? "Loading..." : "Add Teacher to Study Level"}
        </Button>
      </Box>
    </Container>
  );
};

export default AddTeacherToStudyLevel;
