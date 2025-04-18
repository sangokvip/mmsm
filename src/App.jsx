import React, { useState, useRef } from 'react'
import { Container, Typography, Paper, Grid, Box, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, createTheme, ThemeProvider } from '@mui/material'
import Footer from './components/Footer'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import html2canvas from 'html2canvas'
import html2pdf from 'html2pdf.js'
import ScienceIcon from '@mui/icons-material/Science'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import HelpIcon from '@mui/icons-material/Help'
import MenuIcon from '@mui/icons-material/Menu'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import CloseIcon from '@mui/icons-material/Close'
import MaleIcon from '@mui/icons-material/Male'
import MessageIcon from '@mui/icons-material/Message'
import './styles/pixel-theme.css'

function App() {
  // ... existing code ...

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh'
      }}>

      <AppBar position="sticky" sx={{
        background: 'transparent',
        backgroundColor: '#fff0f5',
        border: '4px solid #ff69b4',
        borderBottom: '4px solid #ff69b4',
        boxShadow: '4px 4px 0 rgba(255, 105, 180, 0.5)',
        borderRadius: '0',
        marginBottom: '1rem'
      }} className="pixel-theme-pink">

        <Container maxWidth="lg">
          <Toolbar sx={{ 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: { xs: '8px 16px', md: '8px 24px' },
            minHeight: { xs: '56px', md: '64px' }
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
              flex: '1 1 auto',
              justifyContent: 'flex-start',
              height: '100%'
            }}>
              <ScienceIcon sx={{ display: 'flex', color: '#1E3D59' }} />
              <Typography variant="h5" sx={{
                fontWeight: 'bold',
                color: '#1E3D59',
                display: 'flex',
                alignItems: 'center',
                margin: 0,
                padding: 0,
                lineHeight: 1,
                height: '100%'
              }} className="pixel-title-pink">
                M-Profile Lab
              </Typography>
            </Box>
                
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              gap: 1,
              flex: '1 1 auto',
              justifyContent: 'flex-end'
            }}>              
              <Button color="inherit" startIcon={<HomeIcon />} href="/index.html" className="pixel-button-pink" sx={{ color: '#1E3D59' }}>首页</Button>
              <Button color="inherit" startIcon={<ScienceIcon />} href="/s.html" className="pixel-button-pink" sx={{ color: '#1E3D59' }}>S版</Button>
              <Button color="inherit" startIcon={<MaleIcon />} href="/male.html" className="pixel-button-pink" sx={{ color: '#1E3D59' }}>男生版</Button>
              <Button color="inherit" startIcon={<MessageIcon />} href="/message.html" className="pixel-button-pink" sx={{ color: '#1E3D59' }}>留言板</Button>
            </Box>

            <IconButton
              color="inherit"
              sx={{ display: { xs: 'block', md: 'none' } }}
              onClick={() => setMobileMenuOpen(true)}
              className="pixel-button-pink"
            >
              <MenuIcon sx={{ color: '#1E3D59' }} />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            <ListItem button component="a" href="/index.html">
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="首页" />
            </ListItem>
            <ListItem button component="a" href="/s.html">
              <ListItemIcon><ScienceIcon /></ListItemIcon>
              <ListItemText primary="S版" />
            </ListItem>
            <ListItem button component="a" href="/male.html">
              <ListItemIcon><MaleIcon /></ListItemIcon>
              <ListItemText primary="男生版" />
            </ListItem>
            <ListItem button component="a" href="/message.html">
              <ListItemIcon><MessageIcon /></ListItemIcon>
              <ListItemText primary="留言板" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      // ... rest of the existing code ...
    </ThemeProvider>
  );
}

export default App; 