import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchModel("/user/list")
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        }
      })
      .catch(() => {
        // silently fail - user likely not logged in
      });
  }, []);

  return (
    <div>
      <Typography variant="h6" style={{ padding: "8px 16px" }}>
        Users
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem
            key={user._id}
            component={Link}
            to={`/users/${user._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItemText
              primary={`${user.first_name} ${user.last_name}`}
              secondary={user.occupation}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default UserList;
