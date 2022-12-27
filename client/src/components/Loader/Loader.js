import React from "react";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loader() {
  return (
    <Box className="loader ta-center" sx={{ paddingTop: "100px" }}>
      <CircularProgress color="inherit" />
    </Box>
  );
}
