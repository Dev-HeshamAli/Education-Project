import { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  TextField,
  Autocomplete,
  Alert,
} from "@mui/material";
import { Edit, Delete, Add, Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { fetchTeachersByName } from "../../store/shared/teacherByName/actGetTeacherByName";
import { actCreateDiscountCode } from "../../store/createDiscountCode/actcreateDiscountCode";
import { fetchDiscountCode } from "../../store/shared/discountCode/actGetDiscountCode";
import { actUpdateDiscountCode } from "../../store/createDiscountCode/updateDiscountCode/actUpdateDiscountCode";
import { actDeleteDiscountCode } from "../../store/createDiscountCode/deleteDiscountCode/actDeleteDiscountCode";
import { clearMessageCreateCode } from "../../store/createDiscountCode/createDiscountCode";
import { clearMessageDeleteDiscountCode } from "../../store/createDiscountCode/deleteDiscountCode/deleteDiscountCodeSlice";
import { clearMessageUpdateDiscountCode } from "../../store/createDiscountCode/updateDiscountCode/updateDiscountCodeSlice";

// validation schema
const schema = yup.object().shape({
  code: yup.string().required("Code is required"),
  discount: yup.number().min(0).max(1).required("Discount is required"),
  expirationDate: yup.date().required("Expiration date is required"),
  profit_Percentage: yup
    .number()
    .min(0)
    .max(1)
    .required("Profit percentage is required"),
  max_Uses: yup.number().integer().required("Max uses is required"),
  teacherId: yup.number().when("$isEdit", {
    is: false, // لو مش تعديل
    then: (schema) => schema.required("Teacher is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const DiscountCodePage = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const teacherNames = useSelector((state) => state.teacherByName.list || []);

  // Redux states
  const {
    success: createSuccess,
    error: createError,
    loading: createLoading,
  } = useSelector((state) => state.createDiscountCode);

  const {
    success: updateSuccess,
    error: updateError,
    loading: updateLoading,
  } = useSelector((state) => state.updateDiscountCode);

  const {
    success: deleteSuccess,
    error: deleteError,
    loading: deleteLoading,
  } = useSelector((state) => state.deleteDiscountCode);

  const { list: rows, loading: fetchLoading } = useSelector(
    (state) => state.discountCode
  );

  // States
  const [searchValue, setSearchValue] = useState("");
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    context: { isEdit: !!editId }, // هنا بندي الفلاج عشان الشرط يشتغل
    defaultValues: {
      code: "",
      discount: "",
      expirationDate: "",
      profit_Percentage: "",
      max_Uses: "",
      teacherId: "",
    },
  });

  // Delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleDelete = () => {
    dispatch(actDeleteDiscountCode({ id: deleteId, token }));
    setOpenDeleteDialog(false);
  };

  // Submit handler
  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      expirationDate: new Date(data.expirationDate).toISOString(),
      discount: Number(data.discount),
      profit_Percentage: Number(data.profit_Percentage),
      max_Uses: Number(data.max_Uses),
    };

    if (editId) {
      dispatch(
        actUpdateDiscountCode({
          data: { id: editId, ...formattedData },
          token,
        })
      );
    } else {
      dispatch(
        actCreateDiscountCode({
          data: formattedData,
          token,
        })
      );
    }
  };

  // Fetch teachers on search
  useEffect(() => {
    if (searchValue.trim()) {
      dispatch(fetchTeachersByName({ token, name: searchValue }));
    }
  }, [dispatch, token, searchValue]);

  // Fetch discount codes
  useEffect(() => {
    dispatch(fetchDiscountCode(token));
  }, [dispatch, token]);

  // Refetch after success
  useEffect(() => {
    if (createSuccess || updateSuccess || deleteSuccess) {
      dispatch(fetchDiscountCode(token));
      reset();
      setEditId(null);
      setSearchValue("");
      setShowForm(false);
    }
  }, [createSuccess, updateSuccess, deleteSuccess, dispatch, token, reset]);

  // Clear messages after delay
  useEffect(() => {
    if (createSuccess || createError) {
      const timer = setTimeout(() => {
        dispatch(clearMessageCreateCode());
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (updateSuccess || updateError) {
      const timer = setTimeout(() => {
        dispatch(clearMessageUpdateDiscountCode());
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (deleteSuccess || deleteError) {
      const timer = setTimeout(() => {
        dispatch(clearMessageDeleteDiscountCode());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [
    createSuccess,
    createError,
    updateSuccess,
    updateError,
    deleteSuccess,
    deleteError,
    dispatch,
  ]);

  // Edit handler
  const handleEdit = (row) => {
    setEditId(row.id);
    setValue("code", row.code);
    setValue("discount", row.discount);
    setValue("expirationDate", row.expirationDate);
    setValue("profit_Percentage", row.profit_Percentage);
    setValue("max_Uses", row.max_Uses);
    setValue("teacherId", row.teacherId);
    setSelectedTeacher({ id: row.teacherId, name: row.teacherName }); // حفظ المدرس
    setSearchValue(row.teacherName || "");
    setShowForm(true);
  };

  // Add new handler
  const handleAddNew = () => {
    reset();
    setEditId(null);
    setSelectedTeacher(null); // reset المدرس
    setSearchValue("");
    setShowForm(true);
  };

  return (
    <Box p={3}>
      <Typography variant="h6" mb={2}>
        Discount Codes
      </Typography>

      {/* Alerts */}
      {createLoading && (
        <Alert sx={{ m: 2 }} severity="info">
          Creating...
        </Alert>
      )}
      {createSuccess && (
        <Alert sx={{ m: 2 }} severity="success">
          {createSuccess}
        </Alert>
      )}
      {createError && (
        <Alert sx={{ m: 2 }} severity="error">
          {createError}
        </Alert>
      )}

      {updateLoading && (
        <Alert sx={{ m: 2 }} severity="info">
          Updating...
        </Alert>
      )}
      {updateSuccess && (
        <Alert sx={{ m: 2 }} severity="success">
          {updateSuccess}
        </Alert>
      )}
      {updateError && (
        <Alert sx={{ m: 2 }} severity="error">
          {updateError}
        </Alert>
      )}

      {deleteLoading && (
        <Alert sx={{ m: 2 }} severity="info">
          Deleting...
        </Alert>
      )}
      {deleteSuccess && (
        <Alert sx={{ m: 2 }} severity="success">
          {deleteSuccess}
        </Alert>
      )}
      {deleteError && (
        <Alert sx={{ m: 2 }} severity="error">
          {deleteError}
        </Alert>
      )}

      {/* Add button */}
      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        onClick={handleAddNew}
      >
        Add New Code
      </Button>

      {/* Close button */}
      {showForm && (
        <Button
          variant="contained"
          startIcon={<Close />}
          sx={{ mb: 2, ml: 2, float: "right", backgroundColor: "red" }}
          onClick={() => setShowForm(false)}
        >
          Close
        </Button>
      )}

      {/* Form */}
      {showForm && (
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            p: 2,
            mb: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
            backgroundColor: "#fafafa",
          }}
        >
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Code"
                fullWidth
                margin="normal"
                error={!!errors.code}
                helperText={errors.code?.message}
              />
            )}
          />
          <Controller
            name="discount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Discount (0 to 1)"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.discount}
                helperText={errors.discount?.message}
              />
            )}
          />
          <Controller
            name="expirationDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Expiration Date"
                type="datetime-local"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!errors.expirationDate}
                helperText={errors.expirationDate?.message}
              />
            )}
          />
          <Controller
            name="profit_Percentage"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Profit Percentage (0 to 1)"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.profit_Percentage}
                helperText={errors.profit_Percentage?.message}
              />
            )}
          />
          <Controller
            name="max_Uses"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Max Uses"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.max_Uses}
                helperText={errors.max_Uses?.message}
              />
            )}
          />
          <Autocomplete
            options={teacherNames}
            value={selectedTeacher} // بدل find
            getOptionLabel={(option) => option.name || ""}
            onInputChange={(e, newValue) => setSearchValue(newValue)}
            onChange={(e, selectedOption) => {
              setSelectedTeacher(selectedOption);
              setValue("teacherId", selectedOption ? selectedOption.id : "");
            }}
            disabled={!!editId} // لو تعديل يقفل الحقل
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Teacher"
                margin="normal"
                fullWidth
                error={!!errors.teacherId}
                helperText={errors.teacherId?.message}
              />
            )}
          />
          <Box display="flex" gap={2} mt={2}>
            <Button type="submit" variant="contained">
              {editId ? "Update" : "Create"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setShowForm(false);
                reset();
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Expiration</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Profit %</TableCell>
              <TableCell>Max Uses</TableCell>
              <TableCell>Current Uses</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.discount}</TableCell>
                  <TableCell>
                    {new Date(row.expirationDate).toLocaleString()}
                  </TableCell>
                  <TableCell>{row.isActive ? "Yes" : "No"}</TableCell>
                  <TableCell>{row.profit_Percentage}</TableCell>
                  <TableCell>{row.max_Uses}</TableCell>
                  <TableCell>{row.current_Uses}</TableCell>
                  <TableCell>{row.teacherName}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEdit(row)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDelete(row.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No discount codes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>
          Are you sure you want to delete this discount code?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DiscountCodePage;
