// import { useEffect, useState } from "react";
// import {
//   Button,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Typography,
//   Paper,
//   Alert,
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
// } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
// import { fetchSchoolClassId } from "../../store/shared/schoolClass/actGetSchoolClassId";

// const schema = yup.object().shape({
//   name: yup.string().required("Schedule name is required"),
// });

// const UpdateSchedule = () => {
//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.auth.token);

//   const [selectedStudyLevel, setSelectedStudyLevel] = useState("");
//   const [editMode, setEditMode] = useState(false);

//   // Delete dialog state
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [scheduleToDelete, setScheduleToDelete] = useState(null);

//   const studyLevels = useSelector((state) => state.studyLevelsId.list);

//   const { control, handleSubmit, reset } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: { name: "", date: "" },
//   });

//   useEffect(() => {
//     dispatch(fetchStudyLevels());
//   }, [dispatch]);

//   useEffect(() => {
//     if (selectedStudyLevel) {
//       dispatch(fetchSchoolClassId({ token, id: selectedStudyLevel }));
//       setEditMode(false);
//     }
//   }, [dispatch, selectedStudyLevel, token]);

//   useEffect(() => {
//     const resetAllStates = () => {
//       reset({ name: "", date: "" });
//       setEditMode(false);
//       setSelectedStudyLevel("");
//     };

//     if (success || deleteSuccess) {
//       resetAllStates();
//     }

//       return () => clearTimeout(timeout);
//     }
//   }, [success, error, deleteSuccess, deleteError, dispatch, reset]);

//   const onSubmit = (data) => {
//     const updatedData = {
//       id: scheduleId,
//       ...data,
//     };
//     dispatch(actUpdateSchedule({ token, data: updatedData }));
//   };

//   const handleConfirmDelete = () => {
//     if (scheduleToDelete) {
//     }
//     setOpenDeleteDialog(false);
//     setScheduleToDelete(null);
//   };

//   const handleCancelDelete = () => {
//     setOpenDeleteDialog(false);
//     setScheduleToDelete(null);
//   };

//   return (
//     <Paper
//       sx={{
//         p: 4,
//         maxWidth: 1000,
//         mx: "auto",
//         borderRadius: 3,
//       }}
//     >
//       <Typography
//         variant="h4"
//         mb={3}
//         textAlign="center"
//         fontWeight="bold"
//         color="primary"
//       >
//         Schedule Management
//       </Typography>

//       {/* Study Level */}
//       <FormControl fullWidth sx={{ mb: 3 }}>
//         <InputLabel>Study Level</InputLabel>
//         <Select
//           value={selectedStudyLevel}
//           onChange={(e) => setSelectedStudyLevel(e.target.value)}
//         >
//           {studyLevels.map((level) => (
//             <MenuItem key={level.id} value={level.id}>
//               {level.level}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//       {/* Edit Form */}
//       {editMode && (
//         <Box
//           component="form"
//           onSubmit={handleSubmit(onSubmit)}
//           sx={{
//             backgroundColor: "#fff",
//             p: 3,
//             borderRadius: 2,
//             boxShadow: 1,
//             mt: 4,
//           }}
//         >
//           <Controller
//             name="name"
//             control={control}
//             render={({ field, fieldState: { error } }) => (
//               <TextField
//                 {...field}
//                 label="Schedule Name"
//                 fullWidth
//                 sx={{ mb: 2 }}
//                 error={!!error}
//                 helperText={error?.message}
//               />
//             )}
//           />
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             size="large"
//             fullWidth
//           >
//             Save Changes
//           </Button>
//         </Box>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this schedule? This action cannot be
//             undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCancelDelete} color="primary">
//             Cancel
//           </Button>
//           <Button
//             onClick={handleConfirmDelete}
//             color="error"
//             variant="contained"
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Paper>
//   );
// };

// export default UpdateSchedule;

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm, Controller } from "react-hook-form";
// import {
//   TextField,
//   MenuItem,
//   Button,
//   Box,
//   Typography,
//   Alert,
// } from "@mui/material";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";

// import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
// import { fetchSemesters } from "../../store/shared/semesters/actGetSemesters";
// import { resetCreateScheduleState } from "../../store/schedule/createScheduleSlice";
// import { fetchAcademicYears } from "../../store/shared/academicYears/actGetAcademicYears";
// import { actUpdateSchedule } from "../../store/schedule/updateSchedule/actUpdateSchedule";
// import { actDeleteSchedule } from "../../store/schedule/deleteSchedule/actDeleteSchedule";

// const validationSchema = yup.object().shape({
//   scheduleName: yup.string().required("Schedule name is required"),
//   studyLevelId: yup.number().required("Study level is required"),
//   semesterId: yup.number().required("Semester is required"),
//   academicYearId: yup.number().required("Academic year is required"),
// });

// const UpdateSchedule = ({
//   studyLevelId,
//   academicYearId,
//   semesterId,
//   name,
//   action,
// }) => {
//   const dispatch = useDispatch();
//   const { scheduleId } = useSelector((state) => state.selectionIds);

//   const { control, handleSubmit, reset } = useForm({
//     resolver: yupResolver(validationSchema),
//     defaultValues: {
//       scheduleName: "",
//       studyLevelId: "",
//       semesterId: "",
//       academicYearId: "",
//     },
//   });

//   // Get data from Redux store
//   const studyLevels = useSelector((state) => state.studyLevelsId.list);
//   const semesters = useSelector((state) => state.semestersId.list);
//   const academicYears = useSelector((state) => state.academicYearsId.list);

//   const {
//     error: deleteError,
//     loading: deleteLoading,
//     success: deleteSuccess,
//   } = useSelector((state) => state.deleteSchedule);
//   const { error, loading, success } = useSelector(
//     (state) => state.updateSchedule
//   );

//   const token = useSelector((state) => state.auth.token);

//   useEffect(() => {
//     dispatch(fetchStudyLevels(token));
//     dispatch(fetchSemesters(token));
//     dispatch(fetchAcademicYears(token));
//   }, [dispatch, token]);

//   useEffect(() => {
//     reset((prev) => ({
//       ...prev,
//       scheduleName: name || "",
//       studyLevelId: studyLevelId || "",
//       semesterId: semesterId || "",
//       academicYearId: academicYearId || "",
//     }));
//   }, [studyLevelId, semesterId, academicYearId, reset, name]);

//   // ✅ Update Action
//   const onUpdate = (data) => {
//     const scheduleData = {
//       id: scheduleId,
//       name: data.scheduleName,
//       academicYearId: data.academicYearId,
//       semesterId: data.semesterId,
//       studyLevelId: data.studyLevelId,
//     };
//     dispatch(actUpdateSchedule({ token, data: scheduleData }));
//   };

//   // ✅ Delete Action
//   const onDelete = () => {
//     dispatch(actDeleteSchedule({ token, id: scheduleId }));
//   };

//   useEffect(() => {
//     if (success || error) {
//       setTimeout(() => {
//         dispatch(resetCreateScheduleState());
//         reset({
//           scheduleName: "",
//           studyLevelId,
//           semesterId,
//           academicYearId,
//         });
//       }, 3000);
//     }
//   }, [
//     success,
//     error,
//     dispatch,
//     reset,
//     studyLevelId,
//     semesterId,
//     academicYearId,
//     name,
//   ]);

//   return (
//     <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
//       <Typography variant="h5" gutterBottom>
//         {action === "update" ? "Update" : "Delete "} Schedule
//       </Typography>

//       {/* Delete Schedule Alerts */}
//       {deleteError && (
//         <Alert sx={{ m: 3 }} severity="error">
//           {deleteError}
//         </Alert>
//       )}
//       {deleteLoading && (
//         <Alert sx={{ m: 3 }} severity="info">
//           Loading...
//         </Alert>
//       )}
//       {deleteSuccess && (
//         <Alert sx={{ m: 3 }} severity="success">
//           {deleteSuccess}
//         </Alert>
//       )}

//       {/* Update Alerts */}
//       {error && (
//         <Alert sx={{ m: 3 }} severity="error">
//           {error}
//         </Alert>
//       )}
//       {loading && (
//         <Alert sx={{ m: 3 }} severity="info">
//           Loading...
//         </Alert>
//       )}
//       {success && (
//         <Alert sx={{ m: 3 }} severity="success">
//           {success}
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit(action === "update" ? onUpdate : onDelete)}>
//         {/* Schedule Name */}
//         <Controller
//           name="scheduleName"
//           control={control}
//           render={({ field, fieldState: { error } }) => (
//             <TextField
//               {...field}
//               label="Schedule Name"
//               fullWidth
//               margin="normal"
//               error={!!error}
//               helperText={error?.message}
//               placeholder="e.g., Schedule Pr1-CA1"
//             />
//           )}
//         />

//         {/* Study Level */}
//         <Controller
//           name="studyLevelId"
//           control={control}
//           render={({ field, fieldState: { error } }) => (
//             <TextField
//               {...field}
//               select
//               label="Study Level"
//               fullWidth
//               margin="normal"
//               error={!!error}
//               helperText={error?.message}
//             >
//               {studyLevels.map((level) => (
//                 <MenuItem key={level.id} value={level.id}>
//                   {level.level}
//                 </MenuItem>
//               ))}
//             </TextField>
//           )}
//         />

//         {/* Semester */}
//         <Controller
//           name="semesterId"
//           control={control}
//           render={({ field, fieldState: { error } }) => (
//             <TextField
//               {...field}
//               select
//               label="Semester"
//               fullWidth
//               margin="normal"
//               error={!!error}
//               helperText={error?.message}
//             >
//               {semesters.map((semester) => (
//                 <MenuItem key={semester.id} value={semester.id}>
//                   {semester.name}
//                 </MenuItem>
//               ))}
//             </TextField>
//           )}
//         />

//         {/* Academic Year */}
//         <Controller
//           name="academicYearId"
//           control={control}
//           render={({ field, fieldState: { error } }) => (
//             <TextField
//               {...field}
//               select
//               label="Academic Year"
//               fullWidth
//               margin="normal"
//               error={!!error}
//               helperText={error?.message}
//             >
//               {academicYears.map((year) => (
//                 <MenuItem key={year.id} value={year.id}>
//                   {year.date}
//                 </MenuItem>
//               ))}
//             </TextField>
//           )}
//         />

//         {/* Submit Button */}
//         <Box sx={{ mt: 3 }}>
//           <Button
//             type="submit"
//             variant="contained"
//             size="large"
//             fullWidth
//             onClick={handleSubmit(action === "update" ? onUpdate : onDelete)}
//             color={action === "delete" ? "error" : "primary"}
//           >
//             {action === "update" ? "Update" : "Delete"} Schedule
//           </Button>
//         </Box>
//       </form>
//     </Box>
//   );
// };

// export default UpdateSchedule;

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchSemesters } from "../../store/shared/semesters/actGetSemesters";
import { fetchAcademicYears } from "../../store/shared/academicYears/actGetAcademicYears";
import { actUpdateSchedule } from "../../store/schedule/updateSchedule/actUpdateSchedule";
import { actDeleteSchedule } from "../../store/schedule/deleteSchedule/actDeleteSchedule";
import { resetUpdateScheduleState } from "../../store/schedule/updateSchedule/updateScheduleSlice";
import { resetDeleteScheduleState } from "../../store/schedule/deleteSchedule/deleteScheduleSlice";

const validationSchema = yup.object().shape({
  scheduleName: yup.string().required("Schedule name is required"),
  studyLevelId: yup.number().required("Study level is required"),
  semesterId: yup.number().required("Semester is required"),
  academicYearId: yup.number().required("Academic year is required"),
});

const UpdateSchedule = ({
  studyLevelId,
  academicYearId,
  semesterId,
  name,
  action = "update", // إضافة قيمة افتراضية
}) => {
  const dispatch = useDispatch();
  const { scheduleId } = useSelector((state) => state.selectionIds);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      scheduleName: name || "",
      studyLevelId: studyLevelId || "",
      semesterId: semesterId || "",
      academicYearId: academicYearId || "",
    },
  });

  // Get data from Redux store
  const studyLevels = useSelector((state) => state.studyLevelsId?.list || []);
  const semesters = useSelector((state) => state.semestersId?.list || []);
  const academicYears = useSelector(
    (state) => state.academicYearsId?.list || []
  );

  const {
    error: deleteError,
    loading: deleteLoading,
    success: deleteSuccess,
  } = useSelector((state) => state.deleteSchedule || {});

  const {
    error: updateError,
    loading: updateLoading,
    success: updateSuccess,
  } = useSelector((state) => state.updateSchedule || {});

  const token = useSelector((state) => state.auth?.token);

  // Fetch initial data
  useEffect(() => {
    if (token) {
      dispatch(fetchStudyLevels(token));
      dispatch(fetchSemesters(token));
      dispatch(fetchAcademicYears(token));
    }
  }, [dispatch, token]);

  // Update form when props change
  useEffect(() => {
    reset({
      scheduleName: name || "",
      studyLevelId: studyLevelId || "",
      semesterId: semesterId || "",
      academicYearId: academicYearId || "",
    });
  }, [studyLevelId, semesterId, academicYearId, name, reset]);

  // Handle update action
  const onUpdate = useCallback(
    (data) => {
      if (!scheduleId) {
        console.error("Schedule ID is missing");
        return;
      }

      const scheduleData = {
        id: scheduleId,
        name: data.scheduleName,
        academicYearId: Number(data.academicYearId),
        semesterId: Number(data.semesterId),
        studyLevelId: Number(data.studyLevelId),
      };

      dispatch(actUpdateSchedule({ token, data: scheduleData }));
    },
    [scheduleId, token, dispatch]
  );

  // Handle delete action
  const onDelete = useCallback(
    (e) => {
      e.preventDefault();

      if (!scheduleId) {
        return;
      }

      dispatch(actDeleteSchedule({ token, id: scheduleId }));
    },
    [scheduleId, token, dispatch]
  );

  // Reset state after success/error
  useEffect(() => {
    if (updateSuccess || updateError || deleteSuccess || deleteError) {
      const timer = setTimeout(() => {
        dispatch(resetUpdateScheduleState());
        dispatch(resetDeleteScheduleState());
        reset({
          scheduleName: "",
          studyLevelId: "",
          semesterId: "",
          academicYearId: "",
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [
    updateSuccess,
    updateError,
    deleteSuccess,
    deleteError,
    dispatch,
    reset,
    studyLevelId,
    semesterId,
    academicYearId,
  ]);

  // Loading state
  const isLoading = updateLoading || deleteLoading;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {action === "update" ? "Update" : "Delete"} Schedule
      </Typography>

      {/* Error and Success Alerts */}
      {deleteError && (
        <Alert sx={{ mb: 2 }} severity="error">
          Delete Error: {deleteError}
        </Alert>
      )}
      {deleteSuccess && (
        <Alert sx={{ mb: 2 }} severity="success">
          {deleteSuccess}
        </Alert>
      )}
      {updateError && (
        <Alert sx={{ mb: 2 }} severity="error">
          Update Error: {updateError}
        </Alert>
      )}
      {updateSuccess && (
        <Alert sx={{ mb: 2 }} severity="success">
          {updateSuccess}
        </Alert>
      )}
      {isLoading && (
        <Alert sx={{ mb: 2 }} severity="info">
          Loading...
        </Alert>
      )}

      {/* Form for Update */}
      {action === "update" && (
        <form onSubmit={handleSubmit(onUpdate)}>
          {/* Schedule Name */}
          <Controller
            name="scheduleName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Schedule Name"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
                placeholder="e.g., Schedule Pr1-CA1"
                disabled={isLoading}
              />
            )}
          />

          {/* Study Level */}
          <Controller
            name="studyLevelId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                select
                label="Study Level"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
                disabled={isLoading}
              >
                <MenuItem value="">
                  <em>Select Study Level</em>
                </MenuItem>
                {studyLevels.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.level}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Semester */}
          <Controller
            name="semesterId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                select
                label="Semester"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
                disabled={isLoading}
              >
                <MenuItem value="">
                  <em>Select Semester</em>
                </MenuItem>
                {semesters.map((semester) => (
                  <MenuItem key={semester.id} value={semester.id}>
                    {semester.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Academic Year */}
          <Controller
            name="academicYearId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                select
                label="Academic Year"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
                disabled={isLoading}
              >
                <MenuItem value="">
                  <em>Select Academic Year</em>
                </MenuItem>
                {academicYears.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.date}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Submit Button */}
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isLoading}
              color="primary"
            >
              {updateLoading ? "Updating..." : "Update Schedule"}
            </Button>
          </Box>
        </form>
      )}

      {/* Delete Action */}
      {action === "delete" && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the schedule:{" "}
            <strong>{name}</strong>?
          </Typography>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={onDelete}
            disabled={isLoading}
            color="error"
          >
            {deleteLoading ? "Deleting..." : "Delete Schedule"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UpdateSchedule;
