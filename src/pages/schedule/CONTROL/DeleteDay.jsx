import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { resetDeleteScheduleDayState } from "../../../store/schedule/deleteScheduleDay/deleteScheduleDaySlice";
import { actDeleteScheduleDay } from "../../../store/schedule/deleteScheduleDay/actDeleteScheduleDay";

const DeleteDay = ({ daysOfWeek, onClose }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const { success, error } = useSelector((state) => state.deleteScheduleDay);

  const [selectedDay, setSelectedDay] = useState(null);

  const handleDelete = () => {
    if (!selectedDay) return;

    dispatch(actDeleteScheduleDay({ id: selectedDay.id, token }));
  };

  useEffect(() => {
    if (success || error) {
      const time = setTimeout(() => {
        dispatch(resetDeleteScheduleDayState());
      }, 3000);

      return () => clearTimeout(time);
    }
  }, [success, error, dispatch]);

  return (
    <>
      {success && (
        <Alert
          severity="success"
          sx={{
            m: 3,
          }}
        >
          {success}
        </Alert>
      )}
      {error && (
        <Alert
          severity="error"
          sx={{
            m: 3,
          }}
        >
          {error}
        </Alert>
      )}
      <DialogTitle>مسح يوم</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* اختيار يوم من الجدول */}
          <FormControl fullWidth>
            <InputLabel>اختر يوم من الجدول</InputLabel>
            <Select
              value={selectedDay ? selectedDay.id : ""}
              label="اختر يوم من الجدول"
              onChange={(e) => {
                const day = daysOfWeek.find((d) => d.id === e.target.value);
                setSelectedDay(day);
              }}
            >
              {daysOfWeek.map((day) => (
                <MenuItem key={day.id} value={day.id}>
                  {day.dayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* رسالة تحذيرية */}
          {selectedDay && (
            <Typography sx={{ color: "red", fontWeight: "bold" }}>
              سيتم مسح اليوم: {selectedDay.dayName}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={!selectedDay}
        >
          مسح
        </Button>
      </DialogActions>
    </>
  );
};

export default DeleteDay;
