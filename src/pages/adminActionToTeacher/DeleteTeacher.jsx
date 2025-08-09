import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Container,
  Autocomplete,
  TextField,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchTeachersByName } from "../../store/shared/teacherByName/actGetTeacherByName";
import { actDeleteTeacher } from "../../store/deleteTeacher/actDeleteTeacher";
import { resetDeleteTeacherState } from "../../store/deleteTeacher/deleteTeacherSlice";
import { useEffect } from "react";
const schema = yup.object().shape({
  name: yup.object().required("Please select a teacher"),
});

const DeleteTeacher = () => {
  const token = useSelector((state) => state.auth.token);
  const { loading, error, success } = useSelector(
    (state) => state.deleteTeacher
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
    },
  });

  const teacherNames = useSelector((state) => state.teacherByName?.list || []);

  const onSubmit = (data) => {
    if (data.name) {
      console.log("Selected Teacher ID:", data.name.id);
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
    if (success || error) {
      setTimeout(() => {
        dispatch(resetDeleteTeacherState());
      }, 3000);
    }
  }, [success, error, dispatch]);

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

        <Button type="submit" variant="contained" color="error">
          Delete Teacher
        </Button>
      </Box>
    </Container>
  );
};

export default DeleteTeacher;
