import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import BASE_URL from "../../lib/config";

const TopBar = ({ user, onLogout, onPhotoUploaded }) => {
  const location = useLocation();
  const [contextText, setContextText] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      setContextText("");
      return;
    }

    const parts = location.pathname.split("/").filter(Boolean);

    if (parts.length === 2 && parts[1] && parts[1] !== "undefined") {
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

  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
    setSelectedFile(null);
    setUploadError("");
    setUploadSuccess(false);
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
    setSelectedFile(null);
    setUploadError("");
    setUploadSuccess(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("photo", selectedFile);

      const response = await fetch(`${BASE_URL}/photos/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload photo");
      }

      setUploadSuccess(true);
      setSelectedFile(null);

      // Notify parent component that a photo was uploaded
      if (onPhotoUploaded) {
        onPhotoUploaded(result.photo);
      }

      // Auto close dialog after 1.5 seconds
      setTimeout(() => {
        handleUploadDialogClose();
      }, 1500);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppBar position="fixed">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Photo App</Typography>

        <Typography variant="h6">{contextText || "Photo App"}</Typography>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleUploadDialogOpen}
              size="small"
              startIcon={<CloudUploadIcon />}
            >
              Add Photo
            </Button>
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

      {/* Upload Photo Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={handleUploadDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Upload Photo
          <IconButton
            aria-label="close"
            onClick={handleUploadDialogClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {uploadError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {uploadError}
            </Alert>
          )}
          {uploadSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Photo uploaded successfully!
            </Alert>
          )}

          <input
            accept="image/*"
            style={{ display: "none" }}
            id="photo-upload-input"
            type="file"
            onChange={handleFileSelect}
          />
          <label htmlFor="photo-upload-input">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ mb: 2, py: 2 }}
            >
              Choose File
            </Button>
          </label>

          {selectedFile && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              Selected: {selectedFile.name}
            </Typography>
          )}

          {selectedFile && selectedFile.type.startsWith("image/") && (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: 300,
                objectFit: "contain",
                marginTop: 8,
                borderRadius: 4,
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleUploadDialogClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedFile || uploading || uploadSuccess}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default TopBar;
