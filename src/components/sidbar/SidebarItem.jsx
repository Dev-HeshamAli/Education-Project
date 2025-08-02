import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function SidebarItem({ item }) {
  const location = useLocation();
  const isSelected = location.pathname === item.link;

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        to={item.link}
        sx={{
          borderRadius: "0px 20px 20px 0px",
          mb: 0.5,
          transition: "all 0.2s ease-in-out",
          background: isSelected
            ? "linear-gradient(270deg, #8c57ff 0%, #c2aaff 100%)"
            : "transparent",
          "&:hover": { backgroundColor: "#ded1f8" },
        }}
      >
        <ListItemIcon sx={{ color: isSelected ? "#fff" : "#6d6777" }}>{item.icon}</ListItemIcon>
        <Typography
          sx={{
            fontWeight: isSelected ? "bold" : "normal",
            color: isSelected ? "#fff" : "#6d6777",
          }}
        >
          {item.name}
        </Typography>
      </ListItemButton>
    </ListItem>
  );
}
