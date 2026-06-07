import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

import BASE_URL from "../../lib/config";

const formatDate = (dateString) => new Date(dateString).toLocaleString();

const UserPhotos = ({ currentUser, photoUploadCount }) => {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [submitError, setSubmitError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState({});

  useEffect(() => {
    if (userId && userId !== "undefined") {
      fetchModel(`/user/${userId}`)
        .then((data) => {
          if (data) setUser(data);
        })
        .catch(() => {});
      fetchModel(`/photosOfUser/${userId}`)
        .then((data) => {
          if (Array.isArray(data)) setPhotos(data);
        })
        .catch(() => {});
    }
  }, [userId, photoUploadCount]);

  const handleCommentSubmit = async (photoId) => {
    const comment = commentText[photoId]?.trim();

    if (!comment) {
      setSubmitError((prev) => ({
        ...prev,
        [photoId]: "Comment cannot be empty",
      }));
      return;
    }

    setIsSubmitting((prev) => ({ ...prev, [photoId]: true }));
    setSubmitError((prev) => ({ ...prev, [photoId]: null }));

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/commentsOfPhoto/${photoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add comment");
      }

      // Update photos state with new comment
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) => {
          if (photo._id === photoId) {
            return {
              ...photo,
              comments: [...(photo.comments || []), result.comment],
            };
          }
          return photo;
        })
      );

      // Clear comment text
      setCommentText((prev) => ({ ...prev, [photoId]: "" }));
    } catch (error) {
      setSubmitError((prev) => ({ ...prev, [photoId]: error.message }));
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [photoId]: false }));
    }
  };

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
              image={`${BASE_URL}/images/${photo.file_name}`}
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
                    style={{
                      marginTop: 8,
                      paddingLeft: 8,
                      borderLeft: "2px solid #ccc",
                    }}
                  >
                    {comment.user ? (
                      <Link
                        to={`/users/${comment.user._id}`}
                        style={{ fontWeight: "bold" }}
                      >
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>
                    ) : (
                      <span style={{ fontWeight: "bold" }}>Unknown User</span>
                    )}

                    <Typography variant="body2" color="text.secondary">
                      {formatDate(comment.date_time)}
                    </Typography>
                    <Typography variant="body1">{comment.comment}</Typography>
                  </div>
                ))
              ) : (
                <Typography variant="body2">No comments yet.</Typography>
              )}

              {/* Add Comment Form - Only show if user is logged in */}
              {currentUser && (
                <Box
                  sx={{
                    marginTop: 2,
                    padding: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
                    Add a comment:
                  </Typography>

                  {submitError[photo._id] && (
                    <Alert severity="error" sx={{ marginBottom: 1 }}>
                      {submitError[photo._id]}
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    placeholder="Write your comment here..."
                    value={commentText[photo._id] || ""}
                    onChange={(e) =>
                      setCommentText((prev) => ({
                        ...prev,
                        [photo._id]: e.target.value,
                      }))
                    }
                    disabled={isSubmitting[photo._id]}
                    sx={{ marginBottom: 1 }}
                  />

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleCommentSubmit(photo._id)}
                    disabled={
                      isSubmitting[photo._id] || !commentText[photo._id]?.trim()
                    }
                  >
                    {isSubmitting[photo._id] ? "Adding..." : "Add Comment"}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default UserPhotos;
