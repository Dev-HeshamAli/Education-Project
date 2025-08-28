import { Box } from "@mui/material"; // ✅ من MUI
import React from "react";

import logo from "./logo.png";

const Logo = () => {
  return (
    <Box sx={{ width: 50, height: 50, marginRight: "auto" }}>
      <img
        src={logo}
        alt="logo"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </Box>
  );
};

export default Logo;
