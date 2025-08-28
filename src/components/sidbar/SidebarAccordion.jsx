import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link, useLocation } from "react-router-dom";

export default function SidebarAccordion({ item }) {
  const location = useLocation();

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        border: "none",
        boxShadow: "none",
        "&::before": {
          display: "none",
        },
        pb: 0.5,
        borderBottom: item.border ? "3px solid #1976d2" : "none",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          borderRadius: "0px 20px 20px 0px",
          "&:hover": { backgroundColor: "#839ec5", color: "#fff !important" },
          // borderTop: "1px solid #1976d2",
          // borderBottom: "1px solid #1976d2",
        }}
      >
        <ListItemIcon sx={{ color: "#839ec5" }}>{item.icon}</ListItemIcon>
        <Typography
          sx={{
            color: "#000",
            fontSize: "20px",
            fontWeight: "bold",
            "&:hover": { color: "#fff !important" },
          }}
        >
          {item.name}
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ pl: 4 }}>
        {item.children.map((child) => {
          const isChildSelected = location.pathname === child.link;
          return (
            <ListItemButton
              key={child.name}
              component={Link}
              to={child.link}
              sx={{
                // width: "100%",
                borderRadius: 4,
                transition: "all 0.2s ease-in-out",
                background: isChildSelected
                  ? "linear-gradient(270deg, #1976d2 0%, #2a4155 100%)"
                  : "transparent",
                "&:hover": { backgroundColor: "#839ec5" },
              }}
            >
              {/* <ListItemIcon
                sx={{ color: isChildSelected ? "#fff" : "#6d6777" }}
              >
                {child.icon}
              </ListItemIcon> */}
              <Typography
                sx={{
                  fontWeight: isChildSelected ? "bold" : "normal",
                  color: isChildSelected ? "#fff" : "#6d6777",
                  "&:hover": { color: "#fff !important" },
                }}
              >
                {child.name}
              </Typography>
            </ListItemButton>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
}
