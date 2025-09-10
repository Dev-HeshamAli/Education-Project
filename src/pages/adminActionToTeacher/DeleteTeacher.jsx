import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Container,
  Autocomplete,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchTeachersByName } from "../../store/shared/teacherByName/actGetTeacherByName";
import { actDeleteTeacher } from "../../store/deleteTeacher/actDeleteTeacher";
import { resetDeleteTeacherState } from "../../store/deleteTeacher/deleteTeacherSlice";
import { useEffect } from "react";
import { actGetInActiveTeacher } from "../../store/deleteTeacher/inActiveTeacher/actGetInActiveTeacher";
import { actActiveTeacher } from "../../store/deleteTeacher/activeTeacher/actActiveTeacher";
import { resetActiveTeacherStates } from "../../store/deleteTeacher/activeTeacher/activeTeacherSlice";

const schema = yup.object().shape({
  name: yup.object().required("Please select a teacher"),
});

const DeleteTeacher = () => {
  const token = useSelector((state) => state.auth.token);
  const { loading, error, success } = useSelector(
    (state) => state.deleteTeacher
  );
  const {
    success: inActiveTeacherSuccess,
    loading: inActiveTeacherLoading,
    error: inActiveTeacherError,
  } = useSelector((state) => state.activeTeacher);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actGetInActiveTeacher(token));
  }, [dispatch, token]);

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
    },
  });

  const teacherNames = useSelector((state) => state.teacherByName?.list || []);

  const inactiveTeachers = useSelector(
    (state) => state.inActiveTeacher.list || []
  );

  const onSubmit = (data) => {
    if (data.name) {
      dispatch(
        actDeleteTeacher({
          token,
          id: data.name.id,
        })
      );
    }
    reset();
  };

  useEffect(() => {
    if (success || error || inActiveTeacherSuccess || inActiveTeacherError) {
      setTimeout(() => {
        dispatch(resetDeleteTeacherState());
        dispatch(resetActiveTeacherStates());
        dispatch(actGetInActiveTeacher(token));
      }, 3000);
    }
  }, [
    success,
    error,
    dispatch,
    inActiveTeacherSuccess,
    token,
    inActiveTeacherError,
  ]);

  const handleActiveTeacher = (id) => {
    if (window.confirm("Are you sure you want to active this teacher?"))
      dispatch(
        actActiveTeacher({
          token: token,
          id: id,
        })
      );
  };
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Delete Teacher
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
      {inActiveTeacherSuccess && (
        <Alert sx={{ m: 2 }} severity="success">
          {inActiveTeacherSuccess}
        </Alert>
      )}
      {inActiveTeacherLoading && (
        <Alert sx={{ m: 2 }} severity="info">
          Loading...
        </Alert>
      )}
      {inActiveTeacherError && (
        <Alert sx={{ m: 2 }} severity="error">
          {inActiveTeacherError}
        </Alert>
      )}

      {/* Form */}
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

        <Button type="submit" variant="contained" color="error">
          Delete Teacher
        </Button>
      </Box>

      {/* جدول المدرسين الغير Active */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Inactive Teachers
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <b>Name</b>
                </TableCell>
                <TableCell align="center">
                  <b>Deleted Time</b>
                </TableCell>
                <TableCell align="center">
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inactiveTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell align="center">{teacher.name}</TableCell>
                  <TableCell align="center">
                    {new Date(teacher.deletedTime).toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleActiveTeacher(teacher.id)}
                    >
                      Active
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {inactiveTeachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No inactive teachers
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default DeleteTeacher;
