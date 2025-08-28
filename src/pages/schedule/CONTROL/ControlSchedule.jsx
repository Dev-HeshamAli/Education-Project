import { fetchSemesters } from "../../../store/shared/semesters/actGetSemesters";
import { fetchStudyLevels } from "../../../store/shared/studyLevel/actGetStudyLevels";
import { fetchAcademicYears } from "../../../store/shared/academicYears/actGetAcademicYears";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Card,
  CardContent,
  Typography,
  Stack,
  Alert,
  Button,
  Divider,
  Dialog,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScheduleTable from "./ScheduleTable";
import CreateSchedule from "../CreateSchedule";
import UpdateSchedule from "../UpdateSchedule";
import CreateDay from "./CreateDay";
import UpdateDay from "./UpdateDay";
import DeleteDay from "./DeleteDay";

import {
  setAcademicYearId,
  setSemesterId,
  setStudyLevelId,
  setScheduleId,
} from "../../../store/LOCAL_DATA/selectinIdsSlice";

import { actGetScheduleInfo } from "../../../store/shared/getScheduleId/schedule/actGetScheduleInfo";
import { GridAddIcon } from "@mui/x-data-grid";
import { Edit, Trash2 } from "lucide-react";

const ControlSchedule = () => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const { studyLevelId, academicYearId, semesterId } = useSelector(
    (state) => state.selectionIds
  );

  const availableDays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];

  const studyLevels = useSelector((state) => state.studyLevelsId.list);
  const academicYears = useSelector((state) => state.academicYearsId.list);
  const semesters = useSelector((state) => state.semestersId.list);
  const scheduleInfo = useSelector((state) => state.getScheduleInfo.list);

  const scheduleDayes = scheduleInfo.scheduleDayes || [];
  const academicScheduleId = scheduleInfo.id || null;

  // console.log("academicScheduleId:", academicScheduleId);
  // console.log("scheduleDayes:", scheduleDayes);

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openCreateDay, setopenCreateDay] = useState(false);
  const [openUpdateDay, setopenUpdateDay] = useState(false);
  const [openDeleteDay, setopenDeleteDay] = useState(false);

  const { success: createSuccess } = useSelector(
    (state) => state.createSchedule
  );
  const { success: deleteSuccess } = useSelector(
    (state) => state.deleteSchedule || {}
  );
  const { success: updateSuccess } = useSelector(
    (state) => state.updateSchedule || {}
  );
  const { success: updateDaySuccess } = useSelector(
    (state) => state.updateScheduleDay
  );
  const { success: createDaySuccess } = useSelector(
    (state) => state.createScheduleDay
  );
  const { success: deleteDaySuccess } = useSelector(
    (state) => state.deleteScheduleDay
  );
  const { success: addLecSuccess } = useSelector(
    (state) => state.addLecToSchedule
  );
  const { success: updateLecSuccess } = useSelector(
    (state) => state.updateLecToSchedule
  );
  const { success: deleteLecSuccess } = useSelector(
    (state) => state.deleteLecFromSchedule
  );

  useEffect(() => {
    dispatch(fetchStudyLevels());
    dispatch(fetchSemesters());
    dispatch(fetchAcademicYears());
  }, [dispatch]);
  useEffect(() => {
    if (
      (studyLevelId && semesterId && academicYearId) ||
      createSuccess ||
      deleteSuccess ||
      updateSuccess ||
      updateDaySuccess ||
      createDaySuccess ||
      deleteDaySuccess ||
      addLecSuccess ||
      updateLecSuccess ||
      deleteLecSuccess
    ) {
      dispatch(
        actGetScheduleInfo({
          token,
          studyLevelId,
          semesterId,
          academicYearId,
        })
      ).then((res) => {
        if (res.payload?.id) {
          dispatch(setScheduleId(res.payload.id));
        }
      });
    }
  }, [
    studyLevelId,
    semesterId,
    academicYearId,
    dispatch,
    token,
    createSuccess,
    deleteSuccess,
    updateSuccess,
    updateDaySuccess,
    createDaySuccess,
    deleteDaySuccess,
    addLecSuccess,
    updateLecSuccess,
    deleteLecSuccess,
  ]);

  return (
    <Box sx={{ p: 3 }}>
      {openCreate && (
        <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
          <CreateSchedule
            studyLevelId={studyLevelId}
            semesterId={semesterId}
            academicYearId={academicYearId}
          />
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <UpdateSchedule
            studyLevelId={studyLevelId}
            semesterId={semesterId}
            academicYearId={academicYearId}
            name={scheduleInfo.name}
            action="delete"
          />
        </Dialog>
      )}
      {openUpdate && (
        <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
          <UpdateSchedule
            studyLevelId={studyLevelId}
            semesterId={semesterId}
            academicYearId={academicYearId}
            name={scheduleInfo.name}
            action="update"
          />
        </Dialog>
      )}

      {/* Dialog لإنشاء يوم جديد */}
      {openCreateDay && (
        <Dialog open={openCreateDay} onClose={() => setopenCreateDay(false)}>
          <CreateDay
            academicScheduleId={academicScheduleId}
            daysOfWeek={availableDays}
            onClose={() => setopenCreateDay(false)}
          />
        </Dialog>
      )}
      {openUpdateDay && (
        <Dialog open={openUpdateDay} onClose={() => setopenUpdateDay(false)}>
          <UpdateDay
            daysOfWeek={scheduleDayes}
            availableDays={availableDays}
            onClose={() => setopenUpdateDay(false)}
          />
        </Dialog>
      )}
      {openDeleteDay && (
        <Dialog open={openDeleteDay} onClose={() => setopenDeleteDay(false)}>
          <DeleteDay
            daysOfWeek={scheduleDayes}
            onClose={() => setopenDeleteDay(false)}
          />
        </Dialog>
      )}

      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: "bold", mb: 3 }}
      >
        Schedule Management
      </Typography>

      {/* Filters Card */}
      <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="stretch"
          >
            {/* Study Level */}
            <FormControl fullWidth>
              <InputLabel>Study Level</InputLabel>
              <Select
                value={studyLevelId ?? ""}
                onChange={(e) => dispatch(setStudyLevelId(e.target.value))}
                label="Study Level"
              >
                {studyLevels.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Semester */}
            <FormControl fullWidth>
              <InputLabel>Semester</InputLabel>
              <Select
                value={semesterId ?? ""}
                onChange={(e) => dispatch(setSemesterId(e.target.value))}
                label="Semester"
              >
                {semesters.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Academic Year */}
            <FormControl fullWidth>
              <InputLabel>Academic Year</InputLabel>
              <Select
                value={academicYearId ?? ""}
                onChange={(e) => dispatch(setAcademicYearId(e.target.value))}
                label="Academic Year"
              >
                {academicYears.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.date}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
        {studyLevelId &&
          semesterId &&
          academicYearId &&
          (scheduleInfo && scheduleInfo.id ? (
            <></>
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={{
                my: 2,
                mr: 2,
                fontSize: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                float: "right",
              }}
              startIcon={<GridAddIcon />}
              onClick={() => setOpenCreate(true)}
            >
              Create Schedule
            </Button>
          ))}
      </Card>
      {studyLevelId && semesterId && academicYearId ? (
        scheduleInfo ? (
          scheduleInfo.id ? (
            <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    textAlign: "center",
                    mb: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "28px",
                      color: "#2a4155",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    <span>
                      <IconButton
                        onClick={() => setOpenDelete(true)}
                        color="error"
                        title="حذف الجدول"
                      >
                        <Trash2 size={28} />
                      </IconButton>
                      <IconButton
                        onClick={() => setOpenUpdate(true)}
                        color="success"
                        title="تعديل الجدول"
                      >
                        <Edit size={28} />
                      </IconButton>
                    </span>
                    {scheduleInfo?.name ? scheduleInfo.name : "Schedule"}
                  </Typography>
                  <Divider sx={{ width: "60%", mx: "auto" }} />
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setopenCreateDay(true)}
                    >
                      Add Day to Schedule
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => setopenUpdateDay(true)}
                    >
                      Update Day In Schedule
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setopenDeleteDay(true)}
                    >
                      Delete Day From Schedule
                    </Button>
                  </Box>
                </Box>

                <ScheduleTable
                  data={scheduleDayes}
                  academicScheduleId={academicScheduleId}
                />
              </CardContent>
            </Card>
          ) : (
            <Alert
              severity="info"
              sx={{
                mt: 2,
                color: "gray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              No schedule found for the selected study level, semester, and
              academic year.
            </Alert>
          )
        ) : null
      ) : (
        <Typography align="center" sx={{ mt: 2, color: "gray" }}>
          Select a study level, semester, and academic year to view the
          schedule.
        </Typography>
      )}
    </Box>
  );
};

export default ControlSchedule;
