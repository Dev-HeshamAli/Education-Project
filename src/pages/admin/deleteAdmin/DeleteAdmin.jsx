import { useDispatch, useSelector } from "react-redux";
import { actDeleteAdmin } from "../../../store/admin/deleteAdmin/actDeleteAdmin";
import { resetDeleteState } from "../../../store/admin/deleteAdmin/deleteAdminSlice";
import { logout } from "../../../store/auth/authSlice";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Trash2, AlertTriangle } from "lucide-react";
import Profile from "../profile/Profile";

const DeleteAdmin = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { loading, success, error } = useSelector((state) => state.deleteAdmin);
  const admin = JSON.parse(localStorage.getItem("userInfo"));
  const id = admin?.id;

  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const handleConfirmDelete = async () => {
    try {
      await dispatch(actDeleteAdmin({ id, token })).unwrap();
      dispatch(logout());
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(resetDeleteState());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  return (
    <Box className="text-center mt-6">
      <button
        onClick={handleOpenDialog}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition"
      >
        <Trash2 size={18} />
        Delete Admin
      </button>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle size={24} className="text-red-600" />
          Confirm Deletion
        </DialogTitle>

        <DialogContent>
          <Typography className="text-gray-700">
            Are you sure you want to delete this admin? This action cannot be
            undone.
          </Typography>
        </DialogContent>

        <DialogActions className="px-4 pb-4">
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success or Error messages */}
      {success && <p className="text-green-600 text-sm mt-3">{success}</p>}
      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
    </Box>
  );
};

export default DeleteAdmin;
