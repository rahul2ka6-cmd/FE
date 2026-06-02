import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, CardMedia, Divider } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

const formatDate = (dateString) => new Date(dateString).toLocaleString();

const UserPhotos = () => {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchModel(`/user/${userId}`).then((data) => setUser(data));
    fetchModel(`/photosOfUser/${userId}`).then((data) => setPhotos(data));
  }, [userId]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h5" style={{ marginBottom: 16 }}>
        Photos of {user.first_name} {user.last_name}
      </Typography>

      {photos.length === 0 ? (
        <Typography>No photos found.</Typography>
      ) : (
        photos.map((photo) => (
          <Card key={photo._id} style={{ marginBottom: 24 }}>
            <CardMedia
              component="img"
              height="300"
              image={`/images/${photo.file_name}`}
              style={{ objectFit: "contain" }}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Posted: {formatDate(photo.date_time)}
              </Typography>

              <Divider style={{ margin: "8px 0" }} />

              <Typography variant="subtitle1">
                Comments ({photo.comments ? photo.comments.length : 0})
              </Typography>

              {photo.comments && photo.comments.length > 0 ? (
                photo.comments.map((comment) => (
                  <div
                    key={comment._id}
                    style={{ marginTop: 8, paddingLeft: 8, borderLeft: "2px solid #ccc" }}
                  >
                    <Link to={`/users/${comment.user._id}`} style={{ fontWeight: "bold" }}>
                      {comment.user.first_name} {comment.user.last_name}
                    </Link>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(comment.date_time)}
                    </Typography>
                    <Typography variant="body1">{comment.comment}</Typography>
                  </div>
                ))
              ) : (
                <Typography variant="body2">No comments yet.</Typography>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default UserPhotos;
