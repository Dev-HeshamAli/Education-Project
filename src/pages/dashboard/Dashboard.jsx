import { Box, Button } from "@mui/material";
// import { logout } from "../../store/auth/authSlice";
// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";

const Dashboard = () => {
  // const admin = JSON.parse(localStorage.getItem("userInfo"));
  // // const id = admin?.id;
  // console.log(admin);

  // const role = useSelector((state) => state.auth.role);
  // console.log(role);

  // const userData = useSelector((state) => state.auth.userData);
  // console.log(userData);
  // const dispatch = useDispatch();

  return (
    <Box>
      <h1>Dashboard</h1>
      {/* <Button
        onClick={() => {
          dispatch(logout());
        }}
        variant="contained"
        color="primary"
      >
        logout
      </Button> */}
    </Box>
  );
};

export default Dashboard;
