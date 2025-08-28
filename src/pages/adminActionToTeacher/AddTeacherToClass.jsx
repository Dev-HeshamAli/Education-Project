// import { useEffect } from "react";
// import {
//   Box,
//   Button,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Typography,
//   Alert,
//   Autocomplete,
//   TextField,
// } from "@mui/material";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
// import { fetchSchoolClassId } from "../../store/shared/schoolClass/actGetSchoolClassId";

// import { fetchTeachersByStudyLevel } from "../../store/shared/teacherByStudyLevel/actGetTeacherByStudyLevel";
// // import { actAddTeacherToCourse } from "../../store/addTeacherToCourse/actAddTeacherToCourse";
// // import { clearMessageAddTeacherToCourse } from "../../store/addTeacherToCourse/addTeacherToCourseSlice";
// import { fetchTeachersByName } from "../../store/shared/teacherByName/actGetTeacherByName";
// import { actAddTeacherToClass } from "../../store/addTeacherToClass/actAddTeacherToClass";
// import { clearMessageAddTeacherToClass } from "../../store/addTeacherToClass/addTeacherToClassSlice";
// const schema = yup.object().shape({
//   studyLevel: yup.string().required("Study level is required"),
//   teacherId: yup.string().required("Teacher is required"),
//   classId: yup.string().required("Course is required"),
// });

// const AddTeachToClass = () => {
//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.auth.token);
//   const { loading, success, error } = useSelector(
//     (state) => state.addTeacherToClass
//   );

//   const {
//     control,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       studyLevel: "",
//       teacherId: "",
//       classId: "",
//       name: null,
//     },
//   });

//   const selectedStudyLevel = watch("studyLevel");

//   // Fetch study levels on mount
//   useEffect(() => {
//     if (token) {
//       dispatch(fetchStudyLevels(token));
//     }
//   }, [dispatch, token]);

//   const studyLevels = useSelector((state) => state.studyLevelsId.list);

//   // Fetch teachers and courses when study level is selected
//   useEffect(() => {
//     if (selectedStudyLevel && token) {
//       dispatch(fetchSchoolClassId({ token, id: selectedStudyLevel }));
//       dispatch(fetchTeachersByStudyLevel({ token, id: selectedStudyLevel }));
//     }
//   }, [selectedStudyLevel, dispatch, token]);

//   // const teachers = useSelector((state) => state.teacherByStudyLevel.list);
//   const schoolClassId = useSelector((state) => state.schoolClassId.list);
//   const teacherNames = useSelector((state) => state.teacherByName?.list || []);

//   const onSubmit = (data) => {
//     console.log("Form Data:", data);

//     dispatch(
//       actAddTeacherToClass({
//         teacherId: data.teacherId,
//         classId: data.classId,
//         token,
//       })
//     );
//   };

//   useEffect(() => {
//     if (success || error) {
//       const timer = setTimeout(() => {
//         dispatch(clearMessageAddTeacherToClass());
//         reset();
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [success, error, dispatch, reset]);

//   return (
//     <Box
//       sx={{
//         maxWidth: 500,
//         mx: "auto",
//         mt: 5,
//         display: "flex",
//         flexDirection: "column",
//         gap: 3,
//       }}
//     >
//       <Typography variant="h5" fontWeight={600}>
//         Assign Teacher to Class
//       </Typography>

//       {loading && (
//         <Alert sx={{ my: 2 }} severity="info">
//           {loading}
//         </Alert>
//       )}
//       {success && (
//         <Alert sx={{ my: 2 }} severity="success">
//           {success}
//         </Alert>
//       )}
//       {error && (
//         <Alert sx={{ my: 2 }} severity="error">
//           {error}
//         </Alert>
//       )}

//       {/* select teacher BY study level*/}
//       {/* Select Teacher */}
//       {/* <Controller
//         name="teacherId"
//         control={control}
//         render={({ field }) => (
//           <FormControl fullWidth error={!!errors.teacherId}>
//             <InputLabel>Teacher</InputLabel>
//             <Select {...field} label="Teacher">
//               {teachers?.map((teacher) => (
//                 <MenuItem key={teacher.id} value={teacher.id}>
//                   {teacher.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         )}
//       /> */}

//       <Controller
//         name="name"
//         control={control}
//         render={({ field }) => (
//           <Autocomplete
//             options={teacherNames}
//             getOptionLabel={(option) => option?.name || ""}
//             isOptionEqualToValue={(option, value) => option.id === value?.id}
//             onInputChange={(e, value) => {
//               if (value && value.length >= 2) {
//                 dispatch(fetchTeachersByName({ token, name: value }));
//               }
//             }}
//             value={field.value || null}
//             onChange={(e, value) => {
//               field.onChange(value); // store whole object in `name`
//               setValue("teacherId", value?.id || ""); // store id in `teacherId`
//             }}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Search by Name"
//                 error={!!errors.name}
//                 helperText={errors.name?.message}
//               />
//             )}
//             renderOption={(props, option) => (
//               <Box component="li" {...props} key={option.id}>
//                 {option.name}
//               </Box>
//             )}
//           />
//         )}
//       />

//       {/* Select Study Level */}
//       <Controller
//         name="studyLevel"
//         control={control}
//         render={({ field }) => (
//           <FormControl fullWidth error={!!errors.studyLevel}>
//             <InputLabel>Study Level</InputLabel>
//             <Select {...field} label="Study Level">
//               <MenuItem value="">Select a study level</MenuItem>
//               {studyLevels?.map((level) => (
//                 <MenuItem key={level.id} value={level.id}>
//                   {level.level}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         )}
//       />
//       <Controller
//         name="classId"
//         control={control}
//         render={({ field }) => {
//           const validCourseIds = schoolClassId.map((c) => String(c.id));
//           const currentValue = validCourseIds.includes(String(field.value))
//             ? field.value
//             : "";

//           return (
//             <FormControl fullWidth error={!!errors.classId}>
//               <InputLabel>Class</InputLabel>
//               <Select
//                 {...field}
//                 value={currentValue}
//                 onChange={(e) => field.onChange(e.target.value)}
//                 label="Class"
//               >
//                 <MenuItem value="">Select a class</MenuItem>
//                 {schoolClassId?.map((course) => (
//                   <MenuItem key={course.id} value={course.id}>
//                     {course.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//               {errors.classId && (
//                 <Typography variant="caption" color="error">
//                   {errors.classId.message}
//                 </Typography>
//               )}
//             </FormControl>
//           );
//         }}
//       />

//       <Button variant="contained" onClick={handleSubmit(onSubmit)}>
//         Submit
//       </Button>
//     </Box>
//   );
// };

// export default AddTeachToClass;
