import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

const TopBar = () => {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);
  const [contextText, setContextText] = useState("Photo App");

  useEffect(() => {
    // parts[0] = "users" hoặc "photos", parts[1] = userId
    if (parts.length === 2) {
      const userId = parts[1];
      fetchModel(`/user/${userId}`).then((user) => {
        if (parts[0] === "users") {
          setContextText(`${user.first_name} ${user.last_name}`);
        } else if (parts[0] === "photos") {
          setContextText(`Photos of ${user.first_name} ${user.last_name}`);
        }
      }).catch(() => setContextText("Photo App"));
    } else {
      setContextText("Photo App");
    }
  }, [location.pathname]);

  return (
    <AppBar position="fixed">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Your Name</Typography>
        <Typography variant="h6">{contextText}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
