import PersonAdd from "@mui/icons-material/PersonAdd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actLogout } from "../../../store/auth/logout/actLogout";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  ListItemIcon,
  Divider,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../store/auth/authSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);

  const { userid, token, refreshToken } = useSelector((state) => state.auth);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setLoading(true);
    dispatch(
      actLogout({ data: { userId: userid, refToken: refreshToken }, token })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(logout());
      }
      setLoading(false);
    });
    handleClose();
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "#fff",
                color: "#1976d2",
                fontWeight: "bold",
              }}
            >
              A
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => navigate("/dashboard/update-admin")}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate("/dashboard/create-admin")}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Loader */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
