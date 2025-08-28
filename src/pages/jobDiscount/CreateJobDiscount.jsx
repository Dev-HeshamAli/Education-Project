import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import { clearMessageCreateJobDiscount } from "../../store/createJobDiscount/createJobDiscount";
import { clearMessageUpdateJobDiscount } from "../../store/createJobDiscount/updateJobDiscount/updateJobDiscountSlice";
import { clearMessageDeleteJobDiscount } from "../../store/createJobDiscount/deleteJobDiscount/deleteJobDiscountSlice";
import { actCreateJobDiscount } from "../../store/createJobDiscount/actCreateJobDiscount";
import { actUpdateJobDiscount } from "../../store/createJobDiscount/updateJobDiscount/actUpdateJobDiscount";
import { actDeleteJobDiscount } from "../../store/createJobDiscount/deleteJobDiscount/actDeleteJobDiscount";
import { fetchJobDiscount } from "../../store/shared/jobDiscount/actGetJobDiscount";

// إعداد التحقق
const schema = yup.object().shape({
  job: yup.string().required("Job is required"),
  discount: yup
    .number()
    .typeError("Enter a valid number")
    .min(0, "Must be more than 0")
    .max(1, "Must be less than 1")
    .required("Discount is required"),
  mex_Students: yup
    .number()
    .typeError("Enter a valid number")
    .integer("Must be an integer")
    .required("Max Students is required"),
});

const CreateJobDiscount = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // القوائم
  const { list, loading: listLoading } = useSelector(
    (state) => state.jobDiscount
  );

  // حالات إنشاء
  const {
    success: createSuccess,
    error: createError,
    loading: createLoading,
  } = useSelector((state) => state.createJobDiscount);

  // حالات تعديل
  const {
    success: updateSuccess,
    error: updateError,
    loading: updateLoading,
  } = useSelector((state) => state.updateJobDiscount);

  // حالات حذف
  const {
    success: deleteSuccess,
    error: deleteError,
    loading: deleteLoading,
  } = useSelector((state) => state.deleteJobDiscount);

  const [editId, setEditId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      job: "",
      discount: "",
      mex_Students: "",
    },
  });

  // تحميل البيانات
  useEffect(() => {
    dispatch(fetchJobDiscount(token));
  }, [dispatch, token]);

  const [alert, setAlert] = useState({ type: "", message: "" });

  // عرض الرسائل
  useEffect(() => {
    if (createSuccess) {
      setAlert({ type: "success", message: createSuccess });
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);
      dispatch(clearMessageCreateJobDiscount());
    }
    if (updateSuccess) {
      setAlert({ type: "success", message: updateSuccess });
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);
      dispatch(clearMessageUpdateJobDiscount());
      dispatch(fetchJobDiscount(token));
    }
    if (deleteSuccess) {
      setAlert({ type: "success", message: deleteSuccess });
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);
      dispatch(clearMessageDeleteJobDiscount());
      dispatch(fetchJobDiscount(token));
    }
    if (createError) {
      setAlert({ type: "error", message: createError });
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);
      dispatch(clearMessageCreateJobDiscount());
    }
    if (updateError) {
      setAlert({ type: "error", message: updateError });
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);
      dispatch(clearMessageUpdateJobDiscount());
    }
    if (deleteError) {
      setAlert({ type: "error", message: deleteError });
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);
      dispatch(clearMessageDeleteJobDiscount());
    }
  }, [
    createSuccess,
    updateSuccess,
    deleteSuccess,
    createError,
    updateError,
    deleteError,
    dispatch,
    token,
  ]);

  // إغلاق الفورم بعد النجاح
  useEffect(() => {
    if (createSuccess || updateSuccess) {
      reset();
      setEditId(null);
      setOpenForm(false);
      dispatch(fetchJobDiscount(token));
    }
  }, [createSuccess, updateSuccess, dispatch, reset, token]);

  const onSubmit = (data) => {
    const formattedData = {
      discount: Number(data.discount),
      mex_Students: Number(data.mex_Students),
    };

    if (editId) {
      dispatch(
        actUpdateJobDiscount({
          data: { id: editId, ...formattedData },
          token,
        })
      );
    } else {
      dispatch(
        actCreateJobDiscount({
          data: { ...data, ...formattedData },
          token,
        })
      );
    }
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    reset(row);
    setOpenForm(true);
  };

  const handleDelete = () => {
    dispatch(actDeleteJobDiscount({ id: deleteId, token }));
    setOpenDeleteDialog(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      {alert.message && (
        <Alert
          severity={alert.type}
          sx={{
            mb: 2,
            transition: "all 0.5s ease",
          }}
        >
          {alert.message}
        </Alert>
      )}
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          Job Discounts
        </Typography>

        {/* الفورم في الأعلى */}
        {openForm && (
          <Box
            sx={{
              width: 400,
              mb: 4,
              p: 3,
              boxShadow: 4,
              borderRadius: 3,
              backgroundColor: "white",
              mx: "auto",
            }}
          >
            <Typography variant="h6" mb={2} textAlign="center">
              {editId ? "Edit Job Discount" : "Add Job Discount"}
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              {!editId && (
                <Controller
                  name="job"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Job"
                      fullWidth
                      margin="normal"
                      error={!!errors.job}
                      helperText={errors.job?.message}
                    />
                  )}
                />
              )}

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
                    inputProps={{ step: "0.01" }}
                    error={!!errors.discount}
                    helperText={errors.discount?.message}
                  />
                )}
              />

              <Controller
                name="mex_Students"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Max Students"
                    type="number"
                    fullWidth
                    margin="normal"
                    error={!!errors.mex_Students}
                    helperText={errors.mex_Students?.message}
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                {editId
                  ? updateLoading
                    ? "Updating..."
                    : "Update"
                  : createLoading
                  ? "Saving..."
                  : "Save"}
              </Button>
            </form>
          </Box>
        )}

      </Box>

      {listLoading ? (
        <CircularProgress sx={{ ml: 4 }} />
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: 3,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Job
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Discount
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Max Students
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Students Count
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(list || []).map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "white" : "#fafafa",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  <TableCell sx={{ textAlign: "center" }}>{row.job}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.discount}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.mex_Students}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.students_Count}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEdit(row)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => {
                        setDeleteId(row.id);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* زرار إضافة فوق الجدول */}
      <Button
        variant="contained"
        sx={{ mt: 4, ml: 2 }}
        onClick={() => {
          reset();
          setEditId(null);
          setOpenForm(true);
        }}
      >
        Add Job Discount
      </Button>

      {/* Dialog الحذف */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Are you sure you want to delete?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateJobDiscount;

// ---------------------------DataGrid---------------------------
// ---------------------------DataGrid---------------------------
// ---------------------------DataGrid---------------------------
// ---------------------------DataGrid---------------------------
// ---------------------------DataGrid---------------------------
// ---------------------------DataGrid---------------------------
// ---------------------------DataGrid---------------------------
// ---------------------------DataGrid---------------------------
// ---------------------------DataGrid---------------------------
// import { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Dialog,
//   DialogActions,
//   DialogTitle,
//   CircularProgress,
//   Alert,
//   TextField,
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useDispatch, useSelector } from "react-redux";

// import { clearMessageCreateJobDiscount } from "../../store/createJobDiscount/createJobDiscount";
// import { clearMessageUpdateJobDiscount } from "../../store/createJobDiscount/updateJobDiscount/updateJobDiscountSlice";
// import { clearMessageDeleteJobDiscount } from "../../store/createJobDiscount/deleteJobDiscount/deleteJobDiscountSlice";
// import { actCreateJobDiscount } from "../../store/createJobDiscount/actCreateJobDiscount";
// import { actUpdateJobDiscount } from "../../store/createJobDiscount/updateJobDiscount/actUpdateJobDiscount";
// import { actDeleteJobDiscount } from "../../store/createJobDiscount/deleteJobDiscount/actDeleteJobDiscount";
// import { fetchJobDiscount } from "../../store/shared/jobDiscount/actGetJobDiscount";

// const schema = yup.object().shape({
//   job: yup.string().required("Job is required"),
//   discount: yup
//     .number()
//     .typeError("Enter a valid number")
//     .min(0, "Must be more than 0")
//     .max(1, "Must be less than 1")
//     .required("Discount is required"),
//   mex_Students: yup
//     .number()
//     .typeError("Enter a valid number")
//     .integer("Must be an integer")
//     .required("Max Students is required"),
// });

// const CreateJobDiscount = () => {
//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.auth.token);

//   const { list, loading: listLoading } = useSelector(
//     (state) => state.jobDiscount
//   );

//   const {
//     success: createSuccess,
//     error: createError,
//     loading: createLoading,
//   } = useSelector((state) => state.createJobDiscount);

//   const {
//     success: updateSuccess,
//     error: updateError,
//     loading: updateLoading,
//   } = useSelector((state) => state.updateJobDiscount);

//   const {
//     success: deleteSuccess,
//     error: deleteError,
//     loading: deleteLoading,
//   } = useSelector((state) => state.deleteJobDiscount);

//   const [editId, setEditId] = useState(null);
//   const [openForm, setOpenForm] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [alert, setAlert] = useState({ type: "", message: "" });

//   const {
//     handleSubmit,
//     control,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       job: "",
//       discount: "",
//       mex_Students: "",
//     },
//   });

//   useEffect(() => {
//     dispatch(fetchJobDiscount(token));
//   }, [dispatch, token]);

//   useEffect(() => {
//     if (createSuccess || updateSuccess || deleteSuccess) {
//       setAlert({ type: "success", message: createSuccess || updateSuccess || deleteSuccess });
//       setTimeout(() => setAlert({ type: "", message: "" }), 3000);
//       dispatch(clearMessageCreateJobDiscount());
//       dispatch(clearMessageUpdateJobDiscount());
//       dispatch(clearMessageDeleteJobDiscount());
//       dispatch(fetchJobDiscount(token));
//     }
//     if (createError || updateError || deleteError) {
//       setAlert({ type: "error", message: createError || updateError || deleteError });
//       setTimeout(() => setAlert({ type: "", message: "" }), 3000);
//       dispatch(clearMessageCreateJobDiscount());
//       dispatch(clearMessageUpdateJobDiscount());
//       dispatch(clearMessageDeleteJobDiscount());
//     }
//   }, [
//     createSuccess, updateSuccess, deleteSuccess,
//     createError, updateError, deleteError,
//     dispatch, token
//   ]);

//   useEffect(() => {
//     if (createSuccess || updateSuccess) {
//       reset();
//       setEditId(null);
//       setOpenForm(false);
//     }
//   }, [createSuccess, updateSuccess, reset]);

//   const onSubmit = (data) => {
//     const formattedData = {
//       discount: Number(data.discount),
//       mex_Students: Number(data.mex_Students),
//     };
//     if (editId) {
//       dispatch(actUpdateJobDiscount({ data: { id: editId, ...formattedData }, token }));
//     } else {
//       dispatch(actCreateJobDiscount({ data: { ...data, ...formattedData }, token }));
//     }
//   };

//   const handleEdit = (row) => {
//     setEditId(row.id);
//     reset(row);
//     setOpenForm(true);
//   };

//   const handleDelete = () => {
//     dispatch(actDeleteJobDiscount({ id: deleteId, token }));
//     setOpenDeleteDialog(false);
//   };

//   const columns = [
//     { field: "job", headerName: "Job", flex: 1 },
//     { field: "discount", headerName: "Discount", flex: 1 },
//     { field: "mex_Students", headerName: "Max Students", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       sortable: false,
//       renderCell: (params) => (
//         <>
//           <Button
//             variant="outlined"
//             size="small"
//             sx={{ mr: 1 }}
//             onClick={() => handleEdit(params.row)}
//           >
//             Edit
//           </Button>
//           <Button
//             variant="outlined"
//             color="error"
//             size="small"
//             onClick={() => {
//               setDeleteId(params.row.id);
//               setOpenDeleteDialog(true);
//             }}
//           >
//             Delete
//           </Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <Box sx={{ p: 4 }}>
//       {alert.message && (
//         <Alert severity={alert.type} sx={{ mb: 2 }}>
//           {alert.message}
//         </Alert>
//       )}

//       <Typography variant="h5" mb={3} textAlign="center">
//         Job Discounts
//       </Typography>

//       {openForm && (
//         <Box
//           sx={{
//             width: 400,
//             mb: 4,
//             p: 3,
//             boxShadow: 4,
//             borderRadius: 3,
//             backgroundColor: "white",
//             mx: "auto",
//           }}
//         >
//           <Typography variant="h6" mb={2} textAlign="center">
//             {editId ? "Edit Job Discount" : "Add Job Discount"}
//           </Typography>

//           <form onSubmit={handleSubmit(onSubmit)}>
//             {!editId && (
//               <Controller
//                 name="job"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     label="Job"
//                     fullWidth
//                     margin="normal"
//                     error={!!errors.job}
//                     helperText={errors.job?.message}
//                   />
//                 )}
//               />
//             )}

//             <Controller
//               name="discount"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Discount (0 to 1)"
//                   type="number"
//                   fullWidth
//                   margin="normal"
//                   inputProps={{ step: "0.01" }}
//                   error={!!errors.discount}
//                   helperText={errors.discount?.message}
//                 />
//               )}
//             />

//             <Controller
//               name="mex_Students"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Max Students"
//                   type="number"
//                   fullWidth
//                   margin="normal"
//                   error={!!errors.mex_Students}
//                   helperText={errors.mex_Students?.message}
//                 />
//               )}
//             />

//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               sx={{ mt: 2 }}
//             >
//               {editId
//                 ? updateLoading
//                   ? "Updating..."
//                   : "Update"
//                 : createLoading
//                 ? "Saving..."
//                 : "Save"}
//             </Button>
//           </form>
//         </Box>
//       )}

//       <Button
//         variant="contained"
//         sx={{ mb: 2 }}
//         onClick={() => {
//           reset();
//           setEditId(null);
//           setOpenForm(true);
//         }}
//       >
//         Add Job Discount
//       </Button>

//       {listLoading ? (
//         <CircularProgress />
//       ) : (
//         <Box sx={{ height: 400, width: "100%" }}>
//           <DataGrid
//             rows={list || []}
//             columns={columns}
//             pageSize={5}
//             rowsPerPageOptions={[5, 10, 20]}
//             disableSelectionOnClick
//             getRowId={(row) => row.id}
//           />
//         </Box>
//       )}

//       <Dialog
//         open={openDeleteDialog}
//         onClose={() => setOpenDeleteDialog(false)}
//       >
//         <DialogTitle>Are you sure you want to delete?</DialogTitle>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
//           <Button onClick={handleDelete} color="error">
//             {deleteLoading ? "Deleting..." : "Delete"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default CreateJobDiscount;
