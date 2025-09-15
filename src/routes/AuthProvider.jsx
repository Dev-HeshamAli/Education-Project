/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import CookieService from "../utils/cookies";
import { actRefreshAuth } from "../store/auth/actRefreshAuth";
import { logout } from "../store/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { actLogout } from "../store/auth/logout/actLogout";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { error, userid, token, refreshToken } = useSelector(
    (state) => state.auth
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const refreshTimer = useRef(null);

  // ✅ المسارات العامة اللي تشتغل بدون لوجين
  const PUBLIC_PATHS = new Set([
    "/",
    "/home",
    "/login",
    "/vision",
    "/kg1",
    "/kg2",
    "/prim1",
    "/prim2",
    "/prim3",
    "/prim4",
    "/teachers",
    "/register",
    "/forgot-password",
    "/confirm-code",
    "/reset-password",
  ]);

  const isPublicPath = PUBLIC_PATHS.has(location.pathname);

  // دالة جدولة التحديث
  const scheduleRefresh = (expiresIn) => {
    const expiresInSeconds = parseInt(expiresIn);
    if (isNaN(expiresInSeconds) || expiresInSeconds <= 0) return;

    // نعمل refresh قبل انتهاء الصلاحية بدقيقتين
    const refreshTime = Math.max((expiresInSeconds - 60) * 1000, 5000);

    if (refreshTimer.current) clearTimeout(refreshTimer.current);

    refreshTimer.current = setTimeout(async () => {
      const storedToken = CookieService.getCookie("token");
      const storedRefreshToken = CookieService.getCookie("refreshToken");

      if (isPublicPath) {
        // لو صفحة عامة → جرب تعيد تحميل التوكين لو مش موجود
        if (storedToken && storedRefreshToken && !token) {
          const result = await dispatch(
            actRefreshAuth({
              token: storedToken,
              refrehToken: storedRefreshToken,
            })
          );

          if (actRefreshAuth.fulfilled.match(result)) {
            scheduleRefresh(result.payload.expiresIn);
          } else {
            await dispatch(
              actLogout({
                data: { userId: userid, refToken: refreshToken },
                token,
              })
            ).then((res) => {
              if (res.meta.requestStatus === "fulfilled") {
                dispatch(logout());
              }
            });
          }
        }

        setLoading(false);
        return;
      }

      if (storedToken && storedRefreshToken) {
        try {
          const result = await dispatch(
            actRefreshAuth({
              token: storedToken,
              refrehToken: storedRefreshToken,
            })
          );

          if (actRefreshAuth.rejected.match(result)) {
            await dispatch(
              actLogout({
                data: { userId: userid, refToken: refreshToken },
                token,
              })
            ).then((res) => {
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
          dispatch(
            actLogout({
              data: { userId: userid, refToken: refreshToken },
              token,
            })
          ).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
              dispatch(logout());
            }
          });
          navigate("/", { replace: true });
        }
      } else {
        // مش على صفحة عامة ومفيش توكن: وديه للوجين
        await dispatch(
          actLogout({
            data: { userId: userid, refToken: refreshToken },
            token,
          })
        ).then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            dispatch(logout());
          }
        });
        navigate("/", { replace: true });
      }
    }, refreshTime);
  };

  // initAuth عند أول تحميل
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = CookieService.getCookie("token");
        const storedRefreshToken = CookieService.getCookie("refreshToken");

        // ✅ لو عندك توكن في الكوكيز → اعمل refresh
        if (storedToken && storedRefreshToken) {
          const result = await dispatch(
            actRefreshAuth({
              token: storedToken,
              refrehToken: storedRefreshToken,
            })
          );

          if (actRefreshAuth.fulfilled.match(result)) {
            scheduleRefresh(result.payload.expiresIn);
          } else {
            // لو التوكين بايظ → اعمل مسح
            await dispatch(
              actLogout({
                data: { userId: userid, refToken: refreshToken },
                token,
              })
            ).then((res) => {
              if (res.meta.requestStatus === "fulfilled") {
                dispatch(logout());
              }
            });
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error during token refresh:", error);
        await dispatch(
          actLogout({
            data: { userId: userid, refToken: refreshToken },
            token,
          })
        ).then((res) => {
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
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, [dispatch, navigate, location.pathname]);

  // لو حصل 401 وانت مش في صفحة عامة → logout
  useEffect(() => {
    if (!isPublicPath && error && error.includes && error.includes("401")) {
      (async () => {
        await dispatch(
          actLogout({
            data: { userId: userid, refToken: refreshToken },
            token,
          })
        ).then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            dispatch(logout());
          }
        });
        navigate("/", { replace: true });
      })();
    }
  }, [error, isPublicPath, dispatch, navigate, userid, refreshToken, token]);

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
