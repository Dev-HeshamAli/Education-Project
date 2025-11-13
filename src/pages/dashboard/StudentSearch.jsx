import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actGetStudentByName } from "../../store/shared/studentByName/actGetStudentByName";
import { Autocomplete, TextField, Box, Avatar, Dialog } from "@mui/material";
import StudentProfile from "./StudentProfile";

const StudentSearch = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const studentNames = useSelector((state) => state.studentNames?.list || []);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentProfile, setShowStudentProfile] = useState(false);

  useEffect(() => {
    if (selectedStudent) {
      setShowStudentProfile(true);
      localStorage.setItem("3", selectedStudent.id);
    }
  }, [selectedStudent]);

  return (
    <div className="space-y-3">
      <Dialog
        open={showStudentProfile}
        onClose={() => setShowStudentProfile(false)}
        fullWidth
      >
        <StudentProfile
          teacher={selectedStudent}
          onClose={() => setShowStudentProfile(false)}
        />
      </Dialog>
      <div className="flex items-center justify-center space-x-2 mb-3">
        <div className="p-2 bg-green-50 rounded-lg">
          <User className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="text-gray-700 font-semibold">Search for a Student</h3>
      </div>

      <div className="relative">
        <Autocomplete
          options={studentNames}
          getOptionLabel={(option) => option?.name || ""}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          value={selectedStudent}
          onChange={(e, value) => setSelectedStudent(value)}
          onInputChange={(e, value) => {
            if (value && value.length >= 2) {
              dispatch(actGetStudentByName({ token, name: value }));
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Search Student" />
          )}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              key={option.id}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Avatar
                src={option.imageUrl}
                alt={option.name}
                sx={{ width: 32, height: 32 }}
              />
              {option.name}
            </Box>
          )}
        />
      </div>
    </div>
  );
};

export default StudentSearch;