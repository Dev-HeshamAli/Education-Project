// import { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import CreateSchoolClass from "./CreateSchoolClass";
// import UpdateSchoolClass from "./UpdateSchoolClass";
// import DeleteSchoolClass from "./DeleteSchoolClass";
// import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
// import { fetchSchoolClassId } from "../../store/shared/schoolClass/actGetSchoolClassId";
// import { actGetSchoolClassDetails } from "../../store/shared/schoolClass/getSchoolClassDetails/actGetSchoolClassDetails";
// import { GridAddIcon } from "@mui/x-data-grid";
// const ManageClass = () => {
//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.auth.token);

//   const [studyLevelId, setStudyLevelId] = useState("");
//   const [selectedClassId, setSelectedClassId] = useState(null);

//   const [openStudentsDialog, setOpenStudentsDialog] = useState(false);
//   const [openCreateClassDialog, setOpenCreateClassDialog] = useState(false);
//   const [openUpdateClassDialog, setOpenUpdateClassDialog] = useState(false);
//   const [openDeleteClassDialog, setOpenDeleteClassDialog] = useState(false);
//   const [classDataForEdit, setClassDataForEdit] = useState(null);
//   const [classDataForDelete, setClassDataForDelete] = useState(null);

//   const studyLevels = useSelector((state) => state.studyLevelsId.list);
//   const classesList = useSelector((state) => state.schoolClassId.list);
//   const classDetails = useSelector((state) => state.schoolClassesDetails.list);
//   // console.log(classDetails);

//   const { success: createSuccess } = useSelector(
//     (state) => state.createSchoolClass
//   );
//   const { success: updateSuccess } = useSelector(
//     (state) => state.updateSchoolClass
//   );
//   const { success: deleteSuccess } = useSelector(
//     (state) => state.deleteSchoolClass
//   );

//   useEffect(() => {
//     dispatch(fetchStudyLevels(token));
//   }, [dispatch, token]);

//   const handleSelectClass = (id) => {
//     setSelectedClassId(id);
//     dispatch(actGetSchoolClassDetails({ token, id }));
//   };

//   const handleEditClass = (cls) => {
//     dispatch(actGetSchoolClassDetails({ token, id: cls.id })).then((res) => {
//       setClassDataForEdit(res.payload); // أو classDetails بعد التحديث
//       setOpenUpdateClassDialog(true);
//     });
//   };

//   useEffect(() => {
//     if (
//       (createSuccess && studyLevelId) ||
//       (updateSuccess && studyLevelId) ||
//       (deleteSuccess && studyLevelId)
//     ) {
//       dispatch(fetchSchoolClassId({ token, id: studyLevelId }));
//       dispatch(actGetSchoolClassDetails({ token, id: selectedClassId }));
//     }
//   }, [
//     createSuccess,
//     dispatch,
//     studyLevelId,
//     token,
//     updateSuccess,
//     deleteSuccess,
//     selectedClassId,
//   ]);

//   return (
//     <Box p={3}>
//       {openCreateClassDialog && (
//         <Dialog
//           open={openCreateClassDialog}
//           onClose={() => setOpenCreateClassDialog(false)}
//         >
//           <CreateSchoolClass studyLevelId={studyLevelId} />
//         </Dialog>
//       )}

//       {openUpdateClassDialog && classDataForEdit && (
//         <Dialog
//           open={openUpdateClassDialog}
//           onClose={() => setOpenUpdateClassDialog(false)}
//         >
//           <UpdateSchoolClass
//             studyLevelId={studyLevelId}
//             classId={classDataForEdit.id}
//             className={classDataForEdit.name}
//             capacity={classDataForEdit.capacity}
//           />
//         </Dialog>
//       )}
//       {/* Delete Class Dialog */}
//       {openDeleteClassDialog && classDataForDelete && (
//         <Dialog
//           open={openDeleteClassDialog}
//           onClose={() => setOpenDeleteClassDialog(false)}
//         >
//           <DeleteSchoolClass
//             studyLevelId={studyLevelId}
//             classId={classDataForDelete.id}
//             className={classDataForDelete.name}
//           />
//         </Dialog>
//       )}

//       <Typography
//         variant="h5"
//         align="center"
//         sx={{ fontWeight: "bold", mb: 3 }}
//       >
//         Manage School Classes
//       </Typography>
//       <Box
//         display="flex"
//         justifyContent="center"
//         gap={2}
//         flexWrap="wrap"
//         mb={3}
//       >
//         {studyLevels?.map((s) => (
//           <Button
//             key={s.id}
//             variant={studyLevelId === s.id ? "contained" : "outlined"}
//             color="primary"
//             onClick={() => {
//               setStudyLevelId(s.id);
//               dispatch(fetchSchoolClassId({ token, id: s.id }));
//             }}
//           >
//             {s.level}
//           </Button>
//         ))}
//       </Box>

//       {studyLevelId && (
//         <>
//           {/* زر إنشاء كلاس */}
//           <Box mb={2}>
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<GridAddIcon />}
//               onClick={() => setOpenCreateClassDialog(true)}
//             >
//               Create Class
//             </Button>
//           </Box>
//           <Typography variant="h6" mb={1}>
//             Classes
//           </Typography>
//           <TableContainer component={Paper} sx={{ mb: 3 }}>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                   <TableCell align="center">Name</TableCell>
//                   <TableCell align="center">Details</TableCell>
//                   <TableCell align="center">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {Array.isArray(classesList) && classesList.length > 0 ? (
//                   classesList.map((cls) => (
//                     <TableRow key={cls.id}>
//                       <TableCell align="center">{cls.name}</TableCell>
//                       <TableCell align="center">
//                         <Button
//                           variant="outlined"
//                           size="small"
//                           onClick={() => handleSelectClass(cls.id)}
//                         >
//                           View Details
//                         </Button>
//                       </TableCell>
//                       <TableCell align="center">
//                         <Button
//                           variant="outlined"
//                           color="primary"
//                           size="small"
//                           sx={{ mr: 1 }}
//                           onClick={() => {
//                             handleEditClass(cls);
//                           }}
//                         >
//                           Edit
//                         </Button>
//                         <Button
//                           variant="outlined"
//                           color="error"
//                           size="small"
//                           onClick={() => {
//                             setClassDataForDelete(cls);
//                             setOpenDeleteClassDialog(true);
//                           }}
//                         >
//                           Delete
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={4} align="center">
//                       No Classes Found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </>
//       )}

//       {/* تفاصيل الفصل */}
//       {selectedClassId && classDetails && (
//         <>
//           <Typography variant="h6" mb={1}>
//             Class Details
//           </Typography>
//           <TableContainer component={Paper} sx={{ mb: 3 }}>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                   <TableCell align="center">Name</TableCell>
//                   <TableCell align="center">Capacity</TableCell>
//                   <TableCell align="center">Current Students</TableCell>
//                   <TableCell align="center">Stage</TableCell>
//                   <TableCell align="center">Students</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 <TableRow key={classDetails.id}>
//                   <TableCell align="center">{classDetails.name}</TableCell>
//                   <TableCell align="center">{classDetails.capacity}</TableCell>
//                   <TableCell align="center">
//                     {classDetails.courentStudents}
//                   </TableCell>
//                   <TableCell align="center">{classDetails.stage}</TableCell>
//                   <TableCell align="center">
//                     <Button
//                       variant="text"
//                       onClick={() => setOpenStudentsDialog(true)}
//                     >
//                       {classDetails.classStudents?.length > 0
//                         ? `${classDetails.classStudents.length} Students`
//                         : "No Students"}
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </>
//       )}

//       {/* Dialog لعرض الطلاب */}
//       <Dialog
//         open={openStudentsDialog}
//         onClose={() => setOpenStudentsDialog(false)}
//       >
//         <DialogTitle>Students</DialogTitle>
//         <DialogContent>
//           <List>
//             {classDetails?.classStudents?.length > 0 ? (
//               classDetails.classStudents.map((st) => (
//                 <ListItem key={st.id}>
//                   <ListItemText primary={st.name} />
//                 </ListItem>
//               ))
//             ) : (
//               <Typography>No Students</Typography>
//             )}
//           </List>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenStudentsDialog(false)}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default ManageClass;

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  TextField,
  Chip,
  Card,
  CardContent,
  Pagination,
  Container,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  BookmarkBorder as BookmarkIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import CreateSchoolClass from "./CreateSchoolClass";
import UpdateSchoolClass from "./UpdateSchoolClass";
import DeleteSchoolClass from "./DeleteSchoolClass";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { fetchSchoolClassId } from "../../store/shared/schoolClass/actGetSchoolClassId";
import { actGetSchoolClassDetails } from "../../store/shared/schoolClass/getSchoolClassDetails/actGetSchoolClassDetails";

const ManageClass = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [studyLevelId, setStudyLevelId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState(null);

  const [openStudentsDialog, setOpenStudentsDialog] = useState(false);
  const [openCreateClassDialog, setOpenCreateClassDialog] = useState(false);
  const [openUpdateClassDialog, setOpenUpdateClassDialog] = useState(false);
  const [openDeleteClassDialog, setOpenDeleteClassDialog] = useState(false);
  const [classDataForEdit, setClassDataForEdit] = useState(null);
  const [classDataForDelete, setClassDataForDelete] = useState(null);

  // States for students search and pagination
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [studentsPage, setStudentsPage] = useState(1);
  const studentsPerPage = 8;

  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const classesList = useSelector((state) => state.schoolClassId.list);
  const classDetails = useSelector((state) => state.schoolClassesDetails.list);

  const { success: createSuccess } = useSelector(
    (state) => state.createSchoolClass
  );
  const { success: updateSuccess } = useSelector(
    (state) => state.updateSchoolClass
  );
  const { success: deleteSuccess } = useSelector(
    (state) => state.deleteSchoolClass
  );

  useEffect(() => {
    dispatch(fetchStudyLevels(token));
  }, [dispatch, token]);

  const handleSelectClass = (id) => {
    setSelectedClassId(id);
    setStudentsPage(1);
    setStudentSearchTerm("");
    dispatch(actGetSchoolClassDetails({ token, id }));
  };

  const handleEditClass = (cls) => {
    dispatch(actGetSchoolClassDetails({ token, id: cls.id })).then((res) => {
      setClassDataForEdit(res.payload);
      setOpenUpdateClassDialog(true);
    });
  };

  useEffect(() => {
    if (
      (createSuccess && studyLevelId) ||
      (updateSuccess && studyLevelId) ||
      (deleteSuccess && studyLevelId)
    ) {
      dispatch(fetchSchoolClassId({ token, id: studyLevelId }));
      dispatch(actGetSchoolClassDetails({ token, id: selectedClassId }));
    }
  }, [
    createSuccess,
    dispatch,
    studyLevelId,
    token,
    updateSuccess,
    deleteSuccess,
    selectedClassId,
  ]);

  // Filter students based on search term
  const filteredStudents =
    classDetails?.classStudents?.filter((student) =>
      student.name.toLowerCase().includes(studentSearchTerm.toLowerCase())
    ) || [];

  // Paginate filtered students
  const paginatedStudents = filteredStudents.slice(
    (studentsPage - 1) * studentsPerPage,
    studentsPage * studentsPerPage
  );

  const totalStudentsPages = Math.ceil(
    filteredStudents.length / studentsPerPage
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Dialogs */}
        {openCreateClassDialog && (
          <Dialog
            open={openCreateClassDialog}
            onClose={() => setOpenCreateClassDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <CreateSchoolClass studyLevelId={studyLevelId} />
          </Dialog>
        )}

        {openUpdateClassDialog && classDataForEdit && (
          <Dialog
            open={openUpdateClassDialog}
            onClose={() => setOpenUpdateClassDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <UpdateSchoolClass
              studyLevelId={studyLevelId}
              classId={classDataForEdit.id}
              className={classDataForEdit.name}
              capacity={classDataForEdit.capacity}
            />
          </Dialog>
        )}

        {openDeleteClassDialog && classDataForDelete && (
          <Dialog
            open={openDeleteClassDialog}
            onClose={() => setOpenDeleteClassDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DeleteSchoolClass
              studyLevelId={studyLevelId}
              classId={classDataForDelete.id}
              className={classDataForDelete.name}
            />
          </Dialog>
        )}

        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <SchoolIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              mb: 1,
            }}
          >
            School Class Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage and organize your school classes efficiently
          </Typography>
        </Box>

        {/* Study Levels Selection */}
        <Card sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "center",
              }}
            >
              <BookmarkIcon color="primary" />
              Select Study Level
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              justifyContent={"center"}
            >
              {studyLevels?.map((level) => (
                <Button
                  key={level.id}
                  variant={studyLevelId === level.id ? "contained" : "outlined"}
                  color="primary"
                  size="large"
                  sx={{
                    minWidth: 120,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: studyLevelId === level.id ? "bold" : "medium",
                  }}
                  onClick={() => {
                    setStudyLevelId(level.id);
                    setSelectedClassId(null);
                    dispatch(fetchSchoolClassId({ token, id: level.id }));
                  }}
                >
                  {level.level}
                </Button>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Classes Section */}
        {studyLevelId && (
          <Card sx={{ mb: 4, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PeopleIcon color="primary" />
                  Available Classes
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenCreateClassDialog(true)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Create New Class
                </Button>
              </Box>

              <TableContainer
                component={Paper}
                sx={{ borderRadius: 2, overflow: "hidden" }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "primary.main" }}>
                      <TableCell
                        align="center"
                        sx={{ color: "white", fontWeight: "bold" }}
                      >
                        Class Name
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ color: "white", fontWeight: "bold" }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(classesList) && classesList.length > 0 ? (
                      classesList.map((cls, index) => (
                        <TableRow
                          key={cls.id}
                          sx={{
                            "&:hover": { bgcolor: "action.hover" },
                            bgcolor: index % 2 === 0 ? "grey.50" : "white",
                          }}
                        >
                          <TableCell align="center">
                            <Typography variant="subtitle1" fontWeight="medium">
                              {cls.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="center"
                            >
                              <Tooltip title="View Details">
                                <IconButton
                                  color="info"
                                  size="small"
                                  onClick={() => handleSelectClass(cls.id)}
                                  sx={{
                                    bgcolor: "info.light",
                                    color: "white",
                                    "&:hover": { bgcolor: "info.main" },
                                  }}
                                >
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Class">
                                <IconButton
                                  color="warning"
                                  size="small"
                                  onClick={() => handleEditClass(cls)}
                                  sx={{
                                    bgcolor: "warning.light",
                                    color: "white",
                                    "&:hover": { bgcolor: "warning.main" },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Class">
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() => {
                                    setClassDataForDelete(cls);
                                    setOpenDeleteClassDialog(true);
                                  }}
                                  sx={{
                                    bgcolor: "error.light",
                                    color: "white",
                                    "&:hover": { bgcolor: "error.main" },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                          <Alert
                            severity="info"
                            sx={{ display: "inline-flex" }}
                          >
                            No classes found for this study level
                          </Alert>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Class Details Section */}
        {selectedClassId && classDetails && (
          <Card
            sx={{
              mb: 4,
              boxShadow: 4,
              border: "2px solid",
              borderColor: "primary.light",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "center",
                  color: "primary.main",
                  fontWeight: "bold",
                }}
              >
                <SchoolIcon />
                {classDetails.name} - Class Overview
              </Typography>

              {/* Class Info Cards */}
              <Stack
                direction="row"
                spacing={3}
                sx={{ mb: 4 }}
                flexWrap="wrap"
                justifyContent="center"
              >
                <Card
                  sx={{
                    minWidth: 200,
                    bgcolor: "primary.main",
                    color: "white",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {classDetails.capacity}
                    </Typography>
                    <Typography variant="body1">Total Capacity</Typography>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    minWidth: 200,
                    bgcolor: "success.main",
                    color: "white",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {classDetails.courentStudents}
                    </Typography>
                    <Typography variant="body1">Current Students</Typography>
                  </CardContent>
                </Card>

                <Card
                  sx={{ minWidth: 200, bgcolor: "info.main", color: "white" }}
                >
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {classDetails.capacity - classDetails.courentStudents}
                    </Typography>
                    <Typography variant="body1">Available Spots</Typography>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    minWidth: 200,
                    bgcolor: "secondary.main",
                    color: "white",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Chip
                      label={classDetails.stage}
                      sx={{
                        bgcolor: "white",
                        color: "secondary.main",
                        fontWeight: "bold",
                        fontSize: "1rem",
                      }}
                    />
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Stage Level
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>

              {/* Semester Courses
              {classDetails.semesterCourses &&
                classDetails.semesterCourses.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Divider sx={{ mb: 3 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <BookmarkIcon color="primary" />
                      Semester Courses
                    </Typography>
                    <Stack spacing={2}>
                      {classDetails.semesterCourses.map((semester) => (
                        <Card
                          key={semester.semesterId}
                          variant="outlined"
                          sx={{ bgcolor: "grey.50" }}
                        >
                          <CardContent>
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              sx={{ mb: 2, color: "primary.main" }}
                            >
                              {semester.semesterName}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              flexWrap="wrap"
                              useFlexGap
                            >
                              {semester.courses.map((course) => (
                                <Chip
                                  key={course.courseId}
                                  label={`${course.courseNameName} • ${course.teacherName}`}
                                  variant="outlined"
                                  color="secondary"
                                  sx={{
                                    fontWeight: "medium",
                                    "& .MuiChip-label": { px: 2 },
                                  }}
                                />
                              ))}
                            </Stack>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  </Box>
                )} */}

              {/* Students Section */}
              <Divider sx={{ mb: 3 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <PersonIcon color="primary" />
                  Class Students ({filteredStudents.length})
                </Typography>

                <TextField
                  variant="outlined"
                  placeholder="Search students..."
                  value={studentSearchTerm}
                  onChange={(e) => {
                    setStudentSearchTerm(e.target.value);
                    setStudentsPage(1);
                  }}
                  size="small"
                  sx={{ minWidth: 300 }}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                  }}
                />
              </Box>

              {/* Students Table */}
              <TableContainer
                component={Paper}
                sx={{ borderRadius: 2, overflow: "hidden" }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "primary.main" }}>
                      <TableCell
                        align="center"
                        sx={{ color: "white", fontWeight: "bold" }}
                      >
                        Student Name
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ color: "white", fontWeight: "bold" }}
                      >
                        Parent Phones
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ color: "white", fontWeight: "bold" }}
                      >
                        Study Plan
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedStudents.length > 0 ? (
                      paginatedStudents.map((student, index) => (
                        <TableRow
                          key={student.id}
                          sx={{
                            "&:hover": { bgcolor: "action.hover" },
                            bgcolor: index % 2 === 0 ? "grey.50" : "white",
                          }}
                        >
                          <TableCell align="center">
                            <Typography
                              fontWeight="medium"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                              }}
                            >
                              <PersonIcon fontSize="small" color="primary" />
                              {student.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {student.parentPhones &&
                            student.parentPhones.length > 0 ? (
                              student.parentPhones.map((phone, index) => (
                                <Chip
                                  key={index}
                                  label={phone}
                                  color="info"
                                  variant="outlined"
                                  size="small"
                                  sx={{ fontWeight: "medium", m: 0.5 }}
                                />
                              ))
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                No parent phones
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell align="center">
                            <Chip
                              label={student.plan}
                              color="info"
                              variant="outlined"
                              size="small"
                              sx={{ fontWeight: "medium" }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                          <Alert
                            severity={studentSearchTerm ? "warning" : "info"}
                            sx={{ display: "inline-flex" }}
                          >
                            {studentSearchTerm
                              ? "No students found matching your search criteria"
                              : "No students enrolled in this class yet"}
                          </Alert>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {totalStudentsPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Pagination
                    count={totalStudentsPages}
                    page={studentsPage}
                    onChange={(e, page) => setStudentsPage(page)}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Students Dialog (kept for compatibility) */}
        <Dialog
          open={openStudentsDialog}
          onClose={() => setOpenStudentsDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
            Class Students
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <List>
              {classDetails?.classStudents?.length > 0 ? (
                classDetails.classStudents.map((student) => (
                  <ListItem
                    key={student.id}
                    sx={{ bgcolor: "grey.50", mb: 1, borderRadius: 1 }}
                  >
                    <ListItemText
                      primary={student.name}
                      secondary={`Plan: ${student.plan} | ID: #${student.id}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Alert severity="info">No students found in this class</Alert>
              )}
            </List>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setOpenStudentsDialog(false)}
              variant="contained"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ManageClass;
