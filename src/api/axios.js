// import axios from "axios";
// import store from "../store";
// import { refreshAccessToken } from "../store/PostUserData";

// const api = axios.create({
//   baseURL: "https://edu-smart.runasp.net",
//   withCredentials: true
// });

// api.interceptors.request.use(async (config) => {
//   const state = store.getState().auth;
//   const { token, expiresAt } = state;

//   if (token && Date.now() >= expiresAt) {
//     await store.dispatch(refreshAccessToken());
//     config.headers.Authorization = `Bearer ${store.getState().auth.token}`;
//   } else if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;
