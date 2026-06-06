import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

const TopBar = ({ user, onLogout }) => {
  const location = useLocation();
  const [contextText, setContextText] = useState("");

  useEffect(() => {
    if (!user) {
      setContextText("");
      return;
    }

    const parts = location.pathname.split("/").filter(Boolean);

    if (parts.length === 2 && parts[1]) {
      const userId = parts[1];
      fetchModel(`/user/${userId}`)
        .then((userData) => {
          if (userData) {
            if (parts[0] === "users") {
              setContextText(userData.first_name + " " + userData.last_name);
            } else if (parts[0] === "photos") {
              setContextText(
                "Photos of " + userData.first_name + " " + userData.last_name
              );
            }
          }
        })
        .catch(() => {
          setContextText("");
        });
    } else {
      setContextText("");
    }
  }, [location.pathname, user]);

  return (
    <AppBar position="fixed">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Photo App</Typography>

        <Typography variant="h6">{contextText || "Photo App"}</Typography>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Typography variant="body1">Hi {user.first_name}</Typography>
            <Button
              color="inherit"
              variant="outlined"
              onClick={onLogout}
              size="small"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Typography variant="body1">Please Login</Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
