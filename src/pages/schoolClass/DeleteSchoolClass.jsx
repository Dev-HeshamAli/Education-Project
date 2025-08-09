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
  Typography,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchSchoolClassId } from "../../store/shared/schoolClass/actGetSchoolClassId";
import { actDeleteSchoolClass } from "../../store/schoolClass/deleteSchoolClass/actDeleteSchoolClass";
import { resetDeleteSchoolClassState } from "../../store/schoolClass/deleteSchoolClass/deleteSchoolClassSlice";

const schema = yup.object().shape({
  studyLevelId: yup.string().required("Study level is required"),
  classId: yup.string().required("Class is required"),
});

const DeleteSchoolClass = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const schoolClasses = useSelector((state) => state.schoolClassId.list);
  const { error, success } = useSelector((state) => state.deleteSchoolClass);

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
    if (success || error) {
      setTimeout(() => dispatch(resetDeleteSchoolClassState()), 3000);
    }
  }, [success, dispatch, error]);

  const onSubmit = (data) => {
    const classId = Number(data.classId);
    dispatch(actDeleteSchoolClass({ id: classId, token }));
    reset();
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
            Delete School Class
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
                      setValue("classId", "");
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

            <Button type="submit" variant="contained" color="error" fullWidth>
              Delete Class
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DeleteSchoolClass;
