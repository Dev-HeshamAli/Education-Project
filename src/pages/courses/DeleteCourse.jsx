import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Box,
} from "@mui/material";
import Alert from "@mui/material/Alert";

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchCoursesStudyLevels } from "../../store/shared/coursesStudyLevel/actGetCoursesStudyLevel";
import { actDeleteCourse } from "../../store/courses/deleteCourse/actDeleteCourse";
import { resetDeleteStatus } from "../../store/courses/deleteCourse/deleteCourseSlice";

// ✅ Yup validation schema
const schema = yup.object().shape({
  selectedCourse: yup.string().required("Please select a course"),
  studyLevelId: yup.string().required("Please select a study level"),
});

const DeleteCourse = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { success, error } = useSelector((state) => state.deleteCourse);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      selectedCourse: "",
      studyLevelId: "",
    },
    resolver: yupResolver(schema),
  });

  // ✅ جلب study levels
  useEffect(() => {
    if (token) {
      dispatch(fetchStudyLevels(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(resetDeleteStatus());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const studyLevels = useSelector((state) => state.studyLevelsId.list);

  // ✅ جلب الكورسات عند وجود studyLevels
  useEffect(() => {
    if (token && studyLevels.length > 0) {
      const firstStudyLevelId = studyLevels[0].id;
      dispatch(fetchCoursesStudyLevels({ token, id: firstStudyLevelId }));
    }
  }, [dispatch, token, studyLevels]);

  const courses = useSelector((state) => state.coursesStudyLevelsId.list);

  const onSubmit = (data) => {
    dispatch(actDeleteCourse({ token, id: data.selectedCourse }));
    reset();
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Delete Course
      </Typography>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Course deleted successfully!
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error deleting course: {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Study Level Select */}
        <FormControl fullWidth margin="normal" error={!!errors.studyLevelId}>
          <InputLabel>Choose Study Level</InputLabel>
          <Controller
            name="studyLevelId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Choose Study Level"
                onChange={(e) => {
                  const selectedLevelId = e.target.value;
                  field.onChange(selectedLevelId); // Update form state
                  dispatch(
                    fetchCoursesStudyLevels({ token, id: selectedLevelId })
                  ); // Fetch courses for selected level
                }}
              >
                {studyLevels?.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.level || `Level ${level.id}`}
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
        <FormControl fullWidth margin="normal" error={!!errors.selectedCourse}>
          <InputLabel>Choose Course</InputLabel>
          <Controller
            name="selectedCourse"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Choose Course">
                {courses?.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name || `Course ${course.id}`}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.selectedCourse && (
            <Typography color="error" variant="body2">
              {errors.selectedCourse.message}
            </Typography>
          )}
        </FormControl>

        <Button variant="contained" color="error" fullWidth type="submit">
          Delete Course
        </Button>
      </form>
    </Box>
  );
};

export default DeleteCourse;

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Button,
//   Typography,
//   Box,
// } from "@mui/material";
// import { useForm, Controller } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
// import { fetchCoursesStudyLevels } from "../../store/shared/coursesStudyLevel/actGetCoursesStudyLevel";
// import { actDeleteCourse } from "../../store/courses/deleteCourse/actDeleteCourse";
// import { resetDeleteStatus } from "../../store/courses/deleteCourse/deleteCourseSlice";

// const schema = yup.object().shape({
//   selectedStudyLevel: yup.string().required("Please select a study level"),
//   selectedCourse: yup.string().required("Please select a course"),
// });

// const DeleteCourse = () => {
//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.auth.token);
//   const { success, error } = useSelector((state) => state.deleteCourse);

//   const {
//     handleSubmit,
//     control,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       selectedStudyLevel: "",
//       selectedCourse: "",
//     },
//     resolver: yupResolver(schema),
//   });

//   const studyLevels = useSelector((state) => state.studyLevelsId.list);
//   const courses = useSelector((state) => state.coursesStudyLevelsId.list);

//   const selectedStudyLevel = watch("selectedStudyLevel");

//   // ✅ جلب study levels
//   useEffect(() => {
//     if (token) {
//       dispatch(fetchStudyLevels(token));
//     }
//   }, [dispatch, token]);

//   // ✅ عند تغيير المستوى الدراسي، يتم جلب الكورسات
//   useEffect(() => {
//     if (token && selectedStudyLevel) {
//       dispatch(fetchCoursesStudyLevels({ token, id: selectedStudyLevel }));
//       setValue("selectedCourse", ""); // تصفير الكورس المختار
//     }
//   }, [dispatch, token, selectedStudyLevel, setValue]);

//   // ✅ إخفاء الرسائل بعد وقت
//   useEffect(() => {
//     if (success || error) {
//       const timer = setTimeout(() => {
//         dispatch(resetDeleteStatus());
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [success, error, dispatch]);

//   const onSubmit = (data) => {
//     dispatch(actDeleteCourse({ token, id: data.selectedCourse }));
//   };

//   return (
//     <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
//       <Typography variant="h5" mb={2}>
//         Delete Course
//       </Typography>

//       {success && (
//         <Typography color="success.main" mb={2}>
//           Course deleted successfully!
//         </Typography>
//       )}
//       {error && (
//         <Typography color="error.main" mb={2}>
//           Error deleting course: {error}
//         </Typography>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} noValidate>
//         {/* 🟡 اختيار المستوى الدراسي */}
//         <FormControl
//           fullWidth
//           margin="normal"
//           error={!!errors.selectedStudyLevel}
//         >
//           <InputLabel>Choose Study Level</InputLabel>
//           <Controller
//             name="selectedStudyLevel"
//             control={control}
//             render={({ field }) => (
//               <Select {...field} label="Choose Study Level">
//                 {studyLevels?.map((level) => (
//                   <MenuItem key={level.id} value={level.id}>
//                     {level.level || `Level ${level.id}`}
//                   </MenuItem>
//                 ))}
//               </Select>
//             )}
//           />
//           {errors.selectedStudyLevel && (
//             <Typography color="error" variant="body2">
//               {errors.selectedStudyLevel.message}
//             </Typography>
//           )}
//         </FormControl>

//         {/* 🟡 اختيار الكورس */}
//         <FormControl fullWidth margin="normal" error={!!errors.selectedCourse}>
//           <InputLabel>Choose Course</InputLabel>
//           <Controller
//             name="selectedCourse"
//             control={control}
//             render={({ field }) => (
//               <Select {...field} label="Choose Course">
//                 {courses?.map((course) => (
//                   <MenuItem key={course.id} value={course.id}>
//                     {course.name || `Course ${course.id}`}
//                   </MenuItem>
//                 ))}
//               </Select>
//             )}
//           />
//           {errors.selectedCourse && (
//             <Typography color="error" variant="body2">
//               {errors.selectedCourse.message}
//             </Typography>
//           )}
//         </FormControl>

//         <Button variant="contained" color="error" fullWidth type="submit">
//           Delete Course
//         </Button>
//       </form>
//     </Box>
//   );
// };

// export default DeleteCourse;
