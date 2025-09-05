import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminById } from "../../../store/admin/getAdminInfo/fetchAdminById";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

const AdminInfo = ({ id: userId }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const userData = useSelector((state) => state.adminInfo.userData);

  useEffect(() => {
    dispatch(fetchAdminById({ id: userId, token }));
  }, [dispatch, token, userId]);

  if (!userData) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        Loading...
      </Typography>
    );
  }

  return (
    <Box p={3}>
      <Typography
        variant="h5"
        gutterBottom
        fontWeight="bold"
        color="primary"
        mb={2}
        textAlign="center"
      >
        Admin Information
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: 3, mx: "auto" }}
      >
        <Table>
          <TableBody>
            <TableRow hover>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                First Name
              </TableCell>
              <TableCell align="center">{userData.firstName}</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Second Name
              </TableCell>
              <TableCell align="center">{userData.secondName}</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Third Name
              </TableCell>
              <TableCell align="center">{userData.thirdName}</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Job
              </TableCell>
              <TableCell align="center">{userData.job}</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell align="center">{userData.email}</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                password
              </TableCell>
              <TableCell align="center">{userData.password}</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Phone
              </TableCell>
              <TableCell align="center">{userData.phone}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminInfo;
