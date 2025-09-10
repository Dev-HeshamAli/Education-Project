import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminInfo from "./AdminInfo";
import { actGetAllAdmins } from "../../../store/shared/allAdmins/actGetAllAdmins";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Dialog,
  Alert,
} from "@mui/material";
import { Navigate } from "react-router-dom";
import { actDeleteAdmin } from "../../../store/shared/allAdmins/deleteAdmin/actDeleteAdmin";
import { resetDeleteAdminState } from "../../../store/shared/allAdmins/deleteAdmin/deleteAdminSlice";

const AllAdmins = () => {
  const { token, id: adminId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const admins = useSelector((state) => state.allAdmins.list);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const { success, error, loading } = useSelector((state) => state.removeAdmin);

  useEffect(() => {
    if (adminId === 111 || success) {
      dispatch(actGetAllAdmins({ token, id: adminId }));
    }
  }, [dispatch, token, adminId, success]);

  // ✅ الحماية: لو مش الأدمن الأساسي، اعمل Redirect
  if (adminId !== 111) {
    return <Navigate to="/dashboard" replace />;
  }

  // دالة الحذف
  const handleDelete = (targetId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      dispatch(actDeleteAdmin({ id: targetId, token, superAdminId: adminId }));
    }
  };

  const handleInfo = (id) => {
    setOpen(true);
    setUserId(id);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(resetDeleteAdminState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, success, error]);

  return (
    <Box p={3}>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <AdminInfo setOpen={setOpen} id={userId} />
      </Dialog>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        All Admins
      </Typography>

      {loading && (
        <Alert severity="info" sx={{ my: 2 }}>
          Deleting admin...
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ my: 2 }}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell
                align="center"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Name
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Email
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {admins
              .filter((admin) => admin.id !== 111)
              .map((admin) => (
                <TableRow key={admin.id} hover>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#1976d2",
                      cursor: "pointer",
                      ":hover": {
                        color: "blue",
                        transition: "all 0.3s ease-in-out",
                      },
                      textDecoration: "underline",
                    }}
                    align="center"
                    onClick={() => handleInfo(admin.id)}
                  >
                    {admin.name}
                  </TableCell>
                  <TableCell align="center">{admin.email}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(admin.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllAdmins;
