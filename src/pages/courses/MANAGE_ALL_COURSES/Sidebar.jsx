// import { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { useDispatch } from "react-redux";
// import {
//   setSemesterId,
//   setStudyLevelId,
// } from "../../../store/LOCAL_DATA/selectinIdsSlice";

// export default function Sidebar({ levels }) {
//   const dispatch = useDispatch();
//   const [activeAccordion, setActiveAccordion] = useState(null);
//   const [activeItem, setActiveItem] = useState(null);

//   const handleLevelClick = (levelId) => {
//     dispatch(setStudyLevelId(levelId));
//   };

//   const handleTermClick = (levelId, termId) => {
//     dispatch(setSemesterId(termId));
//     setActiveItem(`${levelId}-${termId}`);
//   };
//   return (
//     <Box>
//       {levels.map((level, index) => (
//         <Accordion
//           key={level.id}
//           expanded={activeAccordion === index}
//           onChange={() => {
//             setActiveAccordion(activeAccordion === index ? null : index);
//             handleLevelClick(level.id);
//           }}
//           sx={{
//             bgcolor: activeAccordion === index ? "#839ec5" : "white",
//             color: activeAccordion === index ? "white" : "black",
//             mb: 2,
//             borderRadius: "25px !important",
//             "&:hover": {
//               bgcolor: "#839ec5",
//               color: "white",
//             },
//           }}
//         >
//           <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//             <Typography sx={{ fontWeight: "bold" }}>{level.name}</Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <List disablePadding>
//               {level.semesters?.map((sem) => (
//                 <ListItemButton
//                   key={sem.id}
//                   selected={activeItem === `${level.id}-${sem.id}`}
//                   onClick={() => handleTermClick(level.id, sem.id)}
//                   sx={{
//                     bgcolor:
//                       activeItem === `${level.id}-${sem.id}`
//                         ? "#2a4155 !important"
//                         : "transparent",
//                     color:
//                       activeItem === `${level.id}-${sem.id}` ? "#fff" : "white",
//                     borderRadius: 5,
//                     "&.Mui-selected:hover": {
//                       bgcolor: "#64b5f6",
//                     },
//                   }}
//                 >
//                   {sem.name}
//                 </ListItemButton>
//               ))}
//             </List>
//           </AccordionDetails>
//         </Accordion>
//       ))}
//     </Box>
//   );
// }

import { useDispatch, useSelector } from "react-redux";
import {
  setSemesterId,
  setStudyLevelId,
  setActiveAccordion,
  setActiveItem,
} from "../../../store/LOCAL_DATA/selectinIdsSlice";

export default function Sidebar({ levels }) {
  const dispatch = useDispatch();

  const { activeAccordion, activeItem } = useSelector(
    (state) => state.selectionIds
  );

  const handleLevelClick = (levelId, index) => {
    dispatch(setStudyLevelId(levelId));
    dispatch(setActiveAccordion(index)); // نخزن الـ index المفتوح
  };

  const handleTermClick = (levelId, termId) => {
    dispatch(setSemesterId(termId));
    dispatch(setActiveItem(`${levelId}-${termId}`)); // نخزن العنصر النشط
  };

  return (
    <Box>
      {levels.map((level, index) => (
        <Accordion
          key={level.id}
          expanded={activeAccordion === index}
          onChange={() =>
            handleLevelClick(level.id, activeAccordion === index ? null : index)
          }
          sx={{
            bgcolor: activeAccordion === index ? "#839ec5" : "white",
            color: activeAccordion === index ? "white" : "black",
            mb: 2,
            borderRadius: "25px !important",
            "&:hover": {
              bgcolor: "#839ec5",
              color: "white",
            },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: "bold" }}>{level.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List disablePadding>
              {level.semesters?.map((sem) => (
                <ListItemButton
                  key={sem.id}
                  selected={activeItem === `${level.id}-${sem.id}`}
                  onClick={() => handleTermClick(level.id, sem.id)}
                  sx={{
                    bgcolor:
                      activeItem === `${level.id}-${sem.id}`
                        ? "#2a4155 !important"
                        : "transparent",
                    color:
                      activeItem === `${level.id}-${sem.id}` ? "#fff" : "white",
                    borderRadius: 5,
                    "&.Mui-selected:hover": {
                      bgcolor: "#64b5f6",
                    },
                  }}
                >
                  {sem.name}
                </ListItemButton>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
