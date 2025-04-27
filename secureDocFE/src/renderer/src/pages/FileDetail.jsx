// src/pages/FileDetail.jsx
import { Box, Typography, Button, Card, CardContent, CircularProgress } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const FileDetail = () => {
  const navigate = useNavigate();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFileData({
        name: "Document 1",
        description: "This is a secure document.",
        size: "2MB",
        uploadDate: "2025-04-27",
        encrypted: true
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleBack = () => {
    navigate("/files");
  };

  const handleDownload = () => {
    navigate("/files/download");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBack}
        variant="text"
        sx={{ mb: 2 }}
      >
        Back to Files
      </Button>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {fileData.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Description: {fileData.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Size: {fileData.size}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload Date: {fileData.uploadDate}
          </Typography>
          <Typography
            variant="body2"
            color={fileData.encrypted ? "success.main" : "error.main"}
            sx={{ mt: 1 }}
          >
            Encryption Status: {fileData.encrypted ? "Encrypted" : "Not Encrypted"}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleDownload}>
              Download
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FileDetail;
