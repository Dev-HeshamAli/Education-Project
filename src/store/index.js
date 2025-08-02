import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import adminReducer from "./admin/createAdmin/createAdminSlice";
import adminInfoReducer from "./admin/getAdminInfo/getAdminInfoSlice";
import updateAdminReducer from "./admin/updateAdmin/updateAdminSlice";
import deleteAdminReducer from "./admin/deleteAdmin/deleteAdminSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    adminInfo: adminInfoReducer,
    updateAdmin: updateAdminReducer,
    deleteAdmin: deleteAdminReducer
  },
});
