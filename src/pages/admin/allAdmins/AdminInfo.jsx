import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actGetAdmin } from "../../../store/admin/adminInfo/actGetAdmin";
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
  const dataAdmin = useSelector((state) => state.dataAdmin.list);

  useEffect(() => {
    dispatch(actGetAdmin({ id: userId, token }));
  }, [dispatch, token, userId]);

  if (!dataAdmin) {
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
              <TableCell align="center">{dataAdmin.firstName}</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Second Name
              </TableCell>
              <TableCell align="center">{dataAdmin.secondName}</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Third Name
              </TableCell>
              <TableCell align="center">{dataAdmin.thirdName}</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Job
              </TableCell>
              <TableCell align="center">{dataAdmin.job}</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell align="center">{dataAdmin.email}</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                password
              </TableCell>
              <TableCell align="center">{dataAdmin.password}</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Phone
              </TableCell>
              <TableCell align="center">{dataAdmin.phone}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminInfo;
