import React from 'react';
import { CssBaseline, Box, Typography, Container } from '@mui/material';
import ReportContent from './components/ReportContent';
import WeldDemo from './components/WeldDemo';
import Header from './components/Header';

function App() {
  return (
    <>
      <CssBaseline />
      <Header />
      <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh' }}>
        <ReportContent />

        <Box id="demo-section" sx={{ bgcolor: '#f8f9fa', py: 5, borderTop: '1px solid #e0e0e0', width: '100%' }}>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={5}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Live Demo Application
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Experience the real-time processing system. Upload a weld image to see the analysis results.
                    </Typography>
                </Box>
            </Container>
            <WeldDemo />
        </Box>

        <Box sx={{ bgcolor: '#333', color: 'white', py: 4, textAlign: 'center' }}>
            <Typography variant="body2">
                © 2025 Q&C Vision Multi-Agents AI - OJT Report at VietDynamic JSC.
            </Typography>
        </Box>
      </Box>
    </>
  );
}

export default App;
