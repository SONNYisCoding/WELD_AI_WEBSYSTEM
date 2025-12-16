import React, { useState, useRef } from 'react'; // <--- [NEW] Thêm useRef
import { 
  Box, Button, Card, CardContent, CardMedia, Grid, Typography, 
  CircularProgress, Alert, Paper, Modal, IconButton,
  // <--- [NEW] Thêm các component cho Dialog chọn file
  Dialog, DialogTitle, DialogContent, List, ListItemButton, 
  ListItemAvatar, ListItemText, Avatar, Divider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import CloseIcon from '@mui/icons-material/Close';

// <--- [NEW] Thêm icon mới
import ComputerIcon from '@mui/icons-material/Computer';
import ImageIcon from '@mui/icons-material/Image';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { createWeldJob, getWeldResult } from "../api/weldApi";
import { API_BASE_URL } from "../config/env";

// ============================================================================
// <--- [NEW] PHẦN TỰ ĐỘNG QUÉT FILE (Chạy lúc Build/Start)
// 1. Quét tất cả file ảnh trong src/assets/samples
// Lưu ý: Đường dẫn '../assets' giả định file này nằm trong src/components
const sampleModules = import.meta.glob('../assets/samples/*.{jpg,png,jpeg}', { eager: true, as: 'url' });

// 2. Chuyển kết quả quét thành danh sách để hiển thị
const AUTO_GENERATED_SAMPLES = Object.keys(sampleModules).map((path) => {
  const fileName = path.split('/').pop(); // Lấy tên file (vd: weld_1.jpg)
  return {
    name: fileName,
    src: sampleModules[path], // URL của ảnh sau khi Vite xử lý
    desc: `Sample Image: ${fileName}`
  };
});
// ============================================================================

const WeldDemo = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  // <--- [NEW] State để bật/tắt Dialog chọn nguồn ảnh
  const [selectionOpen, setSelectionOpen] = useState(false);

  // <--- [NEW] Ref để điều khiển thẻ input file ẩn
  const fileInputRef = useRef(null);

  // <--- [MODIFIED] Sửa hàm này để chỉ xử lý khi người dùng chọn file từ máy
  const handleLocalFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Gọi hàm xử lý chung
      processFile(file);
    }
    // Đóng Dialog sau khi chọn xong
    setSelectionOpen(false);
  };

  // <--- [NEW] Hàm xử lý khi chọn ảnh mẫu (Convert URL -> File)
  const handleSelectSample = async (sample) => {
    try {
      setLoading(true); // Hiệu ứng chờ khi đang tải ảnh mẫu
      const response = await fetch(sample.src);
      const blob = await response.blob();
      // Tạo một File object giả để tái sử dụng logic cũ
      const file = new File([blob], sample.name, { type: blob.type });
      
      processFile(file);
      setSelectionOpen(false); // Đóng Dialog
    } catch (err) {
      console.error("Error loading sample:", err);
      setError("Cannot load this sample file.");
    } finally {
      setLoading(false);
    }
  };

  // <--- [NEW] Tách logic xử lý file ra thành hàm riêng để dùng chung
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

    // const formData = new FormData(); // (Không cần dòng này ở đây vì createWeldJob tự xử lý)
    // formData.append('file', selectedFile);

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
              
              {/* <--- [MODIFIED] Input file bây giờ được ẩn đi và điều khiển qua ref */}
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="hidden-file-input"
                type="file"
                ref={fileInputRef} // Gắn ref vào đây
                onChange={handleLocalFileChange} // Gọi hàm local
              />
              
              {/* <--- [MODIFIED] Button bây giờ mở Dialog thay vì mở file picker ngay */}
              <Button 
                variant="outlined" 
                component="span" 
                startIcon={<CloudUploadIcon />}
                onClick={() => setSelectionOpen(true)} // Mở Dialog
              >
                Select Weld Image
              </Button>

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

      {/* ============================================================================ */}
      {/* <--- [NEW] DIALOG CHỌN NGUỒN ẢNH (Giao diện giả lập thư mục) */}
      <Dialog 
        open={selectionOpen} 
        onClose={() => setSelectionOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: '1px solid #eee' }}>Select Image Source</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List sx={{ pt: 0 }}>
            
            {/* Lựa chọn 1: Upload từ máy tính (Kích hoạt thẻ input ẩn) */}
            <ListItemButton onClick={() => fileInputRef.current.click()} sx={{ py: 2 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#eee', color: '#666' }}>
                  <ComputerIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary="Upload from Device" 
                secondary="Browse files on your local computer" 
              />
              <ChevronRightIcon color="action" />
            </ListItemButton>
            
            <Divider>
                <Typography variant="caption" sx={{ color: '#999', px: 2 }}>
                    AUTO-DETECTED SAMPLES ({AUTO_GENERATED_SAMPLES.length})
                </Typography>
            </Divider>

            {/* Lựa chọn 2: Danh sách file tự động quét được */}
            {AUTO_GENERATED_SAMPLES.map((file) => (
              <ListItemButton key={file.name} onClick={() => handleSelectSample(file)}>
                <ListItemAvatar>
                  <Avatar src={file.src} variant="rounded">
                    <ImageIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={file.name} 
                  secondary={file.desc} 
                />
                <Button size="small" variant="text">Select</Button>
              </ListItemButton>
            ))}

            {/* Thông báo nếu không tìm thấy file nào */}
            {AUTO_GENERATED_SAMPLES.length === 0 && (
                 <Box p={2} textAlign="center" color="text.secondary">
                    No images found in src/assets/samples
                 </Box>
            )}

          </List>
        </DialogContent>
      </Dialog>
      {/* ============================================================================ */}

    </Box>
  );
};

export default WeldDemo;