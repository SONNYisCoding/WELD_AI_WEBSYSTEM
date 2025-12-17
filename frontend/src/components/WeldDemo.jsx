import React, { useState, useRef } from 'react';
import { 
  Box, Button, Card, CardContent, Typography, 
  CircularProgress, Alert, Paper, Modal, IconButton,
  Dialog, DialogTitle, DialogContent, List, ListItemButton, 
  ListItemAvatar, ListItemText, Avatar, Divider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import CloseIcon from '@mui/icons-material/Close';
import ComputerIcon from '@mui/icons-material/Computer';
import ImageIcon from '@mui/icons-material/Image';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { createWeldJob } from "../api/weldApi";
import { API_BASE_URL } from "../config/env";

const sampleModules = import.meta.glob('../assets/samples/*.{jpg,png,jpeg}', { eager: true, as: 'url' });
const AUTO_GENERATED_SAMPLES = Object.keys(sampleModules).map((path) => {
  const fileName = path.split('/').pop();
  return {
    name: fileName,
    src: sampleModules[path],
    desc: `Sample Image: ${fileName}`
  };
});

const WeldDemo = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [selectionOpen, setSelectionOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleLocalFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { processFile(file); }
    setSelectionOpen(false);
  };

  const handleSelectSample = async (sample) => {
    try {
      setLoading(true);
      const response = await fetch(sample.src);
      const blob = await response.blob();
      const file = new File([blob], sample.name, { type: blob.type });
      processFile(file);
      setSelectionOpen(false);
    } catch (err) {
      console.error("Error loading sample:", err);
      setError("Cannot load this sample file.");
    } finally {
      setLoading(false);
    }
  };

  const processFile = (file) => {
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError('');
  };

  const handleProcess = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError("");
    try {
      const data = await createWeldJob(selectedFile);
      setResult(data.images);
    } catch (err) {
      console.error(err);
      setError("Processing failed.");
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

  // --- COMPONENT THẺ KẾT QUẢ ---
  const ResultCard = ({ title, imageSrc, step }) => (
      <Card 
        elevation={4} 
        sx={{
          height: '100%', 
          width: '100%',
          display: 'flex', flexDirection: 'column',
          borderRadius: 3, border: '1px solid #e0e0e0',
          transition: 'transform 0.2s',
          '&:hover': { borderColor: 'primary.main', transform: 'translateY(-4px)' }
        }}
      >
        <CardContent sx={{ flexGrow: 0, pb: 1, px: 2, borderBottom: '1px solid #f0f0f0' }}>
          <Typography variant="overline" color="text.secondary" fontWeight="bold">Step {step}</Typography>
          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </Typography>
        </CardContent>
        
        {/* KHUNG ẢNH CỐ ĐỊNH: Cao 240px */}
        <Box 
            sx={{ 
                height: '240px', 
                width: '100%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                bgcolor: '#f5f5f5', 
                position: 'relative',
                overflow: 'hidden'
            }}
        >
          {imageSrc ? (
            <img 
                src={`${API_BASE_URL}${imageSrc}`} 
                alt={title}
                style={{
                    maxWidth: '100%',     
                    maxHeight: '100%',    
                    objectFit: 'contain', // Tự động co giãn để vừa khung
                    display: 'block',
                    cursor: 'pointer'
                }}
                onClick={() => handleOpenModal(`${API_BASE_URL}${imageSrc}`)}
            />
          ) : (
            <Box sx={{ textAlign: 'center', px: 2 }}>
                {loading && <CircularProgress variant="indeterminate" size={20} sx={{ mb: 1 }} />}
                <Typography variant="caption" display="block" color="text.secondary">
                    {loading ? "Processing..." : "Waiting..."}
                </Typography>
            </Box>
          )}
        </Box>
      </Card>
  );

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 4 }, boxSizing: 'border-box' }}>
        
        {/* KHỐI ĐIỀU KHIỂN - GIỮ NGUYÊN */}
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, mb: 5, borderRadius: 4, width: '100%', mx: 'auto' }}>
            {/* Sử dụng CSS Grid cho layout Control Panel */}
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '7fr 5fr' }} gap={4} alignItems="center">
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: '#1565C0' }}>
                        <PrecisionManufacturingIcon sx={{ mr: 1.5, fontSize: 36, verticalAlign: 'bottom' }} />
                        System Demo
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.1rem' }}>
                        Upload a weld image from Samples or PC to simulate the industrial inspection pipeline.
                    </Typography>
                    
                    <input accept="image/*" style={{ display: 'none' }} id="hidden-file-input" type="file" ref={fileInputRef} onChange={handleLocalFileChange} />
                    
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
                        <Button variant="outlined" size="large" startIcon={<CloudUploadIcon />} onClick={() => setSelectionOpen(true)} sx={{ borderRadius: 2, px: 4, borderWidth: 2 }}>
                        SELECT IMAGE
                        </Button>
                        {selectedFile && (
                        <Button variant="contained" size="large" onClick={handleProcess} disabled={loading} sx={{ borderRadius: 2, px: 4 }}>
                            {loading ? "Processing..." : "RUN PIPELINE"}
                        </Button>
                        )}
                    </Box>
                </Box>

                <Box display="flex" justifyContent="center">
                    <Box sx={{ width: '100%', height: '280px', border: '2px dashed #e0e0e0', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa', overflow: 'hidden' }}>
                        {preview ? ( <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> ) : ( <Typography color="text.disabled">No image selected</Typography> )}
                    </Box>
                </Box>
            </Box>
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 4, width: '100%' }}>{error}</Alert>}

        {/* --- [FIX HOÀN HẢO] KHỐI KẾT QUẢ DÙNG CSS GRID --- */}
        {/* Đây là giải pháp tối ưu nhất cho yêu cầu của bạn */}
        <Box 
            sx={{ 
                display: 'grid',
                // Cấu hình cột CỨNG: 
                // - Mobile: 1 cột
                // - Tablet: 2 cột
                // - PC (md trở lên): BẮT BUỘC 4 CỘT BẰNG NHAU (repeat 4, 1fr)
                gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: '1fr 1fr', 
                    md: 'repeat(4, 1fr)' 
                },
                gap: 3, // Khoảng cách giữa các thẻ là 24px
                width: '100%',
                mt: 2
            }}
        >
            {/* minWidth: 0 là chìa khóa để nội dung bên trong không thể đẩy vỡ cột Grid */}
            <Box sx={{ minWidth: 0 }}> <ResultCard step="1" title="ROI Detection" imageSrc={result?.roi} /> </Box>
            <Box sx={{ minWidth: 0 }}> <ResultCard step="2" title="Segmentation" imageSrc={result?.mask} /> </Box>
            <Box sx={{ minWidth: 0 }}> <ResultCard step="3" title="Skeleton Extraction" imageSrc={result?.skeleton} /> </Box>
            <Box sx={{ minWidth: 0 }}> <ResultCard step="4" title="Final Trajectory" imageSrc={result?.track} /> </Box>
        </Box>

      {/* MODAL ZOOM */}
      <Modal open={modalOpen} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Box sx={{ position: 'relative', maxWidth: '100vw', maxHeight: '95vh', outline: 'none' }}>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 10, right: 10, color: 'white', bgcolor: 'rgba(0,0,0,0.6)' }}> <CloseIcon /> </IconButton>
          <img src={modalImage} alt="Zoom" style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: 4 }} />
        </Box>
      </Modal>

      {/* DIALOG CHỌN FILE */}
      <Dialog open={selectionOpen} onClose={() => setSelectionOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #eee' }}>Select Image Source</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List sx={{ pt: 0 }}>
            <ListItemButton onClick={() => fileInputRef.current.click()} sx={{ py: 2 }}>
              <ListItemAvatar> <Avatar sx={{ bgcolor: '#eee' }}><ComputerIcon color="action"/></Avatar> </ListItemAvatar>
              <ListItemText primary="Upload from Device" secondary="Browse local files" />
              <ChevronRightIcon color="action" />
            </ListItemButton>
            <Divider> <Typography variant="caption" sx={{ color: '#999', px: 2 }}>SAMPLES</Typography> </Divider>
            {AUTO_GENERATED_SAMPLES.map((file) => (
              <ListItemButton key={file.name} onClick={() => handleSelectSample(file)}>
                <ListItemAvatar> <Avatar src={file.src} variant="rounded"><ImageIcon /></Avatar> </ListItemAvatar>
                <ListItemText primary={file.name} secondary="Sample" />
                <Button size="small">Select</Button>
              </ListItemButton>
            ))}
             {AUTO_GENERATED_SAMPLES.length === 0 && ( <Box p={2} textAlign="center" color="text.secondary">No samples found.</Box> )}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default WeldDemo;