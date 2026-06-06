import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userId && userId !== "undefined") {
      fetchModel(`/user/${userId}`).then((data) => setUser(data));
    }
  }, [userId]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h5">
        {user.first_name} {user.last_name}
      </Typography>
      <Typography>Location: {user.location}</Typography>
      <Typography>Occupation: {user.occupation}</Typography>
      <Typography>Description: {user.description}</Typography>
      <Button
        variant="contained"
        component={Link}
        to={`/photos/${user._id}`}
        style={{ marginTop: 16 }}
      >
        View Photos
      </Button>
    </div>
  );
};

export default UserDetail;
