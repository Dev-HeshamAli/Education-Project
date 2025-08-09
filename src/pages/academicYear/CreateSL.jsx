import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  CircularProgress,
  MenuItem,
  TextField,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { actStudyLevel } from "../../store/academicYear/studyLevel/actStudyLevel";
import { fetchStages } from "../../store/shared/stage/actGetStage";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  stage: yup.string().required("Stage is required"),
  name: yup.string().required("Level name is required"),
});

const CreateSL = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const { loading, error, success } = useSelector((state) => state.studyLevel);
  const stages = useSelector((state) => state.stageId.list || []);

  const [existingLevels, setExistingLevels] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      stage: "",
      name: "",
    },
  });

  // ✅ Fetch stages from Redux
  useEffect(() => {
    dispatch(fetchStages());
  }, [dispatch]);

  // ✅ Fetch existing levels from API
  // useEffect(() => {
  //   const fetchExistingLevels = async () => {
  //     try {
  //       const { data } = await fetch(
  //         "https://edu-smart.runasp.net/api/Shared/StudyLevels",
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       ).then((res) => res.json());

  //       const normalized = data.map((item) =>
  //         item.level?.toLowerCase().replace(/\s/g, "")
  //       );
  //       setExistingLevels(normalized);
  //     } catch (err) {
  //       console.error("Failed to fetch study levels:", err);
  //     }
  //   };

  //   fetchExistingLevels();
  // }, [token]);

  useEffect(() => {
    const fetchExistingLevels = async () => {
      try {
        const res = await fetch(
          "https://edu-smart.runasp.net/api/Shared/StudyLevels",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();

        const levels = json.data || []; // تأكيد وجود data
        const normalized = levels.map((item) =>
          item.level?.toLowerCase().replace(/\s/g, "")
        );

        setExistingLevels(normalized);
      } catch (err) {
        console.error("Failed to fetch study levels:", err);
      }
    };

    fetchExistingLevels();
  }, [token]);

  // ✅ Handle success/error messages
  useEffect(() => {
    if (success) {
      setMessage("Study Level added successfully.");
      setMessageType("success");
      reset();
    } else if (error) {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    }

    if (success || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, reset]);

  // ✅ Submit handler
  const onSubmit = (formData) => {
    const matchedStage = stages.find(
      (s) => s.name.toLowerCase() === formData.stage.toLowerCase()
    );

    const normalizedLevel = formData.name.toLowerCase().replace(/\s/g, "");

    if (existingLevels.includes(normalizedLevel)) {
      setMessage("This level already exists.");
      setMessageType("error");
      setTimeout(() => {
        setMessage(null);
        setMessageType("");
      }, 3000);
      return;
    }

    const payload = {
      name: formData.name,
      stageId: matchedStage?.id || null,
    };

    dispatch(actStudyLevel({ data: payload, token }));
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f9f9f9"
    >
      <Card sx={{ width: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" mb={2} align="center">
            Create Study Level
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Stage Dropdown */}
            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel>Stage</InputLabel>
              <Controller
                name="stage"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Stage"
                    onChange={(e) => {
                      setValue("stage", e.target.value);
                      setValue("name", ""); // Reset level input
                    }}
                  >
                    {stages.map((stage) => (
                      <MenuItem key={stage.id} value={stage.name}>
                        {stage.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.stage && (
                <Typography variant="caption" color="error">
                  {errors.stage.message}
                </Typography>
              )}
            </FormControl>

            {/* Level Input (TextField) */}
            <Controller
              name="name"
              control={control}
              rules={{ required: "Level name is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Level Name"
                  variant="outlined"
                  margin="normal"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            {message && (
              <Alert
                severity={messageType}
                sx={{
                  color: messageType === "success" ? "green" : "red",
                }}
              >
                {message}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              {loading ? "Adding..." : "Add Study Level"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateSL;
