import { Autocomplete, TextField, Box, Avatar, Dialog } from "@mui/material";
import { Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeachersByName } from "../../store/shared/teacherByName/actGetTeacherByName";
import TeacherProfile from "./TeacherProfile";

const TeacherSearch = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const teacherNames = useSelector((state) => state.teacherByName?.list || []);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showTeacherProfile, setShowTeacherProfile] = useState(false);

  useEffect(() => {
    if (selectedTeacher) {
      setShowTeacherProfile(true);
      localStorage.setItem("2", selectedTeacher.id);
    }
  }, [selectedTeacher]);

  return (
    <div className="space-y-3">
      <Dialog
        open={showTeacherProfile}
        // onClose={() => setShowTeacherProfile(false)}
        fullWidth
      >
        <TeacherProfile
          teacher={selectedTeacher}
          onClose={() => setShowTeacherProfile(false)}
        />
      </Dialog>

      <div className="flex items-center justify-center space-x-2 mb-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Users className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-gray-700 font-semibold">Search for a teacher</h3>
      </div>

      <div className="relative">
        <Autocomplete
          options={teacherNames}
          getOptionLabel={(option) => option?.name || ""}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          value={selectedTeacher}
          onChange={(e, value) => setSelectedTeacher(value)}
          onInputChange={(e, value) => {
            if (value && value.length >= 2) {
              dispatch(fetchTeachersByName({ token, name: value }));
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Search Teacher" />
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

export default TeacherSearch;