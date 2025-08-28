import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  Alert,
  DialogTitle,
  DialogContent,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  List,
} from "@mui/material";

import {
  setPlanId,
  setAcademicYearId,
  setCourseId,
} from "../../../store/LOCAL_DATA/selectinIdsSlice";
import CreateCourse from "../CreateCourse";
import UpdateCourse from "../UpdateCourse";
import DeleteCourse from "../DeleteCourse";

import { useDispatch, useSelector } from "react-redux";
import { actGetAllCoursesTableDetails } from "../../../store/shared/data/allCoursesTable/actGetAllCoursesTableDetails";
import { actDeleteTeacherFromCourse } from "../../../store/addTeacherToCourse/deleteTeacherFromCourse/actDeleteTeacherFromCourse";
import { resetDeleteTeacherFromCourseState } from "../../../store/addTeacherToCourse/deleteTeacherFromCourse/deleteTeacherFromCourseSlice";
import { actGetLevelsAndSemesters } from "../../../store/shared/data/allLevelsAndSemester/actGetLevelsAndSemesters";
import { fetchPlans } from "../../../store/shared/plan/actGetPlan";
import { fetchAcademicYears } from "../../../store/shared/academicYears/actGetAcademicYears";
import Sidebar from "./Sidebar";
import { GridAddIcon } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import AddTeacherToCourse from "../../adminActionToTeacher/AddTeacherToCourse";
const AllDetailsCourses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const plans = useSelector((state) => state.plansId.list);
  const academicYears = useSelector((state) => state.academicYearsId.list);
  const allLevels = useSelector((state) => state.allLevels.list);
  const courses = useSelector((state) => state.allCoursesTableDetails.list);

  const [createCourse, setCreateCourse] = useState(false);
  const [updateCourse, setUpdateCourse] = useState(false);
  const [deleteCourse, setDeleteCourse] = useState(false);
  const [selectedCourseData, setSelectedCourseData] = useState(null);
  const [openTeachersDialog, setOpenTeachersDialog] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [addTeacher, setAddTeachers] = useState(false);

  const { courseId } = useSelector((state) => state.selectionIds);

  const { successMessage: successMessageCreate } = useSelector(
    (state) => state.createCourse
  );
  const { success: successDelete } = useSelector((state) => state.deleteCourse);
  const { successMessage: successUpdate } = useSelector(
    (state) => state.updateCourse
  );
  const { successMessage: successAddCourseToP } = useSelector(
    (state) => state.addCourseToPlan
  );
  const { successMessage: successDeleteCourseFromP } = useSelector(
    (state) => state.deleteCourseFromPlan
  );
  const {
    success: successDeleteTeacher,
    error: errorDeleteTeacher,
    loading: loadingDeleteTeacher,
  } = useSelector((state) => state.removeTeacherFromCourse);
  const { success: successAddTeacher } = useSelector(
    (state) => state.addTeacherToCourse
  );
  const { planId, academicYearId, semesterId, studyLevelId } = useSelector(
    (state) => state.selectionIds
  );

  useEffect(() => {
    dispatch(fetchPlans(token));
    dispatch(fetchAcademicYears(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (planId && academicYearId) {
      dispatch(
        actGetLevelsAndSemesters({
          token,
          planId,
          academicYearId,
        })
      );
    }
  }, [dispatch, token, planId, academicYearId]);
  useEffect(() => {
    if (planId && studyLevelId && semesterId && academicYearId) {
      dispatch(
        actGetAllCoursesTableDetails({
          token,
          planId,
          studyLevelId,
          semesterId,
          academicYearId,
        })
      );
    }
  }, [dispatch, token, planId, studyLevelId, semesterId, academicYearId]);

  useEffect(() => {
    if (
      successMessageCreate ||
      successDelete ||
      successUpdate ||
      successAddCourseToP ||
      successDeleteCourseFromP ||
      successDeleteTeacher ||
      successAddTeacher
    ) {
      dispatch(
        actGetAllCoursesTableDetails({
          token,
          planId,
          studyLevelId,
          semesterId,
          academicYearId,
        })
      );
    }
  }, [
    successMessageCreate,
    successDelete,
    successUpdate,
    successAddCourseToP,
    successDeleteCourseFromP,
    dispatch,
    token,
    planId,
    studyLevelId,
    semesterId,
    academicYearId,
    successDeleteTeacher,
    successAddTeacher,
  ]);

  const handleDeleteTeacher = (teacherId) => {
    if (window.confirm("Are you sure you want to delete this teacher?"))
      dispatch(
        actDeleteTeacherFromCourse({
          teacherId: teacherId,
          courseId: courseId,
          token,
        })
      );
  };

  const handelViewTeachers = (course) => {
    setSelectedTeachers(course.teachers);
    setOpenTeachersDialog(true);
    dispatch(setCourseId(course.id));
  };

  useEffect(() => {
    if (successDeleteTeacher || errorDeleteTeacher) {
      const timer = setTimeout(() => {
        dispatch(resetDeleteTeacherFromCourseState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, successDeleteTeacher, errorDeleteTeacher]);

  return (
    <Box sx={{ display: "flex", flexDirection: "space-between" }}>
      {allLevels?.levels?.length > 0 && (
        <Box
          sx={{
            flex: 1,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            px: 2,
            overflowY: "auto",
            borderRight: "2px solid #eee",
            bgcolor: "#2972b1",
          }}
        >
          <Typography mt={2} align="center" variant="h5" color="white">
            Choose Level
          </Typography>
          <Typography align="center" variant="h6" color="white">
            {allLevels.planName} ({allLevels.academicYearName})
          </Typography>
          <Sidebar levels={allLevels.levels} />
        </Box>
      )}

      <Box flex={5} p={3}>
        {createCourse && (
          <Dialog onClose={() => setCreateCourse(false)} open={createCourse}>
            <CreateCourse onClose={() => setCreateCourse(false)} />
          </Dialog>
        )}
        {updateCourse && (
          <Dialog onClose={() => setUpdateCourse(false)} open={updateCourse}>
            <UpdateCourse
              onClose={() => setUpdateCourse(false)}
              courseData={selectedCourseData}
            />
          </Dialog>
        )}

        {deleteCourse && (
          <Dialog onClose={() => setDeleteCourse(false)} open={deleteCourse}>
            <DeleteCourse
              onClose={() => setDeleteCourse(false)}
              courseData={selectedCourseData} // تمرير بيانات الكورس
            />
          </Dialog>
        )}
        {/* {addTeacher && (
          <Dialog onClose={() => setAddTeachers(false)} open={addTeacher}>
            <AddTeacherToCourse onClose={() => setAddTeachers(false)} />
          </Dialog>
        )} */}

        {addTeacher && (
          <Dialog onClose={() => setAddTeachers(false)} open={addTeacher}>
            <AddTeacherToCourse
              onClose={() => setAddTeachers(false)}
              onTeacherAdded={(teacher) => {
                setSelectedTeachers((prev) => [...prev, teacher]); // ← تحديث القائمة مباشرة
              }}
            />
          </Dialog>
        )}

        <Dialog
          open={openTeachersDialog}
          onClose={() => setOpenTeachersDialog(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: { borderRadius: 3, p: 2 }, // كورنر ناعم + padding داخلي
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "20px",
              color: "#2a4155",
              borderBottom: "1px solid #eee",
              mb: 2,
            }}
          >
            Teachers List in this course
          </DialogTitle>

          {successDeleteTeacher && (
            <Alert sx={{ mb: 2 }} variant="outlined" severity="success">
              Teacher deleted successfully
            </Alert>
          )}
          {errorDeleteTeacher && (
            <Alert sx={{ mb: 2 }} variant="outlined" severity="error">
              {errorDeleteTeacher}
            </Alert>
          )}
          {loadingDeleteTeacher && (
            <Alert sx={{ mb: 2 }} variant="outlined" severity="info">
              Deleting teacher...
            </Alert>
          )}

          <DialogContent>
            <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ ml: "auto", fontWeight: "bold", fontSize: "12px" }}
                startIcon={<Plus size={16} />}
                onClick={() => setAddTeachers(true)}
              >
                Add Teacher
              </Button>
              {selectedTeachers.map((teacher) => (
                <ListItem
                  key={teacher.id}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    boxShadow: 1,
                    p: 2,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={teacher.photo}
                      alt={teacher.name}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={teacher.name}
                    primaryTypographyProps={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#2a4155",
                    }}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<Trash2 size={16} />}
                    onClick={() => handleDeleteTeacher(teacher.id)}
                  >
                    delete
                  </Button>
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>

        <Box display="flex" gap={2} mb={3}>
          <FormControl fullWidth>
            <InputLabel>Plan</InputLabel>
            <Select
              value={planId || ""}
              onChange={(e) => dispatch(setPlanId(e.target.value))}
            >
              {plans?.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Academic Year</InputLabel>
            <Select
              value={academicYearId || ""}
              onChange={(e) => dispatch(setAcademicYearId(e.target.value))}
            >
              {academicYears?.map((y) => (
                <MenuItem key={y.id} value={y.id}>
                  {y.date}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {courses.length > 0 ? (
          <TableContainer component={Paper}>
            <Typography align="center" variant="h5" mb={2}>
              Courses Details Table
              <span style={{ margin: " 0 10px", fontWeight: "bold" }}>
                Plan ( {allLevels?.planName} )
              </span>
              <span style={{ margin: " 0 10px", fontWeight: "bold" }}>
                Academic Year ( {allLevels?.academicYearName} )
              </span>
            </Typography>
            <Button
              sx={{ mr: 2, my: 2 }}
              variant="contained"
              color="primary"
              startIcon={<GridAddIcon />}
              onClick={() => setCreateCourse(true)}
            >
              Create Course
            </Button>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Description</TableCell>
                  <TableCell align="center"> Old Price</TableCell>
                  <TableCell align="center"> Discount</TableCell>
                  <TableCell align="center">Final Price</TableCell>
                  <TableCell align="center">Teacher</TableCell>
                  <TableCell align="center">Paln</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses?.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell
                      align="center"
                      sx={{
                        color: "#1976d2",
                        fontSize: "16px",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => {
                        navigate("/dashboard/lectures-in-course");
                        dispatch(setCourseId(course.id));
                      }}
                    >
                      {course.name}
                    </TableCell>
                    <TableCell align="center">{course.description}</TableCell>
                    <TableCell align="center">{course.oldPrice}</TableCell>
                    <TableCell align="center">
                      {course.discountPercentage * 100}%
                    </TableCell>
                    <TableCell align="center">{course.finalPrice}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="text"
                        onClick={() => handelViewTeachers(course)}
                      >
                        View Teachers ({course.teachers?.length})
                      </Button>
                    </TableCell>{" "}
                    <TableCell align="center">
                      {course.coursesInPlans.map((c) => c.planName).join(", ")}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => {
                          setSelectedCourseData({
                            ...course,
                            studyLevelId,
                          });
                          setUpdateCourse(true);
                        }}
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => {
                          setSelectedCourseData(course); // تمرير بيانات الكورس الكاملة
                          setDeleteCourse(true);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {courses?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No Courses Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info" sx={{ mb: 3 }}>
            No Courses Found
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default AllDetailsCourses;
