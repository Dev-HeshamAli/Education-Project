import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  Button,
  Stack,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import LanguageIcon from "@mui/icons-material/Language";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PublicIcon from "@mui/icons-material/Public";

const ChossePage = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState(
    sessionStorage.getItem("lang") || "ar"
  );

  useEffect(() => {
    const hasChosen = sessionStorage.getItem("hasChosenLevel");
    if (!hasChosen) {
      setOpen(true);
    }
  }, []);

  const levels = [
    {
      id: "kindergarten",
      label: {
        en: "Kindergarten - Primary",
        ar: "رياض أطفال - ابتدائي",
      },
      icon: <AutoStoriesIcon sx={{ fontSize: 32 }} />,
      route: "/",
    },
    {
      id: "secondary",
      label: {
        en: "Prep - Thanaweya Amma",
        ar: "إعدادي - ثانوي عام",
      },
      icon: <MenuBookIcon sx={{ fontSize: 32 }} />,
      route: "/secondary",
    },
    {
      id: "ig",
      label: {
        en: "IG - American",
        ar: "IG - أمريكي",
      },
      icon: <PublicIcon sx={{ fontSize: 32 }} />,
      route: "/ig-school",
    },
  ];

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    sessionStorage.setItem("lang", lang);
  };

  const handleNavigate = (level) => {
    sessionStorage.setItem("educationLevel", level.id);
    sessionStorage.setItem("hasChosenLevel", "true");
    setOpen(false);
    navigate(level.route);
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(15px)",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
      }}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(135deg, #fff 0%, #fff5f0 100%)",
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        {/* Header with Icon */}
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              color: "#1f2937",
              mb: 1,
            }}
          >
            {language === "en" ? "Welcome" : "مرحباً بك!"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            {language === "en"
              ? "Choose your language and education level"
              : "اختر اللغة والمرحلة التعليمية"}
          </Typography>
        </Box>

        {/* Language Selection */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: "1px solid #fed7aa",
            background: "white",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            mb={2}
            justifyContent={"center"}
          >
            {/* <LanguageIcon sx={{ color: "#fb923c", fontSize: 25 }} /> */}
            <Typography
              variant="subtitle2"
              fontWeight="600"
              sx={{ color: "#374151", fontSize: "20px" }}
            >
              {language === "en" ? "Choose Language" : "اختر اللغة"}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="center" gap={2}>
            <Button
              fullWidth
              variant={language === "en" ? "contained" : "outlined"}
              onClick={() => handleLanguageChange("en")}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "15px",
                borderColor: "#fb923c",
                color: language === "en" ? "white" : "#fb923c",
                background:
                  language === "en"
                    ? "linear-gradient(135deg, #fb923c 0%, #f97316 100%)"
                    : "transparent",
                "&:hover": {
                  borderColor: "#f97316",
                  background:
                    language === "en"
                      ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                      : "rgba(251, 146, 60, 0.08)",
                },
                boxShadow:
                  language === "en"
                    ? "0 4px 12px rgba(251, 146, 60, 0.3)"
                    : "none",
              }}
            >
              English
            </Button>
            <Button
              fullWidth
              variant={language === "ar" ? "contained" : "outlined"}
              onClick={() => handleLanguageChange("ar")}
              sx={{
                py: 1.5,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "15px",
                borderColor: "#fb923c",
                color: language === "ar" ? "white" : "#fb923c",
                background:
                  language === "ar"
                    ? "linear-gradient(135deg, #fb923c 0%, #f97316 100%)"
                    : "transparent",
                "&:hover": {
                  borderColor: "#f97316",
                  background:
                    language === "ar"
                      ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                      : "rgba(251, 146, 60, 0.08)",
                },
                boxShadow:
                  language === "ar"
                    ? "0 4px 12px rgba(251, 146, 60, 0.3)"
                    : "none",
              }}
            >
              عربي
            </Button>
          </Stack>
        </Paper>

        {/* Education Level Selection */}
        <Typography
          variant="subtitle2"
          fontWeight="600"
          textAlign="center"
          mb={2}
          sx={{ color: "#374151", fontSize: "20px" }}
        >
          {language === "en"
            ? " Select Education Level"
            : " اختر المرحلة التعليمية"}
        </Typography>

        <Stack spacing={2} gap={1}>
          {levels.map((level) => (
            <Button
              key={level.id}
              variant="outlined"
              size="large"
              onClick={() => handleNavigate(level)}
              sx={{
                py: 2.5,
                px: 3,

                borderRadius: 3,
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                borderColor: "#fed7aa",
                borderWidth: 2,
                color: "#1f2937",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#fb923c",
                  background:
                    "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                  color: "white",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 16px rgba(251, 146, 60, 0.3)",
                  "& .level-icon": {
                    color: "white",
                  },
                },
              }}
            >
              {level.label[language]}
            </Button>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ChossePage;
