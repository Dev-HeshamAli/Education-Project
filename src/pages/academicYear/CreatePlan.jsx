import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { actCreatePlan } from "../../store/academicYear/plan/actPlan";
import { resetCreatePlanState } from "../../store/academicYear/plan/planSlice";
import { fetchPlans } from "../../store/shared/plan/actGetPlan";
import { resetDeletePlanState } from "../../store/academicYear/plan/deleteplan/deletePlanSlice";
import { actDeletePlan } from "../../store/academicYear/plan/deleteplan/actDeletePlan";
import { resetUpdatePlanState } from "../../store/academicYear/plan/updatePlan/updatePlanSlice";
import { actUpdatePlan } from "../../store/academicYear/plan/updatePlan/actUpdatePlan";

const CreatePlan = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.plan);
  const { error: deleteError, success: deleteSuccess } = useSelector(
    (state) => state.deletePlan
  );
  const { error: updateError, success: updateSuccess } = useSelector(
    (state) => state.updatePlan
  );
  const plans = useSelector((state) => state.plansId.list);

  const { handleSubmit, control, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [showForm, setShowForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  // حالة التعديل
  const [editingPlan, setEditingPlan] = useState(null);

  const onSubmit = (data) => {
    if (editingPlan) {
      // console.log("Update plan with id:", editingPlan.id, "Data:", data);
      dispatch(actUpdatePlan({ data: { ...data, id: editingPlan.id }, token }));
      setEditingPlan(null);
    } else {
      dispatch(actCreatePlan({ data, token }));
    }
  };

  const handleDelete = (id) => {
    // console.log("Delete plan with id:", id);
    if (window.confirm("Are you sure you want to delete this plan?"))
      dispatch(actDeletePlan({ id, token }));
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setValue("name", plan.name);
    setValue("description", plan.description);
    setShowForm(true);
  };

  const handleOpenDialog = (desc) => {
    setSelectedDescription(desc);
    setOpenDialog(true);
  };

  useEffect(() => {
    dispatch(fetchPlans(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (
      success ||
      error ||
      deleteSuccess ||
      updateSuccess ||
      deleteError ||
      updateError
    ) {
      setTimeout(() => {
        dispatch(resetCreatePlanState());
        dispatch(resetUpdatePlanState());
        dispatch(resetDeletePlanState());
        dispatch(fetchPlans(token));
      }, 2000);

      if (success || deleteSuccess || updateSuccess) {
        reset();
        setShowForm(false);
      }
    }
  }, [
    success,
    error,
    dispatch,
    reset,
    token,
    deleteSuccess,
    updateSuccess,
    deleteError,
    updateError,
  ]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="100vh"
      bgcolor="#f9f9f9"
      py={6}
    >
      <Box
        width="100%"
        maxWidth="900px"
        display="flex"
        flexDirection="column"
        gap={4}
      >
        {success && (
          <Alert severity="success" sx={{ mt: 3 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
        {deleteSuccess && (
          <Alert severity="success" sx={{ mt: 3 }}>
            {deleteSuccess}
          </Alert>
        )}
        {deleteError && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {deleteError}
          </Alert>
        )}
        {updateSuccess && (
          <Alert severity="success" sx={{ mt: 3 }}>
            {updateSuccess}
          </Alert>
        )}
        {updateError && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {updateError}
          </Alert>
        )}
        {!showForm && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              reset();
              setEditingPlan(null);
              setShowForm(true);
            }}
            sx={{ alignSelf: "flex-start" }}
          >
            Create New Plan
          </Button>
        )}
        {/* FORM */}
        {showForm && (
          <Card>
            <CardContent sx={{ position: "relative" }}>
              <Typography variant="h5" mb={3} align="center">
                {editingPlan ? "Edit Plan" : "Create New Plan"}
              </Typography>

              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setShowForm(false);
                  setEditingPlan(null);
                  reset();
                }}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 1,
                }}
              >
                Close
              </Button>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Plan name is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Plan Name"
                      variant="outlined"
                      margin="normal"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "Description is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Description"
                      variant="outlined"
                      margin="normal"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3 }}
                  disabled={loading}
                  startIcon={
                    loading && <CircularProgress size={20} color="inherit" />
                  }
                >
                  {loading
                    ? editingPlan
                      ? "Updating..."
                      : "Adding..."
                    : editingPlan
                    ? "Update Plan"
                    : "Add Plan"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        {/* TABLE */}
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Plans List
            </Typography>
            <Table sx={{ border: "1px solid #eee" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f1f1f1" }}>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Description</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans && plans.length > 0 ? (
                  plans.map((plan) => (
                    <TableRow
                      key={plan.id}
                      hover
                      sx={{ "&:hover": { backgroundColor: "#fafafa" } }}
                    >
                      <TableCell>{plan.name}</TableCell>
                      <TableCell
                        sx={{ cursor: "pointer", color: "primary.main" }}
                        onClick={() => handleOpenDialog(plan.description)}
                      >
                        {plan.description.length > 20
                          ? plan.description.slice(0, 20) + "..."
                          : plan.description}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(plan)}
                        >
                          <Button variant="outlined" color="primary">
                            Edit
                          </Button>
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(plan.id)}
                        >
                          <Button variant="outlined" color="error">
                            Delete
                          </Button>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No Plans Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Dialog للوصف */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Plan Description</DialogTitle>
          <DialogContent>
            <Typography>{selectedDescription}</Typography>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CreatePlan;
