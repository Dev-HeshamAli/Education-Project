import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Paper,
  Dialog,
  Box,
  Chip,
} from "@mui/material";
import { Edit, Trash2, Plus } from "lucide-react";
import LecDetails from "./LecDetails";
import { useState } from "react";
import CreateDay from "./CreateDay";
import AddLecToSchedule from "../AddLecToSchedule";
import { useSelector } from "react-redux";

// ترتيب أيام الأسبوع للمرجع
const daysOfWeek = [
  "السبت",
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
];

// الأيام المتاحة للإنشاء
const availableDays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];

export default function ScheduleTable({ data = [], academicScheduleId }) {
  const [lecDetailsOpen, setLecDetailsOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [openAddLec, setopenAddLec] = useState(false);
  const [openCreateDay, setopenCreateDay] = useState(false);
  const [scheduleDayesId, setscheduleDayesId] = useState(null);
  // const [newDay, setNewDay] = useState(null);
  const [scheduleDayesIdForUpdate, setscheduleDayesIdForUpdate] =
    useState(null);

  const { studyLevelId, semesterId } = useSelector(
    (state) => state.selectionIds
  );

  const handleOpenDetails = (lecture) => {
    console.log(lecture);
    setSelectedLecture(lecture);
    setLecDetailsOpen(true);
  };

  // استخراج الأيام الموجودة فعلياً في البيانات وترتيبها
  const getExistingDaysOrdered = () => {
    // استخراج الأيام الفريدة من البيانات
    const existingDays = [...new Set(data.map((d) => d.dayName))];

    // ترتيب الأيام حسب ترتيب أيام الأسبوع
    return existingDays.sort((a, b) => {
      return daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b);
    });
  };

  const existingDays = getExistingDaysOrdered();

  const handleOpenCreateLec = (day) => {

    // setNewDay(day);

    // دور على اليوم في الداتا
    const matchedDay = data.find((d) => d.dayName === day);

    if (matchedDay) {
      setscheduleDayesId(matchedDay.id);
    }
  };
  const handleOpenUpdateLec = (day) => {
    // دور على اليوم في الداتا
    const matchedDay = data.find((d) => d.dayName === day);

    if (matchedDay) {
      setscheduleDayesIdForUpdate(matchedDay.id);
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 3,
        boxShadow: 4,
        borderRadius: 3,
        direction: "rtl",
      }}
    >
      {/* Dialog لعرض تفاصيل المحاضرة */}
      {lecDetailsOpen && (
        <Dialog open={lecDetailsOpen} onClose={() => setLecDetailsOpen(false)}>
          <LecDetails
            lecture={selectedLecture}
            scheduleDayesIdForUpdate={scheduleDayesIdForUpdate}
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

      {openAddLec && (
        <Dialog
          open={openAddLec}
          onClose={() => setopenAddLec(false)}
          fullWidth
          maxWidth="md" // sm, md, lg, xl
          sx={{
            "& .MuiDialog-paper": {
              width: "700px", // العرض اللي يناسبك
              borderRadius: "12px",
            },
          }}
        >
          <AddLecToSchedule
            scheduleDayesId={scheduleDayesId}
            studyLevelId={studyLevelId}
            semesterId={semesterId}
            // newDay={newDay}
            onClose={() => setopenCreateDay(false)}
          />
        </Dialog>
      )}

      <Table>
        {/* عنوان الأعمدة */}
        <TableHead>
          <TableRow sx={{ bgcolor: "#2972b1" }}>
            <TableCell
              align="center"
              sx={{
                fontWeight: "bold",
                color: "white",
                fontSize: "16px",
                width: "15%",
                minWidth: "120px",
              }}
            >
              اليوم
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: "bold",
                color: "white",
                fontSize: "16px",
                width: "70%",
              }}
            >
              المحاضرات
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: "bold",
                color: "white",
                fontSize: "16px",
                width: "15%",
                minWidth: "150px",
              }}
            >
              الإجراءات
            </TableCell>
          </TableRow>
        </TableHead>

        {/* الصفوف = الأيام الموجودة فعلياً في البيانات */}
        <TableBody>
          {existingDays.length > 0 ? (
            existingDays.map((day, rowIndex) => {
              // نجيب المحاضرات الخاصة باليوم من الداتا
              const dayLectures = data
                .filter((d) => d.dayName === day)
                .flatMap((d) => d.lectures);

              return (
                <TableRow key={`${day}-${rowIndex}`} hover>
                  {/* اليوم */}
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      bgcolor: "#f5f5f5",
                      fontSize: "18px",
                      borderRight: "3px solid #315879",
                    }}
                  >
                    {day}
                  </TableCell>

                  {/* المحاضرات */}
                  <TableCell align="center">
                    {dayLectures.length > 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: "60px",
                        }}
                      >
                        {dayLectures.map((lecture) => (
                          <Chip
                            key={lecture.id}
                            label={
                              <Box sx={{ textAlign: "center" }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: "bold", fontSize: "13px" }}
                                >
                                  {lecture.courseName}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ fontSize: "11px", opacity: 0.8 }}
                                >
                                  {lecture.startTime.slice(0, 5)} -{" "}
                                  {lecture.endTime.slice(0, 5)}
                                </Typography>
                              </Box>
                            }
                            onClick={() => {
                              handleOpenDetails(lecture),
                                handleOpenUpdateLec(day);
                            }}
                            sx={{
                              bgcolor: lecture.isActive ? "#4caf50" : "#2196f3",
                              color: "white",
                              cursor: "pointer",
                              minWidth: "120px",
                              height: "auto",
                              padding: "8px 4px",
                              "&:hover": {
                                bgcolor: lecture.isActive
                                  ? "#45a049"
                                  : "#1976d2",
                                transform: "scale(1.02)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          minHeight: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          color="text.secondary"
                          fontSize="14px"
                          sx={{ fontStyle: "italic" }}
                        >
                          لا توجد محاضرات
                        </Typography>
                      </Box>
                    )}
                  </TableCell>

                  {/* الإجراءات */}
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <IconButton
                        color="primary"
                        title="اضافة محاضرة"
                        onClick={() => {
                          handleOpenCreateLec(day), setopenAddLec(true);
                        }}
                        sx={{
                          "&:hover": {
                            transform: "scale(1.1)",
                            bgcolor: "rgba(25, 118, 210, 0.1)",
                          },
                        }}
                      >
                        <Plus size={23} />
                      </IconButton>
                      {/* <IconButton
                        color="success"
                        title="تعديل محاضرة"
                        sx={{
                          "&:hover": {
                            transform: "scale(1.1)",
                            bgcolor: "rgba(76, 175, 80, 0.1)",
                          },
                        }}
                      >
                        <Edit size={20} />
                      </IconButton>
                      <IconButton
                        color="error"
                        title="حذف محاضرة"
                        sx={{
                          "&:hover": {
                            transform: "scale(1.1)",
                            bgcolor: "rgba(244, 67, 54, 0.1)",
                          },
                        }}
                      >
                        <Trash2 size={20} />
                      </IconButton> */}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            // رسالة عندما لا توجد أيام
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Box
                  sx={{
                    py: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    لا توجد أيام في الجدول الأكاديمي
                  </Typography>
                  <IconButton
                    onClick={() => setopenCreateDay(true)}
                    color="primary"
                    size="large"
                    sx={{
                      bgcolor: "rgba(25, 118, 210, 0.1)",
                      "&:hover": {
                        bgcolor: "rgba(25, 118, 210, 0.2)",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <Plus size={32} />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    اضغط لإضافة يوم جديد
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
