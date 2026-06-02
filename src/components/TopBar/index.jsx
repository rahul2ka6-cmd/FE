import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";

const TopBar = () => {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);
  // parts[0] = "users" hoặc "photos", parts[1] = userId

  let contextText = "";
  if (parts.length === 2) {
    const userId = parts[1];
    const user = models.userModel(userId);
    if (user) {
      if (parts[0] === "users") {
        contextText = `${user.first_name} ${user.last_name}`;
      } else if (parts[0] === "photos") {
        contextText = `Photos of ${user.first_name} ${user.last_name}`;
      }
    }
  }

  return (
    <AppBar position="fixed">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Your Name</Typography>
        <Typography variant="h6">
          {contextText || "Photo App"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
