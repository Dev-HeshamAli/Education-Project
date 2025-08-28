import { Drawer, IconButton, Divider, List, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { styled, useTheme } from "@mui/material/styles";
import { listSidebar } from "./sidebarData.jsx";
import SidebarItem from "./SidebarItem";
import SidebarAccordion from "./SidebarAccordion";
import Logo from "./logo";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Sidebar({ open, handleDrawerClose, drawerWidth }) {
  const theme = useTheme();

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "9px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <Logo />
        <Typography
          variant="h6"
          sx={{
            fontWeight: "800",
            // background: "linear-gradient(45deg, #1976d2, #ff4081)", // الأزرق + بينك
            background: "#1976d2",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textFillColor: "transparent",
            letterSpacing: 1,
            textTransform: "uppercase",
            mr: 1,
          }}
        >
          edu-smart.ai
        </Typography>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon
              sx={{
                color: "#1976d2",
                bgcolor: "rgba(25, 118, 210, 0.1)",
                borderRadius: "50%",
              }}
            />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      {/* <Divider /> */}
      <Divider />
      <List>
        {listSidebar.map((item) =>
          item.children ? (
            <SidebarAccordion key={item.name} item={item} />
          ) : (
            <SidebarItem key={item.name} item={item} />
          )
        )}
      </List>
    </Drawer>
  );
}
