// AppBarHeader.jsx
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { Link, useNavigate } from "react-router-dom";
import Profile from "../../pages/admin/profile/Profile";
const drawerWidth = 300;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
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
      <Toolbar>
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
          <MenuIcon />
        </IconButton>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Link to="/home" className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#fff]">
                Edu-Smart.ai
              </span>
            </Link>
          </Box>
          <Box>
            <Typography
              onClick={() => navigate("/dashboard")}
              variant="h6"
              sx={{
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
                textTransform: "capitalize",
                cursor: "pointer",
                "&:hover": {
                  color: "#fff",
                  fontWeight: "bold",
                  scale: "1.03",
                  transition: "all 0.2s ease-in-out",
                },
              }}
            >
              DASHBOARD
            </Typography>
          </Box>

          <Box>
            <Profile />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}