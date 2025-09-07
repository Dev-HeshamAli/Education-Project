import { useEffect } from "react";
import { useSelector } from "react-redux";

const DirectionProvider = ({ children }) => {
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    if (Array.isArray(role)) {
      if (role.includes("Admin__Role")) {
        document.documentElement.setAttribute("dir", "ltr");
      } else {
        document.documentElement.setAttribute("dir", "rtl");
      }
    } else {
      document.documentElement.setAttribute("dir", "rtl");
    }
  }, [role]);

  return children;
};

export default DirectionProvider;
