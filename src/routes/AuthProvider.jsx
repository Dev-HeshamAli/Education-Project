
import { useEffect, useState, useRef } from "react";
import CookieService from "../utils/cookies";
import { actRefreshAuth } from "../store/auth/actRefreshAuth";
import { logout } from "../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const refreshTimer = useRef(null);

  useEffect(() => {
    const scheduleRefresh = (expiresIn) => {
      const expiresInSeconds = parseInt(expiresIn);
      if (isNaN(expiresInSeconds) || expiresInSeconds <= 0) {
        // console.warn("Invalid expiresIn value:", expiresIn);
        return;
      }

      const refreshTime = Math.max((expiresInSeconds - 50) * 1000, 5000);

      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }

      refreshTimer.current = setTimeout(async () => {
        const storedToken = CookieService.getCookie("token");
        const storedRefreshToken = CookieService.getCookie("refreshToken");

        // console.log("⏳ Refreshing with:", {
        //   token: storedToken,
        //   refreshToken: storedRefreshToken,
        // });

        if (storedToken && storedRefreshToken) {
          try {
            const result = await dispatch(
              actRefreshAuth({
                token: storedToken,
                refrehToken: storedRefreshToken,
              })
            );

            if (actRefreshAuth.rejected.match(result)) {
              dispatch(logout());
              navigate("/", { replace: true });
            } else if (actRefreshAuth.fulfilled.match(result)) {
              // console.log("✅ Token refreshed successfully");

              // نحدث الكوكيز بالقيم الجديدة من السيرفر
              CookieService.setCookie("token", result.payload.token, {
                path: "/",
              });
              CookieService.setCookie(
                "refreshToken",
                result.payload.refreshToken,
                { path: "/" }
              );
              CookieService.setCookie("expiresIn", result.payload.expiresIn, {
                path: "/",
              });
              CookieService.setCookie(
                "refreshTokenExpiretion",
                result.payload.refreshTokenExpiretion,
                { path: "/" }
              );

              // console.log("Cookies after refresh:", {
              //   token: CookieService.getCookie("token"),
              //   refreshToken: CookieService.getCookie("refreshToken"),
              // });

              // نعيد ضبط التايمر بالقيمة الجديدة
              scheduleRefresh(result.payload.expiresIn);
            }
          } catch (error) {
            console.error("Error during token refresh:", error);
            dispatch(logout());
            navigate("/", { replace: true });
          }
        } else {
          dispatch(logout());
          navigate("/", { replace: true });
        }
      }, refreshTime);
    };

    const initAuth = async () => {
      try {
        const storedToken = CookieService.getCookie("token");
        const storedRefreshToken = CookieService.getCookie("refreshToken");
        // const expiresIn = CookieService.getCookie("expiresIn");

        if (!storedToken || !storedRefreshToken) {
          dispatch(logout());
          navigate("/", { replace: true });
          setLoading(false);
          return;
        }

        // نبدأ بعمل refresh مبدئي أو نحدد التايمر
        const result = await dispatch(
          actRefreshAuth({
            token: storedToken,
            refrehToken: storedRefreshToken,
          })
        );

        if (actRefreshAuth.rejected.match(result)) {
          dispatch(logout());
          navigate("/", { replace: true });
        } else if (actRefreshAuth.fulfilled.match(result)) {
          scheduleRefresh(result.payload.expiresIn);
        }
      } catch (error) {
        console.error("Error in initAuth:", error);
        dispatch(logout());
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }
    };
  }, [dispatch, navigate]); // شلنا token من dependencies

  useEffect(() => {
    if (error && error.includes && error.includes("401")) {
      dispatch(logout());
      navigate("/", { replace: true });
    }
  }, [error, dispatch, navigate]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={80} />
      </Box>
    );
  }

  return <>{children}</>;
}
