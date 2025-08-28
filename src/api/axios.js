// import axios from "axios";
// import { store } from "../store/index";
// import { refreshAccessToken } from "../store/auth/refreshAccessToken";

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


import axios from "axios";

const api = axios.create({
  baseURL: "https://edu-smart.runasp.net",
  withCredentials: true,
});

// setupInterceptors will be called after the Redux store is created to avoid circular imports
export function setupInterceptors(store, refreshAction) {
  // Request interceptor: attach access token and refresh if expired
  api.interceptors.request.use(async (config) => {
    try {
      const state = store.getState();
      const auth = state.auth || {};
      const token = auth.token;
      const expiresAt = auth.expiresAt || 0;

      // if token exists and is expired (or close to expire), dispatch refresh
      if (token && Date.now() >= expiresAt) {
        // dispatch refresh action (refreshAction should be an imported thunk passed from store setup)
        await store.dispatch(refreshAction());
        const newToken = store.getState().auth.token;
        if (newToken) config.headers.Authorization = `Bearer ${newToken}`;
      } else if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (err) {
      return config;
    }
  });

  // Response interceptor: you can catch 401 and attempt a refresh here as well
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      // avoid infinite loop
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await store.dispatch(refreshAction());
          const newToken = store.getState().auth.token;
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (e) {
          // refresh failed -> let error propagate
        }
      }
      return Promise.reject(error);
    }
  );
}

export default api;
