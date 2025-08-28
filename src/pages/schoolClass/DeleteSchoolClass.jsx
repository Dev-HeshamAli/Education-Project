// // UpdateSchoolClass.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Typography,
//   Alert,
// } from "@mui/material";
// import { useForm, Controller } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
// import { fetchSchoolClassId } from "../../store/shared/schoolClass/actGetSchoolClassId";
// import { actDeleteSchoolClass } from "../../store/schoolClass/deleteSchoolClass/actDeleteSchoolClass";
// import { resetDeleteSchoolClassState } from "../../store/schoolClass/deleteSchoolClass/deleteSchoolClassSlice";

// const schema = yup.object().shape({
//   studyLevelId: yup.string().required("Study level is required"),
//   classId: yup.string().required("Class is required"),
// });

// const DeleteSchoolClass = ({ studyLevelId, classId }) => {
//   const dispatch = useDispatch();
//   const { token } = useSelector((state) => state.auth);
//   const studyLevels = useSelector((state) => state.studyLevelsId.list);
//   const schoolClasses = useSelector((state) => state.schoolClassId.list);
//   const { error, success } = useSelector((state) => state.deleteSchoolClass);

//   const [selectedStudyLevel, setSelectedStudyLevel] = useState("");
//   const [selectedClassId, setSelectedClassId] = useState("");

//   const {
//     handleSubmit,
//     control,
//     reset,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       studyLevelId: "",
//       classId: "",
//     },
//   });

//   // Fetch study levels
//   useEffect(() => {
//     if (token) {
//       dispatch(fetchStudyLevels(token));
//     }
//   }, [dispatch, token]);

//   // Fetch school classes when a study level is selected
//   useEffect(() => {
//     if (token && selectedStudyLevel) {
//       dispatch(fetchSchoolClassId({ token, id: selectedStudyLevel }));
//     }
//   }, [dispatch, token, selectedStudyLevel]);

//   // Set selected class info when picked
//   useEffect(() => {
//     const selectedClass = schoolClasses.find(
//       (cls) => cls.id === Number(selectedClassId)
//     );
//     if (selectedClass) {
//       setValue("name", selectedClass.name);
//       setValue("capacity", selectedClass.capacity);
//     }
//   }, [selectedClassId, schoolClasses, setValue]);

//   useEffect(() => {
//     if (success || error) {
//       setTimeout(() => dispatch(resetDeleteSchoolClassState()), 3000);
//     }
//   }, [success, dispatch, error]);

//   const onSubmit = (data) => {
//     const classId = Number(data.classId);
//     dispatch(actDeleteSchoolClass({ id: classId, token }));
//     reset();
//   };

//   return (
//     <Box display="flex" justifyContent="center" alignItems="center">
//       <Card sx={{ width: 500, p: 2 }}>
//         <CardContent>
//           <Typography variant="h5" align="center" mb={3}>
//             Delete School Class
//           </Typography>

//           {success && (
//             <Alert severity="success" sx={{ my: 3 }}>
//               {success}
//             </Alert>
//           )}
//           {error && (
//             <Alert severity="error" sx={{ my: 3 }}>
//               {error}
//             </Alert>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)}>
//             {/* Study Level Select */}
//             <FormControl fullWidth sx={{ mb: 2 }}>
//               <InputLabel>Study Level</InputLabel>
//               <Controller
//                 name="studyLevelId"
//                 control={control}
//                 render={({ field }) => (
//                   <Select
//                     {...field}
//                     label="Study Level"
//                     onChange={(e) => {
//                       field.onChange(e);
//                       setSelectedStudyLevel(e.target.value);
//                       setSelectedClassId("");
//                       setValue("classId", "");
//                     }}
//                   >
//                     {studyLevels.map((level) => (
//                       <MenuItem key={level.id} value={level.id}>
//                         {level.level}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 )}
//               />
//               {errors.studyLevelId && (
//                 <Typography color="error" variant="caption">
//                   {errors.studyLevelId.message}
//                 </Typography>
//               )}
//             </FormControl>

//             {/* Class Select */}
//             {selectedStudyLevel && (
//               <FormControl fullWidth sx={{ mb: 2 }}>
//                 <InputLabel>Class</InputLabel>
//                 <Controller
//                   name="classId"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       {...field}
//                       label="Class"
//                       onChange={(e) => {
//                         field.onChange(e);
//                         setSelectedClassId(e.target.value);
//                       }}
//                     >
//                       {schoolClasses.map((cls) => (
//                         <MenuItem key={cls.id} value={cls.id}>
//                           {cls.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   )}
//                 />
//                 {errors.classId && (
//                   <Typography color="error" variant="caption">
//                     {errors.classId.message}
//                   </Typography>
//                 )}
//               </FormControl>
//             )}

//             <Button type="submit" variant="contained" color="error" fullWidth>
//               Delete Class
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default DeleteSchoolClass;

// DeleteSchoolClass.jsximport React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { actDeleteSchoolClass } from "../../store/schoolClass/deleteSchoolClass/actDeleteSchoolClass";
import { resetDeleteSchoolClassState } from "../../store/schoolClass/deleteSchoolClass/deleteSchoolClassSlice";
import { useEffect } from "react";

const DeleteSchoolClass = ({ studyLevelId, classId, className }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { error, success } = useSelector((state) => state.deleteSchoolClass);

  // نجيب البيانات من الستيت
  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  // const schoolClasses = useSelector((state) => state.schoolClassId.list);

  const studyLevelName =
    studyLevels.find((lvl) => lvl.id === Number(studyLevelId))?.level || "N/A";

  // const className =
  //   schoolClasses.find((cls) => cls.id === Number(classId))?.name || "N/A";

  useEffect(() => {
    if (success || error) {
      setTimeout(() => dispatch(resetDeleteSchoolClassState()), 3000);
    }
  }, [success, error, dispatch]);

  const handleDelete = () => {
    dispatch(actDeleteSchoolClass({ id: classId, token }));
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Card sx={{ width: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" mb={2}>
            Delete School Class
          </Typography>

          <Typography align="center" mb={2}>
            Are you sure you want to delete this class?
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={1}>
            <strong>Study Level:</strong> {studyLevelName}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            <strong>Class:</strong> {className}
          </Typography>

          {success && (
            <Alert severity="success" sx={{ my: 2 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}

          <Box display="flex" justifyContent="center">
            <Button onClick={handleDelete} variant="contained" color="error">
              Delete
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DeleteSchoolClass;
