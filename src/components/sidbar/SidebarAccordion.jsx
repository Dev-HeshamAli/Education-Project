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
        pb: 1,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          borderRadius: "0px 20px 20px 0px",
          "&:hover": { backgroundColor: "#ded1f8" },
          borderTop: "1px solid #8c57ff",
          borderBottom: "1px solid #8c57ff",
        }}
      >
        <ListItemIcon sx={{ color: "#8c57ff" }}>{item.icon}</ListItemIcon>
        <Typography sx={{ color: "#6d6777", fontSize: "20px" , fontWeight: "bold"}}>
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
                borderRadius: 2,
                mb: 0.5,
                transition: "all 0.2s ease-in-out",
                background: isChildSelected
                  ? "linear-gradient(270deg, #8c57ff 0%, #c2aaff 100%)"
                  : "transparent",
                "&:hover": { backgroundColor: "#ded1f8" },
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
