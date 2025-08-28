import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Dialog,
} from "@mui/material";
import { fetchPlans } from "../../store/shared/plan/actGetPlan";
import { actGetPlanDetails } from "../../store/shared/data/planDetails/actGetPlanDetails";
import CreatePL from "./CreatePL";
import UpdatePL from "./UpdatePL";
import { Add } from "@mui/icons-material";
import DeletePL from "./DeletePL";

const PlanDetails = () => {
  const dispatch = useDispatch();
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPlanName, setSelectedPlanName] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { success: createSuccess } = useSelector((state) => state.planLevel);
  const { success: updateSuccess } = useSelector(
    (state) => state.updatePlanLevel
  );
  const { success: deleteSuccess } = useSelector(
    (state) => state.deletePlanLevel
  );

  useEffect(() => {
    dispatch(fetchPlans(token));
  }, [dispatch, token, createSuccess]);

  useEffect(() => {
    if (createSuccess || updateSuccess || deleteSuccess) {
      dispatch(fetchPlans(token));

      if (selectedPlan) {
        dispatch(actGetPlanDetails({ token, planId: selectedPlan }));
      }
    }
  }, [
    createSuccess,
    updateSuccess,
    dispatch,
    token,
    selectedPlan,
    deleteSuccess,
  ]);

  const plans = useSelector((state) => state.plansId.list);
  const planDetails = useSelector((state) => state.planDetails.list);
  const loadingPlans = useSelector((state) => state.plansId.loading);
  const loadingDetails = useSelector((state) => state.planDetails.loading);
  console.log(planDetails);

  const handleSelectPlan = (id, name) => {
    setSelectedPlan(id);
    setSelectedPlanName(name);
    dispatch(actGetPlanDetails({ token, planId: id }));
  };

  const isOnlineSchool =
    String(selectedPlanName).toUpperCase() === "ONLINE SCHOOL";

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Plans Details
      </Typography>

      {/* ✅ Create Plan Level Button */}
      <Button
        sx={{ mb: 2, float: "right", mr: 2 }}
        variant="outlined"
        color="primary"
        onClick={() => setOpen(true)}
        startIcon={<Add />}
      >
        Create Plan Level
      </Button>

      {/* ✅ Dialogs */}
      {open && (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <CreatePL setOpen={setOpen} selectedPlan={selectedPlan} />
        </Dialog>
      )}
      {openUpdate && (
        <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
          <UpdatePL editData={editData} setOpenUpdate={setOpenUpdate} />
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <DeletePL deleteData={deleteData} setOpenDelete={setOpenDelete} />
        </Dialog>
      )}

      {/* ✅ Plans Buttons */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        {loadingPlans ? (
          <CircularProgress />
        ) : (
          plans.map((plan) => (
            <Button
              key={plan.id}
              variant={selectedPlan === plan.id ? "contained" : "outlined"}
              onClick={() => handleSelectPlan(plan.id, plan.name)}
            >
              {plan.name}
            </Button>
          ))
        )}
      </Box>

      {/* ✅ Plan Details Table */}
      {loadingDetails && <CircularProgress />}
      {planDetails && selectedPlan && planDetails.length > 0 && (
        <Paper elevation={3}>
          <Box p={2}>
            <Typography variant="h6" fontWeight="bold">
              {planDetails[0].planName}
            </Typography>
            <Typography color="text.secondary" mb={2}>
              {planDetails[0].description}
            </Typography>

            <Table sx={{ border: "1px solid #ddd" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell align="center">Study Level</TableCell>
                  <TableCell align="center">Stage</TableCell>
                  {isOnlineSchool && (
                    <TableCell align="center">Old Price</TableCell>
                  )}
                  {isOnlineSchool && (
                    <TableCell align="center">Discount</TableCell>
                  )}
                  {isOnlineSchool && (
                    <TableCell align="center">Final Price</TableCell>
                  )}
                  {isOnlineSchool && <TableCell align="center">Edit</TableCell>}
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {planDetails[0].studyLevels.map((lvl, index) => (
                  <TableRow key={index} hover>
                    <TableCell align="center">{lvl.studyLevelName}</TableCell>
                    <TableCell align="center">{lvl.stageName}</TableCell>
                    {isOnlineSchool && (
                      <TableCell align="center">{lvl.oldPrice}</TableCell>
                    )}
                    {isOnlineSchool && (
                      <TableCell align="center">
                        {lvl.descount * 100}%
                      </TableCell>
                    )}
                    {isOnlineSchool && (
                      <TableCell align="center">
                        {lvl.finalPrice ??
                          lvl.oldPrice - lvl.oldPrice * lvl.descount}
                      </TableCell>
                    )}
                    {isOnlineSchool && (
                      <TableCell align="center">
                        <Button
                          onClick={() => {
                            setEditData({
                              planId: selectedPlan,
                              studyLevelName: lvl.studyLevelName,
                              price: lvl.oldPrice,
                              discount: lvl.descount,
                            });

                            setOpenUpdate(true);
                          }}
                          variant="outlined"
                          color="primary"
                          size="small"
                        >
                          Edit
                        </Button>
                      </TableCell>
                    )}
                    <TableCell align="center">
                      <Button
                        onClick={() => {
                          setDeleteData({
                            planId: selectedPlan,
                            studyLevelName: lvl.studyLevelName,
                          });

                          setOpenDelete(true);
                        }}
                        variant="outlined"
                        color="error"
                        size="small"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default PlanDetails;
