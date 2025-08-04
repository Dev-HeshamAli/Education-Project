// --------------------------------------------
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  MenuItem,
  Select,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { actStudyLevel } from "../../store/academicYear/studyLevel/actStudyLevel";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Stage-to-Level Mapping
const studyLevelMap = {
  Kindergarten: [
    { label: "Kindergarten One", value: "Kg1" },
    { label: "Kindergarten Two", value: "Kg2" },
  ],
  Primary: [
    { label: "Primary One", value: "Pr1" },
    { label: "Primary Two", value: "Pr2" },
    { label: "Primary Three", value: "Pr3" },
    { label: "Primary Four", value: "Pr4" },
  ],
};

// Yup validation schema
const schema = yup.object().shape({
  stage: yup.string().required("Stage is required"),
  name: yup.string().required("Level is required"),
});

const CreateSL = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [stages, setStages] = useState([]);
  const [existingLevels, setExistingLevels] = useState([]);

  const { loading, error, success } = useSelector((state) => state.studyLevel);

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const {
    handleSubmit,
    control,
    watch,
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

  const selectedStage = watch("stage");

  // Fetch stages
  useEffect(() => {
    const fetchStages = async () => {
      try {
        const { data } = await axios.get(
          "https://edu-smart.runasp.net/api/Shared/Stages",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStages(data);
      } catch (err) {
        console.error("Failed to fetch stages:", err);
      }
    };

    fetchStages();
  }, [token]);

  // Fetch existing levels
  useEffect(() => {
    const fetchExistingLevels = async () => {
      try {
        const { data } = await axios.get(
          "https://edu-smart.runasp.net/api/Shared/StudyLevels",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const normalized = data.map((item) =>
          item.level?.toLowerCase().replace(/\s/g, "")
        );
        setExistingLevels(normalized);
      } catch (err) {
        console.error("Failed to fetch study levels:", err);
      }
    };

    fetchExistingLevels();
  }, [token]);

  // Handle success/error messages
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

  // Submit handler
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

          {message && (
            <Typography
              variant="body2"
              align="center"
              sx={{
                color: messageType === "success" ? "green" : "red",
                mb: 2,
              }}
            >
              {message}
            </Typography>
          )}

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
                      setValue("name", ""); // Reset level
                    }}
                  >
                    {Object.keys(studyLevelMap).map((stage) => (
                      <MenuItem key={stage} value={stage}>
                        {stage}
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

            {/* Level Dropdown */}
            <FormControl fullWidth required>
              <InputLabel>Level</InputLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Level">
                    {(studyLevelMap[selectedStage] || []).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.name && (
                <Typography variant="caption" color="error">
                  {errors.name.message}
                </Typography>
              )}
            </FormControl>

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
