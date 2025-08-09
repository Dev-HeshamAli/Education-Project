// UpdateSchoolClass.jsx
import React, { useEffect, useState } from "react";
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
    .positive("Capacity must be positive"),
});

const UpdateSchoolClass = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const schoolClasses = useSelector((state) => state.schoolClassId.list);
  const { error, success } = useSelector((state) => state.updateSchoolClass);

  const [selectedStudyLevel, setSelectedStudyLevel] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      studyLevelId: "",
      classId: "",
      name: "",
      capacity: "",
    },
  });

  // Fetch study levels
  useEffect(() => {
    if (token) {
      dispatch(fetchStudyLevels(token));
    }
  }, [dispatch, token]);

  // Fetch school classes when a study level is selected
  useEffect(() => {
    if (token && selectedStudyLevel) {
      dispatch(fetchSchoolClassId({ token, id: selectedStudyLevel }));
    }
  }, [dispatch, token, selectedStudyLevel]);

  // Set selected class info when picked
  useEffect(() => {
    const selectedClass = schoolClasses.find(
      (cls) => cls.id === Number(selectedClassId)
    );
    if (selectedClass) {
      setValue("name", selectedClass.name);
      setValue("capacity", selectedClass.capacity);
    }
  }, [selectedClassId, schoolClasses, setValue]);

  useEffect(() => {
    if (success) {
      setTimeout(() => dispatch(resetSchoolClassState()), 3000);
    } else if (error) {
      setTimeout(() => dispatch(resetSchoolClassState()), 3000);
    }
  }, [success, dispatch, error]);

  const onSubmit = (data) => {
    const payload = {
      id: Number(data.classId),
      name: data.name,
      capacity: Number(data.capacity),
      studyLevelId: Number(data.studyLevelId),
    };
    // console.log("Update Payload:", payload);
    dispatch(updateSchoolClass({ data: payload, token }));
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f9f9f9"
    >
      <Card sx={{ width: 500, p: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" mb={3}>
            Update School Class
          </Typography>

          {success && (
            <Alert severity="success" sx={{ my: 3 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ my: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Study Level Select */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Study Level</InputLabel>
              <Controller
                name="studyLevelId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Study Level"
                    onChange={(e) => {
                      field.onChange(e);
                      setSelectedStudyLevel(e.target.value);
                      setSelectedClassId("");
                      reset({
                        studyLevelId: e.target.value,
                        classId: "",
                        name: "",
                        capacity: "",
                      });
                    }}
                  >
                    {studyLevels.map((level) => (
                      <MenuItem key={level.id} value={level.id}>
                        {level.level}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.studyLevelId && (
                <Typography color="error" variant="caption">
                  {errors.studyLevelId.message}
                </Typography>
              )}
            </FormControl>

            {/* Class Select */}
            {selectedStudyLevel && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Class</InputLabel>
                <Controller
                  name="classId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Class"
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedClassId(e.target.value);
                      }}
                    >
                      {schoolClasses.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.classId && (
                  <Typography color="error" variant="caption">
                    {errors.classId.message}
                  </Typography>
                )}
              </FormControl>
            )}

            {/* Name Input */}
            {selectedClassId && (
              <>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Class Name"
                      sx={{ mb: 2 }}
                    />
                  )}
                />
                {errors.name && (
                  <Typography color="error" variant="caption">
                    {errors.name.message}
                  </Typography>
                )}

                <Controller
                  name="capacity"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Capacity"
                      type="number"
                      sx={{ mb: 2 }}
                    />
                  )}
                />
                {errors.capacity && (
                  <Typography color="error" variant="caption">
                    {errors.capacity.message}
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Update Class
                </Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UpdateSchoolClass;
