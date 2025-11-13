import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../../pages/admin/profile/Profile";
import Logo from "../sidbar/Logo";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function AppBarHeader({ open, handleDrawerOpen }) {
  const navigate = useNavigate();

  return (
    <AppBar sx={{ bgcolor: "#2972b1" }} position="fixed" open={open}>
      <Toolbar className="px-2 sm:px-4">
        {/* زرار فتح القائمة */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            mr: 2,
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon sx={{ color: "#fff", fontSize: "1.8rem" }} />
        </IconButton>

        {/* Grid Layout */}
        <Box className="grid grid-cols-3 w-full items-center gap-2 sm:gap-4">
          {/* Logo */}
          <Box className="flex items-center justify-start gap-2">
            <Link
              to="/home"
              className="flex items-center"
              title="الصفحة الرئيسية"
            >
              {/* نص يظهر من md فقط */}
              <span className="hidden md:block text-xl font-extrabold text-white">
                EDU-SMART.AI
              </span>
              <Logo />
            </Link>
          </Box>

          {/* Dashboard Link */}
          <Box className="flex justify-center">
            <span
              onClick={() => navigate("/dashboard")}
              className="text-white font-bold text-sm sm:text-base md:text-lg cursor-pointer transition-transform duration-200 hover:scale-105"
            >
              DASHBOARD
            </span>
          </Box>

          {/* Profile */}
          <Box className="flex justify-end">
            <Profile />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}