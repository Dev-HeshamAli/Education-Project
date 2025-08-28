/* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Button,
//   MenuItem,
//   Select,
//   Typography,
//   InputLabel,
//   FormControl,
//   Alert,
// } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
// import { fetchSchoolClassId } from "../../store/shared/schoolClass/actGetSchoolClassId"; // تأكد من المسار
// import { actGetStudentIdByClass } from "../../store/shared/studentIdByClass/actGetStudentIdByClass"; // تأكد من المسار

// const AddStudentToSchoolClass = () => {
//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.auth.token);

//   // State للتحكم في الاختيارات
//   const [selectedStudyLevel, setSelectedStudyLevel] = useState('');
//   const [selectedCurrentClass, setSelectedCurrentClass] = useState('');
//   const [selectedStudent, setSelectedStudent] = useState('');
//   const [selectedNewClass, setSelectedNewClass] = useState('');

//   // Selectors
//   const studyLevels = useSelector((state) => state.studyLevelsId.list);
//   const schoolClasses = useSelector((state) => state.schoolClassId.list);
//   const userData = useSelector((state) => state.studentIdByClass.list);

//   // Fetch study levels عند تحميل المكون
//   useEffect(() => {
//     if (token) {
//       dispatch(fetchStudyLevels(token));
//     }
//   }, [dispatch, token]);

//   // Fetch school classes when a study level is selected
//   useEffect(() => {
//     if (token && selectedStudyLevel) {
//       dispatch(fetchSchoolClassId({ token, id: selectedStudyLevel }));
//       // Reset selections when study level changes
//       setSelectedCurrentClass('');
//       setSelectedStudent('');
//       setSelectedNewClass('');
//     }
//   }, [dispatch, token, selectedStudyLevel]);

//   // Fetch students when a class is selected
//   useEffect(() => {
//     if (token && selectedCurrentClass) {
//       dispatch(actGetStudentIdByClass({ token, id: selectedCurrentClass }));
//       // Reset student and new class selections
//       setSelectedStudent('');
//       setSelectedNewClass('');
//     }
//   }, [dispatch, token, selectedCurrentClass]);

//   // Handle form submission
//   const handleTransferStudent = () => {
//     if (selectedStudent && selectedNewClass) {
//       console.log('Student ID:', selectedStudent);
//       console.log('New Class ID:', selectedNewClass);

//       // هنا هنضيف الـ API call لاحقاً
//       // dispatch(transferStudent({ studentId: selectedStudent, newClassId: selectedNewClass, token }));
//     } else {
//       alert('Please select both student and new class');
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3 }}>
//       <Typography variant="h5" gutterBottom>
//         Transfer Student to Another Class
//       </Typography>

//       {/* اختيار السنة الدراسية */}
//       <FormControl fullWidth margin="normal">
//         <InputLabel>Study Level</InputLabel>
//         <Select
//           value={selectedStudyLevel}
//           onChange={(e) => setSelectedStudyLevel(e.target.value)}
//           label="Study Level"
//         >
//           {studyLevels?.map((level) => (
//             <MenuItem key={level.id} value={level.id}>
//               {level.level}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {/* اختيار الفصل الحالي */}
//       {selectedStudyLevel && (
//         <FormControl fullWidth margin="normal">
//           <InputLabel>Current Class</InputLabel>
//           <Select
//             value={selectedCurrentClass}
//             onChange={(e) => setSelectedCurrentClass(e.target.value)}
//             label="Current Class"
//           >
//             {schoolClasses?.map((schoolClass) => (
//               <MenuItem key={schoolClass.id} value={schoolClass.id}>
//                 {schoolClass.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       )}

//       {/* اختيار الطالب */}
//       {selectedCurrentClass && userData?.length > 0 && (
//         <FormControl fullWidth margin="normal">
//           <InputLabel>Select Student</InputLabel>
//           <Select
//             value={selectedStudent}
//             onChange={(e) => setSelectedStudent(e.target.value)}
//             label="Select Student"
//           >
//             {userData?.map((student) => (
//               <MenuItem key={student.id} value={student.id}>
//                 {student.name} {/* أو أي property تاني للاسم */}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       )}

//       {/* اختيار الفصل الجديد */}
//       {selectedStudent && (
//         <FormControl fullWidth margin="normal">
//           <InputLabel>New Class</InputLabel>
//           <Select
//             value={selectedNewClass}
//             onChange={(e) => setSelectedNewClass(e.target.value)}
//             label="New Class"
//           >
//             {schoolClasses?.map((schoolClass) => (
//               <MenuItem key={schoolClass.id} value={schoolClass.id}>
//                 {schoolClass.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       )}

//       {/* زر التحويل */}
//       {selectedStudent && selectedNewClass && (
//         <Button
//           variant="contained"
//           fullWidth
//           sx={{ mt: 3 }}
//           onClick={handleTransferStudent}
//         >
//           Transfer Student
//         </Button>
//       )}

//       {/* رسائل تنبيه */}
//       {selectedCurrentClass && (!userData || userData.length === 0) && (
//         <Alert severity="info" sx={{ mt: 2 }}>
//           No students found in this class
//         </Alert>
//       )}
//     </Box>
//   );
// };

// export default AddStudentToSchoolClass;

import React, { useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchSchoolClassId } from "../../store/shared/schoolClass/actGetSchoolClassId"; // تأكد من المسار
import { actGetStudentIdByClass } from "../../store/shared/studentIdByClass/actGetStudentIdByClass"; // تأكد من المسار

// Yup validation schema
const schema = yup.object().shape({
  studyLevelId: yup.number().required("Study level is required"),
  currentClassId: yup.number().required("Current class is required"),
  studentId: yup.number().required("Student selection is required"),
  newClassId: yup.number().required("New class is required"),
});

const AddStudentToSchoolClass = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // Selectors
  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const schoolClasses = useSelector((state) => state.schoolClassId.list);
  const userData = useSelector((state) => state.studentIdByClass.list);

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      studyLevelId: "",
      currentClassId: "",
      studentId: "",
      newClassId: "",
    },
  });

  // Watch form values
  const watchedStudyLevel = watch("studyLevelId");
  const watchedCurrentClass = watch("currentClassId");
  const watchedStudent = watch("studentId");

  // Fetch study levels عند تحميل المكون
  useEffect(() => {
    if (token) {
      dispatch(fetchStudyLevels(token));
    }
  }, [dispatch, token]);

  // Fetch school classes when a study level is selected
  useEffect(() => {
    if (token && watchedStudyLevel) {
      dispatch(fetchSchoolClassId({ token, id: watchedStudyLevel }));
    }
  }, [dispatch, token, watchedStudyLevel]);

  // Fetch students when a class is selected
  useEffect(() => {
    if (token && watchedCurrentClass) {
      dispatch(actGetStudentIdByClass({ token, id: watchedCurrentClass }));
    }
  }, [dispatch, token, watchedCurrentClass]);

  // Handle form submission
  const onSubmit = (data) => {
    // console.log("Student ID:", data.studentId);
    // console.log("New Class ID:", data.newClassId);

    // هنا هنضيف الـ API call لاحقاً
    // dispatch(transferStudent({ studentId: data.studentId, newClassId: data.newClassId, token }));

    // Reset form after submission
    reset();
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Transfer Student to Another Class
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* اختيار السنة الدراسية */}
        <Controller
          name="studyLevelId"
          control={control}
          render={({ field }) => (
            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.studyLevelId}
            >
              <InputLabel>Study Level</InputLabel>
              <Select {...field} label="Study Level">
                {studyLevels?.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.level}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="error">
                {errors.studyLevelId?.message}
              </Typography>
            </FormControl>
          )}
        />

        {/* اختيار الفصل الحالي */}
        {watchedStudyLevel && (
          <Controller
            name="currentClassId"
            control={control}
            render={({ field }) => (
              <FormControl
                fullWidth
                margin="normal"
                error={!!errors.currentClassId}
              >
                <InputLabel>Current Class</InputLabel>
                <Select {...field} label="Current Class">
                  {schoolClasses?.map((schoolClass) => (
                    <MenuItem key={schoolClass.id} value={schoolClass.id}>
                      {schoolClass.name}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="error">
                  {errors.currentClassId?.message}
                </Typography>
              </FormControl>
            )}
          />
        )}

        {/* اختيار الطالب */}
        {watchedCurrentClass && userData?.length > 0 && (
          <Controller
            name="studentId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.studentId}>
                <InputLabel>Select Student</InputLabel>
                <Select {...field} label="Select Student">
                  {userData?.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name} {/* أو أي property تاني للاسم */}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="error">
                  {errors.studentId?.message}
                </Typography>
              </FormControl>
            )}
          />
        )}

        {/* اختيار الفصل الجديد */}
        {watchedStudent && (
          <Controller
            name="newClassId"
            control={control}
            render={({ field }) => (
              <FormControl
                fullWidth
                margin="normal"
                error={!!errors.newClassId}
              >
                <InputLabel>New Class</InputLabel>
                <Select {...field} label="New Class">
                  {schoolClasses?.map((schoolClass) => (
                    <MenuItem key={schoolClass.id} value={schoolClass.id}>
                      {schoolClass.name}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="error">
                  {errors.newClassId?.message}
                </Typography>
              </FormControl>
            )}
          />
        )}

        {/* زر التحويل */}
        {watchedStudent && (
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Transfer Student
          </Button>
        )}
      </form>

      {/* رسائل تنبيه */}
      {watchedCurrentClass && (!userData || userData.length === 0) && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No students found in this class
        </Alert>
      )}
    </Box>
  );
};

export default AddStudentToSchoolClass;
