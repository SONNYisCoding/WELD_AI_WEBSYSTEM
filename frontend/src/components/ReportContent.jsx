import React from 'react';
import { 
  Box, Container, Typography, Grid, Button, Paper, Divider, Chip
} from '@mui/material';
import {
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector, 
  TimelineContent, TimelineDot, TimelineOppositeContent
}from '@mui/lab';

import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GitHubIcon from '@mui/icons-material/GitHub';
import DescriptionIcon from '@mui/icons-material/Description';
import YouTubeIcon from '@mui/icons-material/YouTube';
import BusinessIcon from '@mui/icons-material/Business';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CropFreeIcon from '@mui/icons-material/CropFree';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import TimelineIcon from '@mui/icons-material/Timeline';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const AUTHORS = [
  { name: "Nguyen Minh Triet", role: "Team Leader" },
  { name: "Thai Thanh Nhan", role: "Member" },
  { name: "Do Tran Nam Du", role: "Member" },
];

const TIMELINE_DATA = [
    { week: "Week 37-39", title: "Research & Initiation", task: "Study Mech-Eye 3D Camera", color: "primary" },
    { week: "Week 39-40", title: "System Setup", task: "Setup Camera & 2D/3D Processing", color: "primary" },
    { week: "Week 41-43", title: "Data & AI Training", task: "Data Collection & Training YOLOv8/U-Net", color: "warning" },
    { week: "Week 43-46", title: "System Integration", task: "Inference Pipeline & Skeletonization", color: "primary" },
    { week: "Week 46-49", title: "Finalization", task: "Final Report & Optimization", color: "success" }
];

const PIPELINE_STEPS = [
  { 
    id: 1, 
    title: "Input Data", 
    tech: "Mech-Eye 3D", 
    desc: "RGB + Point Cloud", 
    icon: <CameraAltIcon fontSize="large" />, 
    color: "#607D8B"
  },
  { 
    id: 2, 
    title: "ROI Detection", 
    tech: "YOLOv8", 
    desc: "Crop Weld Region", 
    icon: <CropFreeIcon fontSize="large" />, 
    color: "#E65100"
  },
  { 
    id: 3, 
    title: "Segmentation", 
    tech: "U-Net", 
    desc: "Pixel-level Mask", 
    icon: <AutoFixHighIcon fontSize="large" />, 
    color: "#2E7D32"
  },
  { 
    id: 4, 
    title: "Skeletonization", 
    tech: "Morphology", 
    desc: "Centerline Extract", 
    icon: <TimelineIcon fontSize="large" />, 
    color: "#1565C0"
  },
  { 
    id: 5, 
    title: "Output", 
    tech: "Robot Path", 
    desc: "(u, v) Coordinates", 
    icon: <PrecisionManufacturingIcon fontSize="large" />, 
    color: "#D81B60"
  }
];

const ReportContent = () => {
  return (
    <Box sx={{ bgcolor: '#f4f6f8', py: 8 }}>
      <Container maxWidth="lg"> 
        <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, bgcolor: 'white' }}>
          
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h1" fontWeight="800" gutterBottom 
                sx={{ 
                  background: 'linear-gradient(45deg, #1565C0 30%, #002f6c 90%)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}>
              Automatic Welding Seam Tracking System
            </Typography>
            
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
              Q&C Vision Multi-Agents AI - OJT Report
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', mb: 4 }}>
              {AUTHORS.map((author, index) => (
                <Box key={index} textAlign="center">
                  <Typography variant="subtitle1" color="#1565C0" fontWeight="bold">
                    {author.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {author.role}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'text.secondary' }}>
               <Typography variant="body2" fontWeight="bold">Instructor: </Typography>
               <Typography variant="body2" color="#1565C0" fontWeight="bold">Tran Trong Toan</Typography>
               <span>|</span>
               <BusinessIcon sx={{ fontSize: 18 }} /> 
               <Typography variant="body2" color="#1565C0" fontWeight="bold">VietDynamic JSC</Typography>
            </Box>

            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center', gap: 2 }}>
              
              <Button 
                variant="contained" 
                startIcon={<DescriptionIcon />} 
                component="a"
                href="/Report.pdf"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ borderRadius: 50, px: 3, bgcolor: '#212121' }}
              >
                Report PDF
              </Button>

              <Button 
                variant="contained" 
                startIcon={<GitHubIcon />} 
                component="a"
                href="https://github.com/SONNYisCoding/WEL_AI_WEBSYSTEM"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ borderRadius: 50, px: 3, bgcolor: '#212121' }}
              >
                Source Code
              </Button>

              <Button 
                variant="contained" 
                startIcon={<YouTubeIcon />} 
                component="a"
                href="https://youtu.be/hQZ_lmSKzrs"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ borderRadius: 50, px: 3, bgcolor: '#212121' }}
              >
                Demo Video
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 6 }} />

          <Box mb={8}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
              Abstract
            </Typography>
            
            <Box sx={{ maxWidth: '800px', mx: 'auto' }}> 
                <Typography variant="body1" paragraph align="justify" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#37474f' }}>
                  This project focuses on the research and development of an automatic welding seam tracking system using a 3D Mech-Eye Camera and modern computer vision algorithms. We build a complete pipeline that includes: 3D data acquisition, Region of Interest (ROI) detection using <strong>YOLOv8</strong>, precise weld seam segmentation using <strong>U-Net</strong>, and skeletonization to guide the welding robot in 3D space.
                </Typography>

                <Typography variant="h6" color="primary" gutterBottom>1. Acquisition & Detection</Typography>
                <Typography variant="body1" paragraph align="justify" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#37474f' }}>
                    High-resolution 3D capture ensures defects are visible. YOLOv8 optimizes processing speed by focusing only on the weld area.
                </Typography>

                <Typography variant="h6" color="primary" gutterBottom>2. Segmentation & Navigation</Typography>
                <Typography variant="body1" paragraph align="justify" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#37474f' }}>
                    U-Net provides mask outputs which are then skeletonized to calculate precise (u, v) coordinates for the robot arm.
                </Typography>                  
            
            </Box>

            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box 
                  component="img"
                  sx={{ 
                      width: '100%', 
                      maxWidth: '900px', 
                      borderRadius: 3, 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                  }}
                  alt="System Overview"
                  src="/images/figure_1_pipeline.png"
                  onError={(e) => {e.target.src = 'https://via.placeholder.com/900x400?text=System+Overview+Architecture'}}
                />
                <Typography variant="caption" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
                  Figure 1. System Overview of Mech-Eye and Welding Robot.
                </Typography>
            </Box>
          </Box>

          <Box mb={6} sx={{ maxWidth: '1200px', mx: 'auto' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
              System Architecture (Pipeline)
            </Typography>
            <Typography variant="body1" paragraph align="justify" sx={{ fontSize: '1.05rem', color: '#37474f', mb: 5, maxWidth: '900px', mx: 'auto' }}>
              The processing system is divided into 5 main stages, operating sequentially to ensure the highest accuracy in an industrial environment:
            </Typography>          
            
            <Grid container alignItems="center" justifyContent="center" spacing={2}>
              {PIPELINE_STEPS.map((step, index) => (
                <React.Fragment key={step.id}>
                  <Grid item xs={12} sm={6} md={2}>
                    <Paper 
                      elevation={3}
                      sx={{ 
                        p: 2, 
                        textAlign: 'center', 
                        height: '100%',
                        borderRadius: 3,
                        borderTop: `4px solid ${step.color}`,
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 60, height: 60, borderRadius: '50%', 
                          bgcolor: `${step.color}15`,
                          color: step.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          mx: 'auto', mb: 2
                        }}
                      >
                        {step.icon}
                      </Box>
                      
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {step.title}
                      </Typography>
                      
                      <Chip 
                        label={step.tech} 
                        size="small" 
                        sx={{ 
                          bgcolor: step.color, 
                          color: 'white', 
                          fontWeight: 'bold', 
                          fontSize: '0.7rem', 
                          mb: 1 
                        }} 
                      />
                      
                      <Typography variant="caption" display="block" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                        {step.desc}
                      </Typography>
                    </Paper>
                  </Grid>

                  {index < PIPELINE_STEPS.length - 1 && (
                    <Grid item xs={12} md="auto" sx={{ display: 'flex', justifyContent: 'center' }}>
                       <Box sx={{ color: '#bdbdbd', display: { xs: 'none', md: 'block' } }}>
                          <ArrowForwardIcon />
                       </Box>
                       <Box sx={{ color: '#bdbdbd', display: { xs: 'block', md: 'none' }, my: 1 }}>
                          <ArrowDownwardIcon />
                       </Box>
                    </Grid>
                  )}
                </React.Fragment>
              ))}
            </Grid>

            <Box mt={6} sx={{ maxWidth: '900px', mx: 'auto' }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            1. <strong>Input Data:</strong> Using Mech-Eye Pro M Enhanced for RGB & Point Cloud.<br/>
                            2. <strong>YOLOv8:</strong> Detects and crops the ROI to remove background noise.<br/>
                            3. <strong>U-Net:</strong> Segments the weld seam at pixel-level precision.<br/>
                            4. <strong>Skeletonization:</strong> Extracts the centerline for robot path planning.<br/>
                            5. <strong>Output Data:</strong> Visualization of the welding trajectory extracted for the robotic arm.
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
          </Box>

          <Box mb={6}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
              Project Timeline
            </Typography>
            <Typography variant="h6" fontWeight="nomarl" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
              [Week 37] 08/09/2025   -   14/12/2025 [Week 49]
            </Typography>

            <Timeline position="alternate"> 
              {TIMELINE_DATA.map((item, index) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                  >
                    <Typography variant="h6" component="span" fontWeight="bold" color={item.color}>
                       {item.week}
                    </Typography>
                  </TimelineOppositeContent>
                  
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot color={item.color}>
                       {item.color === 'success' ? <CheckCircleIcon /> : <LaptopMacIcon />}
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  
                  <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="h6" component="span" fontWeight="bold">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.task}
                      </Typography>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Box>

        </Paper>
      </Container>
    </Box>
  );
};

export default ReportContent;
