import React, { useState } from 'react';
import { 
  Box, Button, Card, CardContent, CardMedia, Grid, Typography, 
  CircularProgress, Alert, Paper, Modal, IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import CloseIcon from '@mui/icons-material/Close';
import { createWeldJob, getWeldResult } from "../api/weldApi";
import { API_BASE_URL } from "../config/env";

const WeldDemo = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const data = await createWeldJob(selectedFile);
      setResult(data.images);
    } catch (err) {
      console.error(err);
      setError("An error occurred while processing the pipeline.");
    } finally {
      setLoading(false);
    }
  };  

  const handleOpenModal = (imageSrc) => {
    setModalImage(imageSrc);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalImage('');
  };

  const ResultCard = ({ title, imageSrc, step }) => (
    <Box sx={{ flex: 1, minWidth: '250px', p: 1.5 }}>
      <Card 
        elevation={3} 
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s, box-shadow 0.3s',
          borderRadius: 4,
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 6,
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Step {step}
          </Typography>
          <Typography variant="h6" component="div" gutterBottom>
            {title}
          </Typography>
        </CardContent>
        <Box sx={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f0f0f0' }}>
          {imageSrc ? (
            <CardMedia
              component="img"
              image={`${API_BASE_URL}${imageSrc}`}
              alt={title}
              sx={{ 
                objectFit: "contain",
                cursor: 'pointer',
                maxHeight: '100%',
                maxWidth: '100%',
              }}
              onClick={() => handleOpenModal(`${API_BASE_URL}${imageSrc}`)}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">Awaiting processing...</Typography>
          )}
        </Box>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3, width: '100vw', overflowX: 'hidden' }}>
        <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid #e0e0e0', borderRadius: 4, maxWidth: 'xl', margin: 'auto', boxShadow: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom color="primary.main">
                <PrecisionManufacturingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                System Demo
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Upload a weld image to run the automatic inspection process {"(YOLOv8 -> U-Net -> Tracking)"}.
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="raised-button-file">
                <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
                  Select Weld Image
                </Button>
              </label>
              {selectedFile && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleProcess}
                  disabled={loading}
                  sx={{ ml: 2 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit"/> : "Run Pipeline"}
                </Button>
              )}
            </Grid>
            <Grid item xs={12} md={6} display="flex" justifyContent="center">
              {preview && (
                <img src={preview} alt="Preview" style={{ maxHeight: '200px', borderRadius: '8px' }} />
              )}
            </Grid>
          </Grid>
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 3, maxWidth: 'xl', margin: 'auto' }}>{error}</Alert>}

        <Box sx={{ maxWidth: 'xl', margin: 'auto', display: 'flex', justifyContent: 'center' } }>
          <ResultCard step="1" title="ROI Detection (YOLO)" imageSrc={result?.roi} />
          <ResultCard step="2" title="Segmentation (U-Net)" imageSrc={result?.mask} />
          <ResultCard step="3" title="Skeleton Extraction" imageSrc={result?.skeleton} />
          <ResultCard step="4" title="Final Weld Trajectory" imageSrc={result?.track} />
        </Box>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <img src={modalImage} alt="Enlarged view" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </Box>
      </Modal>
    </Box>
  );
};

export default WeldDemo;
