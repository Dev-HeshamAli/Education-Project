// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   MenuItem,
//   Select,
//   Typography,
//   TextField,
//   FormControl,
//   InputLabel,
//   FormHelperText,
//   LinearProgress,
//   Alert,
//   Dialog,
// } from "@mui/material";
// import * as yup from "yup";
// import { useFormik } from "formik";
// import { useDispatch, useSelector } from "react-redux";

// import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
// import { fetchPlans } from "../../store/shared/plan/actGetPlan";
// import { fetchSemesters } from "../../store/shared/semesters/actGetSemesters";
// import { fetchAcademicYears } from "../../store/shared/academicYears/actGetAcademicYears";
// import { fetchStages } from "../../store/shared/stage/actGetStage";
// import { actGetCourseDetails } from "../../store/shared/courseDetails/actGetCourseDetails";
// import { actUpdateCourse } from "../../store/courses/updateCourse/actUpdateCourse";
// import { clearUpdateMessages } from "../../store/courses/updateCourse/updateCourseSlice";
// import { GridAddIcon, GridDeleteIcon } from "@mui/x-data-grid";
// import DeleteCourseFromP from "./DeleteCourseFromP";
// import AddCourseToP from "./AddCourseToP";

// const UpdateCourse = ({ courseData }) => {
//   console.log("courseData", courseData);

//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.auth.token);

//   const { loading, successMessage, errorMessage } = useSelector(
//     (state) => state.updateCourse
//   );
//   const [selectedPlans, setSelectedPlans] = useState([]);
//   const [selectedStudyLevel, setSelectedStudyLevel] = useState("");
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [deleteCourseFromP, setDeleteCourseFromP] = useState(false);
//   const [addCourseToP, setAddCourseToP] = useState(false);
//   const [selectedCourseData, setSelectedCourseData] = useState(null);

//   const plans = useSelector((state) => state.plansId.list);
//   const studyLevels = useSelector((state) => state.studyLevelsId.list);
//   const stages = useSelector((state) => state.stageId.list);
//   const semesters = useSelector((state) => state.semestersId.list);
//   const academicYears = useSelector((state) => state.academicYearsId.list);

//   const courseDetails = useSelector((state) => state.courseDetails.list);

//   const dis100 = courseDetails.discountPercentage * 100;
//   const disOffline100 = courseData.offlineDiscountPercentage * 100;

//   // ✅ إضافة useEffect لجلب تفاصيل الكورس عند تمرير courseData
//   useEffect(() => {
//     if (courseData && courseData.id && token) {
//       const courseId = courseData.id || courseData.courseId;

//       // تحديث الستيت المحلي
//       setSelectedPlans(courseData.coursesInPlans?.map((p) => p.planId) || []);
//       setSelectedStudyLevel(courseData.studyLevelId || "");
//       setSelectedCourse(courseId);

//       // جلب تفاصيل الكورس
//       dispatch(actGetCourseDetails({ token, id: courseId }));
//     }
//   }, [courseData, token, dispatch]);

//   // fetch base lists
//   useEffect(() => {
//     dispatch(fetchPlans(token));
//     dispatch(fetchStudyLevels(token));
//     dispatch(fetchStages(token));
//     dispatch(fetchSemesters(token));
//     dispatch(fetchAcademicYears(token));
//   }, [dispatch, token]);

//   // Schema
//   const validationSchema = yup.object({
//     name: yup.string().required("Name is required"),
//     description: yup.string().required("Description is required"),
//     price: yup
//       .number()
//       .typeError("Price must be a number")
//       .min(0, "Price must be >= 0")
//       .required("Price is required"),
//     discountPercentage: yup
//       .number()
//       .typeError("Discount must be a number")
//       .min(0, "Discount must be More than 0")
//       .max(100, "Discount must be Less than 100")
//       .required("Discount is required"),
//     offlinePrice: yup
//       .number()
//       .typeError("Price must be a number")
//       .min(0, "Price must be More than 0")
//       .required("Price is required"),
//     offlineDiscountPercentage: yup
//       .number()
//       .typeError("Discount must be a number")
//       .min(0, "Discount must be More than 0")
//       .max(100, "Discount must be Less than 100")
//       .required("Discount is required"),
//     stageId: yup
//       .number()
//       .typeError("Stage is required")
//       .required("Stage is required"),
//     semesterId: yup
//       .number()
//       .typeError("Semester is required")
//       .required("Semester is required"),
//     studyLevelId: yup
//       .number()
//       .typeError("Study Level is required")
//       .required("Study Level is required"),
//     plans: yup.array().min(1, "Plan is required"),
//     academicYearId: yup
//       .number()
//       .typeError("Academic Year is required")
//       .required("Academic Year is required"),
//   });

//   // Formik
//   // تعديل دالة onSubmit في الـ Formik
//   const formik = useFormik({
//     initialValues: {
//       id: "",
//       name: "",
//       description: "",
//       price: "",
//       discountPercentage: "",
//       offlinePrice: "",
//       offlineDiscountPercentage: "",
//       stageId: "",
//       semesterId: "",
//       studyLevelId: "",
//       plans: [],
//       academicYearId: "",
//     },
//     enableReinitialize: true,
//     validationSchema,
//     onSubmit: (values) => {
//       // ✅ تحويل قيم الخصم من نسبة مئوية إلى رقم عشري
//       const updatedValues = {
//         ...values,
//         discountPercentage: values.discountPercentage / 100,
//         offlineDiscountPercentage: values.offlineDiscountPercentage / 100,
//       };
//       console.log(updatedValues);

//       // dispatch(actUpdateCourse({ token, data: updatedValues }));
//     },
//   });

//   const handleDeleteCourse = () => {
//     if (courseDetails) {
//       const courseDataForDelete = {
//         courseId: courseDetails.id,
//         courseName: courseDetails.name,
//         plans: courseDetails.plans || [],
//         // إضافة أي بيانات تانية محتاجها
//         ...courseDetails,
//       };

//       setSelectedCourseData(courseDataForDelete);
//       setDeleteCourseFromP(true);
//     }
//   };

//   // ✅ دالة لتحضير بيانات الكورس للإضافة
//   const handleAddCourse = () => {
//     if (courseDetails) {
//       const courseDataForAdd = {
//         courseId: courseDetails.id,
//         courseName: courseDetails.name,
//         plans: courseDetails.plans || [],
//         // إضافة أي بيانات تانية محتاجها
//         ...courseDetails,
//       };

//       console.log("Course data for add:", courseDataForAdd);
//       setSelectedCourseData(courseDataForAdd);
//       setAddCourseToP(true);
//     }
//   };

//   const handleSelectCourse = (courseId) => {
//     setSelectedCourse(courseId);
//     if (courseId) {
//       dispatch(actGetCourseDetails({ token, id: courseId }));
//     }
//   };

//   // ✅ ملء الفورم عند وصول بيانات courseDetails
//   useEffect(() => {
//     if (courseDetails && courseDetails.id) {
//       formik.setValues({
//         id: courseDetails.id,
//         name: courseDetails.name || "",
//         description: courseDetails.description || "",
//         price: courseDetails.price ?? "",
//         offlinePrice: courseData.offlineFinalPrice ?? "",
//         offlineDiscountPercentage: disOffline100 ?? "",
//         discountPercentage: dis100 ?? "",
//         stageId: courseDetails.stageId ?? "",
//         semesterId: courseDetails.semesterId ?? "",
//         studyLevelId: courseDetails.studyLevelId ?? "",
//         plans: courseDetails.plans?.map((p) => p.id) ?? [],
//         academicYearId: courseDetails.academicYearId ?? "",
//       });
//     }
//   }, [courseDetails]); // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(() => {
//     if (successMessage || errorMessage) {
//       const timeoutId = setTimeout(() => {
//         dispatch(clearUpdateMessages());
//         setSelectedCourse("");
//         setSelectedPlans([]);
//         setSelectedStudyLevel("");
//       }, 3000);

//       return () => clearTimeout(timeoutId);
//     }
//   }, [successMessage, errorMessage, dispatch]);

//   return (
//     <Box p={3}>
//       {loading && <LinearProgress />}
//       {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
//       {successMessage && <Alert severity="success">{successMessage}</Alert>}
//       {deleteCourseFromP && (
//         <Dialog
//           onClose={() => setDeleteCourseFromP(false)}
//           open={deleteCourseFromP}
//         >
//           <DeleteCourseFromP
//             courseDataForDelete={selectedCourseData}
//             onClose={() => setDeleteCourseFromP(false)}
//           />
//         </Dialog>
//       )}
//       {addCourseToP && (
//         <Dialog
//           onClose={() => setAddCourseToP(false)}
//           open={addCourseToP}
//           maxWidth="sm"
//           fullWidth
//         >
//           <AddCourseToP
//             courseDataForAdd={selectedCourseData}
//             onClose={() => setAddCourseToP(false)}
//           />
//         </Dialog>
//       )}

//       <Typography variant="h5" gutterBottom>
//         Update Course
//       </Typography>

//       {/* Filters: Plans */}
//       <FormControl fullWidth margin="normal">
//         <InputLabel
//           id="plan-filter-label"
//           sx={{ fontSize: "15px", fontWeight: "bold", color: "black" }}
//         >
//           Current Plans
//         </InputLabel>
//         <Select
//           labelId="plan-filter-label"
//           multiple
//           value={selectedPlans}
//           onChange={(e) => setSelectedPlans(e.target.value)}
//           renderValue={(selected) =>
//             plans
//               ?.filter((plan) => selected.includes(plan.id))
//               .map((plan) => plan.name)
//               .join(", ")
//           }
//         >
//           {plans?.map((plan) => (
//             <MenuItem key={plan.id} value={plan.id}>
//               {plan.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {/* Filters: Study Level */}
//       <FormControl fullWidth margin="normal">
//         <InputLabel id="level-filter-label">Study Level</InputLabel>
//         <Select
//           labelId="level-filter-label"
//           value={selectedStudyLevel}
//           onChange={(e) => setSelectedStudyLevel(e.target.value)}
//         >
//           {studyLevels?.map((lvl) => (
//             <MenuItem key={lvl.id} value={lvl.id}>
//               {lvl.studyLevelName || lvl.level}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {/* Course Select */}
//       <FormControl fullWidth margin="normal">
//         <InputLabel id="course-select-label">Course</InputLabel>
//         <Select
//           labelId="course-select-label"
//           label="Course"
//           value={selectedCourse || ""}
//           onChange={(e) => handleSelectCourse(e.target.value)}
//         >
//           {courseData ? (
//             <MenuItem value={courseData.id || courseData.courseId}>
//               {courseData.name || courseData.courseName}
//             </MenuItem>
//           ) : (
//             <MenuItem disabled>No courses available</MenuItem>
//           )}
//         </Select>
//       </FormControl>

//       {/* ✅ إضافة رسالة loading أثناء تحميل تفاصيل الكورس */}
//       {selectedCourse && !courseDetails && (
//         <Box mt={2} textAlign="center">
//           <Typography variant="body2" color="textSecondary">
//             Loading course details...
//           </Typography>
//         </Box>
//       )}

//       {/* Form (يمتلئ من courseDetails) */}
//       {courseDetails && courseDetails.id && (
//         <Box component="form" mt={3} onSubmit={formik.handleSubmit}>
//           <Typography
//             align="center"
//             sx={{ fontWeight: "bold" }}
//             variant="body2"
//             color="initial"
//           >
//             Course Details
//           </Typography>

//           {/* Name */}
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Name"
//             name="name"
//             value={formik.values.name}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             error={formik.touched.name && Boolean(formik.errors.name)}
//             helperText={formik.touched.name && formik.errors.name}
//           />

//           {/* Description */}
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Description"
//             name="description"
//             value={formik.values.description}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             error={
//               formik.touched.description && Boolean(formik.errors.description)
//             }
//             helperText={formik.touched.description && formik.errors.description}
//           />

//           {/* Price */}
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Price"
//             type="number"
//             name="price"
//             value={formik.values.price}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             error={formik.touched.price && Boolean(formik.errors.price)}
//             helperText={formik.touched.price && formik.errors.price}
//           />
//           {/* Discount */}
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Discount %"
//             type="number"
//             name="discountPercentage"
//             value={formik.values.discountPercentage}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             error={
//               formik.touched.discountPercentage &&
//               Boolean(formik.errors.discountPercentage)
//             }
//             helperText={
//               formik.touched.discountPercentage &&
//               formik.errors.discountPercentage
//             }
//           />

//           {/* Price */}
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Offline Price"
//             type="number"
//             name="Offline Price"
//             value={formik.values.offlinePrice}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             error={
//               formik.touched.offlinePrice && Boolean(formik.errors.offlinePrice)
//             }
//             helperText={
//               formik.touched.offlinePrice && formik.errors.offlinePrice
//             }
//           />

//           {/*Offline Discount */}
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Offline Discount %"
//             type="number"
//             name="offlineDiscountPercentage"
//             value={formik.values.offlineDiscountPercentage}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             error={
//               formik.touched.offlineDiscountPercentage &&
//               Boolean(formik.errors.offlineDiscountPercentage)
//             }
//             helperText={
//               formik.touched.offlineDiscountPercentage &&
//               formik.errors.offlineDiscountPercentage
//             }
//           />

//           {/* Stage */}
//           <FormControl
//             fullWidth
//             margin="normal"
//             error={formik.touched.stageId && Boolean(formik.errors.stageId)}
//           >
//             <InputLabel id="stage-label">Stage</InputLabel>
//             <Select
//               labelId="stage-label"
//               label="Stage"
//               name="stageId"
//               value={formik.values.stageId}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             >
//               {stages?.map((s) => (
//                 <MenuItem key={s.id} value={s.id}>
//                   {s.stageName || s.name}
//                 </MenuItem>
//               ))}
//             </Select>
//             <FormHelperText>
//               {formik.touched.stageId && formik.errors.stageId}
//             </FormHelperText>
//           </FormControl>

//           {/* Semester */}
//           <FormControl
//             fullWidth
//             margin="normal"
//             error={
//               formik.touched.semesterId && Boolean(formik.errors.semesterId)
//             }
//           >
//             <InputLabel id="semester-label">Semester</InputLabel>
//             <Select
//               labelId="semester-label"
//               label="Semester"
//               name="semesterId"
//               value={formik.values.semesterId}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             >
//               {semesters?.map((s) => (
//                 <MenuItem key={s.id} value={s.id}>
//                   {s.semesterName || s.name}
//                 </MenuItem>
//               ))}
//             </Select>
//             <FormHelperText>
//               {formik.touched.semesterId && formik.errors.semesterId}
//             </FormHelperText>
//           </FormControl>

//           {/* Academic Year */}
//           <FormControl
//             fullWidth
//             margin="normal"
//             error={
//               formik.touched.academicYearId &&
//               Boolean(formik.errors.academicYearId)
//             }
//           >
//             <InputLabel id="academicYear-label">Academic Year</InputLabel>
//             <Select
//               labelId="academicYear-label"
//               label="Academic Year"
//               name="academicYearId"
//               value={formik.values.academicYearId}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             >
//               {academicYears?.map((y) => (
//                 <MenuItem key={y.id} value={y.id}>
//                   {y.academicYearName || y.date}
//                 </MenuItem>
//               ))}
//             </Select>
//             <FormHelperText>
//               {formik.touched.academicYearId && formik.errors.academicYearId}
//             </FormHelperText>
//           </FormControl>

//           {/* Study Level */}
//           <FormControl
//             fullWidth
//             margin="normal"
//             error={
//               formik.touched.studyLevelId && Boolean(formik.errors.studyLevelId)
//             }
//           >
//             <InputLabel id="studyLevel-label">Study Level</InputLabel>
//             <Select
//               labelId="studyLevel-label"
//               label="Study Level"
//               name="studyLevelId"
//               value={formik.values.studyLevelId}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             >
//               {studyLevels?.map((lvl) => (
//                 <MenuItem key={lvl.id} value={lvl.id}>
//                   {lvl.studyLevelName || lvl.level}
//                 </MenuItem>
//               ))}
//             </Select>
//             <FormHelperText>
//               {formik.touched.studyLevelId && formik.errors.studyLevelId}
//             </FormHelperText>
//           </FormControl>

//           {/* Plan */}
//           <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//             <FormControl
//               fullWidth
//               margin="normal"
//               error={formik.touched.plans && Boolean(formik.errors.plans)}
//             >
//               <InputLabel id="plans-label">Plans</InputLabel>
//               <Select
//                 labelId="plans-label"
//                 multiple
//                 name="plans"
//                 value={formik.values.plans}
//                 onChange={formik.handleChange}
//                 renderValue={(selected) =>
//                   plans
//                     ?.filter((plan) => selected.includes(plan.id))
//                     .map((plan) => plan.name)
//                     .join(", ")
//                 }
//               >
//                 {plans?.map((p) => (
//                   <MenuItem key={p.id} value={p.id}>
//                     {p.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <FormHelperText>
//                 {formik.touched.plans && formik.errors.plans}
//               </FormHelperText>
//             </FormControl>

//             <Box
//               sx={{
//                 display: "flex",
//                 gap: 1,
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleAddCourse}
//               >
//                 <GridAddIcon />
//               </Button>
//               <Button
//                 variant="contained"
//                 color="error"
//                 onClick={handleDeleteCourse}
//               >
//                 <GridDeleteIcon />
//               </Button>
//             </Box>
//           </Box>

//           <Button type="submit" variant="contained" color="primary">
//             Update Course
//           </Button>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default UpdateCourse;

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  FormHelperText,
  LinearProgress,
  Alert,
  Dialog,
} from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchPlans } from "../../store/shared/plan/actGetPlan";
import { fetchSemesters } from "../../store/shared/semesters/actGetSemesters";
import { fetchAcademicYears } from "../../store/shared/academicYears/actGetAcademicYears";
import { fetchStages } from "../../store/shared/stage/actGetStage";
import { actGetCourseDetails } from "../../store/shared/courseDetails/actGetCourseDetails";
import { actUpdateCourse } from "../../store/courses/updateCourse/actUpdateCourse";
import { clearUpdateMessages } from "../../store/courses/updateCourse/updateCourseSlice";
import { GridAddIcon, GridDeleteIcon } from "@mui/x-data-grid";
import DeleteCourseFromP from "./DeleteCourseFromP";
import AddCourseToP from "./AddCourseToP";

const UpdateCourse = ({ courseData }) => {
  // console.log("courseData", courseData);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { loading, successMessage, errorMessage } = useSelector(
    (state) => state.updateCourse
  );
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [selectedStudyLevel, setSelectedStudyLevel] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [deleteCourseFromP, setDeleteCourseFromP] = useState(false);
  const [addCourseToP, setAddCourseToP] = useState(false);
  const [selectedCourseData, setSelectedCourseData] = useState(null);

  const plans = useSelector((state) => state.plansId.list);
  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const stages = useSelector((state) => state.stageId.list);
  const semesters = useSelector((state) => state.semestersId.list);
  const academicYears = useSelector((state) => state.academicYearsId.list);

  const courseDetails = useSelector((state) => state.courseDetails.list);

  // ✅ إصلاح حساب قيم الخصم مع التحقق من وجود القيم
  const dis100 = courseDetails?.discountPercentage
    ? Number(courseDetails.discountPercentage) * 100
    : 0;
  const disOffline100 = courseData?.offlineDiscountPercentage
    ? Number(courseData.offlineDiscountPercentage) * 100
    : 0;

  // ✅ إضافة useEffect لجلب تفاصيل الكورس عند تمرير courseData
  useEffect(() => {
    if (courseData && courseData.id && token) {
      const courseId = courseData.id || courseData.courseId;

      // تحديث الستيت المحلي
      setSelectedPlans(courseData.coursesInPlans?.map((p) => p.planId) || []);
      setSelectedStudyLevel(courseData.studyLevelId || "");
      setSelectedCourse(courseId);

      // جلب تفاصيل الكورس
      dispatch(actGetCourseDetails({ token, id: courseId }));
    }
  }, [courseData, token, dispatch]);

  // fetch base lists
  useEffect(() => {
    dispatch(fetchPlans(token));
    dispatch(fetchStudyLevels(token));
    dispatch(fetchStages(token));
    dispatch(fetchSemesters(token));
    dispatch(fetchAcademicYears(token));
  }, [dispatch, token]);

  // Schema
  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    price: yup
      .number()
      .typeError("Price must be a number")
      .min(0, "Price must be >= 0")
      .required("Price is required"),
    discountPercentage: yup
      .number()
      .typeError("Discount must be a number")
      .min(0, "Discount must be More than 0")
      .max(100, "Discount must be Less than 100")
      .required("Discount is required"),
    offlinePrice: yup
      .number()
      .typeError("Price must be a number")
      .min(0, "Price must be More than 0")
      .required("Price is required"),
    offlineDiscountPercentage: yup
      .number()
      .typeError("Discount must be a number")
      .min(0, "Discount must be More than 0")
      .max(100, "Discount must be Less than 100")
      .required("Discount is required"),
    stageId: yup
      .number()
      .typeError("Stage is required")
      .required("Stage is required"),
    semesterId: yup
      .number()
      .typeError("Semester is required")
      .required("Semester is required"),
    studyLevelId: yup
      .number()
      .typeError("Study Level is required")
      .required("Study Level is required"),
    plans: yup.array().min(1, "Plan is required"),
    academicYearId: yup
      .number()
      .typeError("Academic Year is required")
      .required("Academic Year is required"),
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      description: "",
      price: "",
      discountPercentage: "",
      offlinePrice: "",
      offlineDiscountPercentage: "",
      stageId: "",
      semesterId: "",
      studyLevelId: "",
      plans: [],
      academicYearId: "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      // ✅ تحويل قيم الخصم من نسبة مئوية إلى رقم عشري
      const updatedValues = {
        ...values,
        discountPercentage: Number(values.discountPercentage) / 100,
        offlineDiscountPercentage:
          Number(values.offlineDiscountPercentage) / 100,
      };
      // console.log(updatedValues, "ssssssssssss");

      dispatch(actUpdateCourse({ token, data: updatedValues }));
    },
  });

  const handleDeleteCourse = () => {
    if (courseDetails) {
      const courseDataForDelete = {
        courseId: courseDetails.id,
        courseName: courseDetails.name,
        plans: courseDetails.plans || [],
        // إضافة أي بيانات تانية محتاجها
        ...courseDetails,
      };

      setSelectedCourseData(courseDataForDelete);
      setDeleteCourseFromP(true);
    }
  };

  // ✅ دالة لتحضير بيانات الكورس للإضافة
  const handleAddCourse = () => {
    if (courseDetails) {
      const courseDataForAdd = {
        courseId: courseDetails.id,
        courseName: courseDetails.name,
        plans: courseDetails.plans || [],
        // إضافة أي بيانات تانية محتاجها
        ...courseDetails,
      };

      console.log("Course data for add:", courseDataForAdd);
      setSelectedCourseData(courseDataForAdd);
      setAddCourseToP(true);
    }
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourse(courseId);
    if (courseId) {
      dispatch(actGetCourseDetails({ token, id: courseId }));
    }
  };

  // ✅ ملء الفورم عند وصول بيانات courseDetails مع التحقق من القيم
  useEffect(() => {
    if (courseDetails && courseDetails.id) {
      formik.setValues({
        id: courseDetails.id || "",
        name: courseDetails.name || "",
        description: courseDetails.description || "",
        price: courseDetails.price ?? "",
        offlinePrice: courseData?.offlineFinalPrice ?? "",
        offlineDiscountPercentage: disOffline100 || "",
        discountPercentage: dis100 || "",
        stageId: courseDetails.stageId ?? "",
        semesterId: courseDetails.semesterId ?? "",
        studyLevelId: courseDetails.studyLevelId ?? "",
        plans: courseDetails.plans?.map((p) => p.id) ?? [],
        academicYearId: courseDetails.academicYearId ?? "",
      });
    }
  }, [courseDetails, dis100, disOffline100, courseData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timeoutId = setTimeout(() => {
        dispatch(clearUpdateMessages());
        setSelectedCourse("");
        setSelectedPlans([]);
        setSelectedStudyLevel("");
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [successMessage, errorMessage, dispatch]);

  return (
    <Box p={3}>
      {loading && <LinearProgress />}
      {/* ✅ إصلاح عرض رسائل الخطأ */}
      {errorMessage && (
        <Alert severity="error">
          {typeof errorMessage === "string"
            ? errorMessage
            : "An error occurred"}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success">
          {typeof successMessage === "string" ? successMessage : "Success"}
        </Alert>
      )}
      {deleteCourseFromP && (
        <Dialog
          onClose={() => setDeleteCourseFromP(false)}
          open={deleteCourseFromP}
        >
          <DeleteCourseFromP
            courseDataForDelete={selectedCourseData}
            onClose={() => setDeleteCourseFromP(false)}
          />
        </Dialog>
      )}
      {addCourseToP && (
        <Dialog
          onClose={() => setAddCourseToP(false)}
          open={addCourseToP}
          maxWidth="sm"
          fullWidth
        >
          <AddCourseToP
            courseDataForAdd={selectedCourseData}
            onClose={() => setAddCourseToP(false)}
          />
        </Dialog>
      )}

      <Typography variant="h5" gutterBottom>
        Update Course
      </Typography>

      {/* Filters: Plans */}
      <FormControl fullWidth margin="normal">
        <InputLabel
          id="plan-filter-label"
          sx={{ fontSize: "15px", fontWeight: "bold", color: "black" }}
        >
          Current Plans
        </InputLabel>
        <Select
          labelId="plan-filter-label"
          multiple
          value={selectedPlans}
          onChange={(e) => setSelectedPlans(e.target.value)}
          renderValue={(selected) =>
            plans
              ?.filter((plan) => selected.includes(plan.id))
              .map((plan) => plan.name)
              .join(", ") || ""
          }
        >
          {plans?.map((plan) => (
            <MenuItem key={plan.id} value={plan.id}>
              {plan.name || "Unnamed Plan"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Filters: Study Level */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="level-filter-label">Study Level</InputLabel>
        <Select
          labelId="level-filter-label"
          value={selectedStudyLevel}
          onChange={(e) => setSelectedStudyLevel(e.target.value)}
        >
          {studyLevels?.map((lvl) => (
            <MenuItem key={lvl.id} value={lvl.id}>
              {lvl.studyLevelName || lvl.level || "Unnamed Level"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Course Select */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="course-select-label">Course</InputLabel>
        <Select
          labelId="course-select-label"
          label="Course"
          value={selectedCourse || ""}
          onChange={(e) => handleSelectCourse(e.target.value)}
        >
          {courseData ? (
            <MenuItem value={courseData.id || courseData.courseId}>
              {courseData.name || courseData.courseName || "Unnamed Course"}
            </MenuItem>
          ) : (
            <MenuItem disabled>No courses available</MenuItem>
          )}
        </Select>
      </FormControl>

      {/* ✅ إضافة رسالة loading أثناء تحميل تفاصيل الكورس */}
      {selectedCourse && !courseDetails && (
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Loading course details...
          </Typography>
        </Box>
      )}

      {/* Form (يمتلئ من courseDetails) */}
      {courseDetails && courseDetails.id && (
        <Box component="form" mt={3} onSubmit={formik.handleSubmit}>
          <Typography
            align="center"
            sx={{ fontWeight: "bold" }}
            variant="body2"
            color="initial"
          >
            Course Details
          </Typography>

          {/* Name */}
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={formik.values.name || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          {/* Description */}
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={formik.values.description || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />

          {/* Price */}
          <TextField
            fullWidth
            margin="normal"
            label="Price"
            type="number"
            name="price"
            value={formik.values.price || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
          />
          {/* Discount */}
          <TextField
            fullWidth
            margin="normal"
            label="Discount %"
            type="number"
            name="discountPercentage"
            value={formik.values.discountPercentage || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.discountPercentage &&
              Boolean(formik.errors.discountPercentage)
            }
            helperText={
              formik.touched.discountPercentage &&
              formik.errors.discountPercentage
            }
          />

          {/* Offline Price */}
          <TextField
            fullWidth
            margin="normal"
            label="Offline Price"
            type="number"
            name="offlinePrice"
            value={formik.values.offlinePrice || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.offlinePrice && Boolean(formik.errors.offlinePrice)
            }
            helperText={
              formik.touched.offlinePrice && formik.errors.offlinePrice
            }
          />

          {/*Offline Discount */}
          <TextField
            fullWidth
            margin="normal"
            label="Offline Discount %"
            type="number"
            name="offlineDiscountPercentage"
            value={formik.values.offlineDiscountPercentage || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.offlineDiscountPercentage &&
              Boolean(formik.errors.offlineDiscountPercentage)
            }
            helperText={
              formik.touched.offlineDiscountPercentage &&
              formik.errors.offlineDiscountPercentage
            }
          />

          {/* Stage */}
          <FormControl
            fullWidth
            margin="normal"
            error={formik.touched.stageId && Boolean(formik.errors.stageId)}
          >
            <InputLabel id="stage-label">Stage</InputLabel>
            <Select
              labelId="stage-label"
              label="Stage"
              name="stageId"
              value={formik.values.stageId || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {stages?.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.stageName || s.name || "Unnamed Stage"}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {formik.touched.stageId && formik.errors.stageId}
            </FormHelperText>
          </FormControl>

          {/* Semester */}
          <FormControl
            fullWidth
            margin="normal"
            error={
              formik.touched.semesterId && Boolean(formik.errors.semesterId)
            }
          >
            <InputLabel id="semester-label">Semester</InputLabel>
            <Select
              labelId="semester-label"
              label="Semester"
              name="semesterId"
              value={formik.values.semesterId || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {semesters?.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.semesterName || s.name || "Unnamed Semester"}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {formik.touched.semesterId && formik.errors.semesterId}
            </FormHelperText>
          </FormControl>

          {/* Academic Year */}
          <FormControl
            fullWidth
            margin="normal"
            error={
              formik.touched.academicYearId &&
              Boolean(formik.errors.academicYearId)
            }
          >
            <InputLabel id="academicYear-label">Academic Year</InputLabel>
            <Select
              labelId="academicYear-label"
              label="Academic Year"
              name="academicYearId"
              value={formik.values.academicYearId || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {academicYears?.map((y) => (
                <MenuItem key={y.id} value={y.id}>
                  {y.academicYearName || y.date || "Unnamed Year"}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {formik.touched.academicYearId && formik.errors.academicYearId}
            </FormHelperText>
          </FormControl>

          {/* Study Level */}
          <FormControl
            fullWidth
            margin="normal"
            error={
              formik.touched.studyLevelId && Boolean(formik.errors.studyLevelId)
            }
          >
            <InputLabel id="studyLevel-label">Study Level</InputLabel>
            <Select
              labelId="studyLevel-label"
              label="Study Level"
              name="studyLevelId"
              value={formik.values.studyLevelId || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {studyLevels?.map((lvl) => (
                <MenuItem key={lvl.id} value={lvl.id}>
                  {lvl.studyLevelName || lvl.level || "Unnamed Level"}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {formik.touched.studyLevelId && formik.errors.studyLevelId}
            </FormHelperText>
          </FormControl>

          {/* Plan */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <FormControl
              fullWidth
              margin="normal"
              error={formik.touched.plans && Boolean(formik.errors.plans)}
            >
              <InputLabel id="plans-label">Plans</InputLabel>
              <Select
                labelId="plans-label"
                multiple
                name="plans"
                value={formik.values.plans || []}
                onChange={formik.handleChange}
                renderValue={(selected) =>
                  plans
                    ?.filter((plan) => selected.includes(plan.id))
                    .map((plan) => plan.name || "Unnamed Plan")
                    .join(", ") || ""
                }
              >
                {plans?.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name || "Unnamed Plan"}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {formik.touched.plans && formik.errors.plans}
              </FormHelperText>
            </FormControl>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddCourse}
              >
                <GridAddIcon />
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteCourse}
              >
                <GridDeleteIcon />
              </Button>
            </Box>
          </Box>

          <Button type="submit" variant="contained" color="primary">
            Update Course
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UpdateCourse;
