import { useEffect, useState, useRef } from "react";
import CookieService from "../utils/cookies";
import { actRefreshAuth } from "../store/auth/actRefreshAuth";
import { logout } from "../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { actLogout } from "../store/auth/logout/actLogout";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { error, userid, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const refreshTimer = useRef(null);

  useEffect(() => {
    const scheduleRefresh = (expiresIn) => {
      const expiresInSeconds = parseInt(expiresIn);
      if (isNaN(expiresInSeconds) || expiresInSeconds <= 0) {
        return;
      }

      const refreshTime = Math.max((expiresInSeconds - 50) * 1000, 5000);

      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }

      refreshTimer.current = setTimeout(async () => {
        const storedToken = CookieService.getCookie("token");
        const storedRefreshToken = CookieService.getCookie("refreshToken");

        if (storedToken && storedRefreshToken) {
          try {
            const result = await dispatch(
              actRefreshAuth({
                token: storedToken,
                refrehToken: storedRefreshToken,
              })
            );

            if (actRefreshAuth.rejected.match(result)) {
              dispatch(actLogout({ userid, token })).then((res) => {
                if (res.meta.requestStatus === "fulfilled") {
                  dispatch(logout());
                }
              });
              navigate("/", { replace: true });
            } else if (actRefreshAuth.fulfilled.match(result)) {
              CookieService.setCookie(
                "token",
                result.payload.token,
                {},
                result.payload.expiresIn
              );
              CookieService.setCookie(
                "refreshToken",
                result.payload.refreshToken,
                {},
                result.payload.expiresIn
              );
              CookieService.setCookie(
                "expiresIn",
                result.payload.expiresIn,
                {},
                result.payload.expiresIn
              );
              CookieService.setCookie(
                "refreshTokenExpiretion",
                result.payload.refreshTokenExpiretion,
                {},
                result.payload.expiresIn
              );
              scheduleRefresh(result.payload.expiresIn);
            }
          } catch (error) {
            console.error("Error during token refresh:", error);
            dispatch(actLogout({ userid, token })).then((res) => {
              if (res.meta.requestStatus === "fulfilled") {
                dispatch(logout());
              }
            });
            navigate("/", { replace: true });
          }
        } else {
          dispatch(actLogout({ userid, token })).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
              dispatch(logout());
            }
          });
          navigate("/", { replace: true });
        }
      }, refreshTime);
    };

    const initAuth = async () => {
      try {
        const storedToken = CookieService.getCookie("token");
        const storedRefreshToken = CookieService.getCookie("refreshToken");

        if (!storedToken || !storedRefreshToken) {
          dispatch(actLogout({ userid, token })).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
              dispatch(logout());
            }
          });
          navigate("/", { replace: true });
          setLoading(false);
          return;
        }

        const result = await dispatch(
          actRefreshAuth({
            token: storedToken,
            refrehToken: storedRefreshToken,
          })
        );

        if (actRefreshAuth.rejected.match(result)) {
          dispatch(actLogout({ userid, token })).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
              dispatch(logout());
            }
          });
          navigate("/", { replace: true });
        } else if (actRefreshAuth.fulfilled.match(result)) {
          scheduleRefresh(result.payload.expiresIn);
        }
      } catch (error) {
        console.error("Error in initAuth:", error);
        dispatch(actLogout({ userid, token })).then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            dispatch(logout());
          }
        });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate]);

  useEffect(() => {
    if (error && error.includes && error.includes("401")) {
      dispatch(actLogout({ userid, token })).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          dispatch(logout());
        }
      });
      navigate("/", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
