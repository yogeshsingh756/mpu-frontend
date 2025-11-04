import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemButton, ListItemText, IconButton, useMediaQuery, useTheme, Collapse } from '@mui/material'
import { Menu, Logout, Dashboard, Business, Settings, Upload, ExpandLess, ExpandMore, School } from '@mui/icons-material'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from 'react-i18next'

const drawerWidth = 280

export default function Layout(){
  const [mobileOpen, setMobileOpen] = useState(false)
  const [academicsOpen, setAcademicsOpen] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Auto-expand Academics section when on academic pages
  useEffect(() => {
    if (location.pathname.startsWith('/academics')) {
      setAcademicsOpen(true)
    }
  }, [location.pathname])
  
  const menu = [
    { to: '/dashboard', label: t('dashboard'), icon: <Dashboard /> },
    { to: '/organizations', label: t('college_management'), icon: <Business /> },
    { to: '/masters', label: t('masters'), icon: <Settings /> },
    { to: '/upload', label: t('upload_certificate'), icon: <Upload /> },
  ]

  const academicsMenu = [
    { to: '/academics/streams', label: t('streams'), icon: <Settings /> },
    { to: '/academics/disciplines', label: t('disciplines'), icon: <Settings /> },
    { to: '/academics/programs', label: t('programs'), icon: <Settings /> },
    { to: '/academics/courses', label: t('courses'), icon: <Settings /> },
    { to: '/academics/mapping', label: t('program_course_mapping'), icon: <Settings /> },
    { to: '/academics/assign-program', label: t('assign_program_to_college'), icon: <Business /> },
  ]
  
  const logout = ()=>{ localStorage.removeItem('token'); navigate('/login') }
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'primary.main',
        color: 'white'
      }}>
        <img 
          src='https://admission.mpublp.ac.in/Images/logo.png' 
          alt='University Logo' 
          style={{ width: 32, height: 32, marginRight: 8 }}
        />
        <Typography variant='subtitle1' fontWeight='bold'>
          MPU Admin
        </Typography>
      </Toolbar>
     <List sx={{ pt: 2 }}>
  {menu.map((m) => (
    <ListItem key={m.to} disablePadding>
      <ListItemButton
        component={Link}
        to={m.to}
        onClick={isMobile ? handleDrawerToggle : undefined}
        sx={{
          mx: 1,
          mb: 0.5,
          borderRadius: 2,
          '&:hover': {
            bgcolor: 'primary.light',
            color: 'white'
          }
        }}
      >
        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
          {m.icon}
        </Box>
        <ListItemText primary={m.label} />
      </ListItemButton>
    </ListItem>
  ))}
  
  {/* Academics Collapsible Section */}
  <ListItem disablePadding>
    <ListItemButton
      onClick={() => setAcademicsOpen(!academicsOpen)}
      sx={{
        mx: 1,
        mb: 0.5,
        borderRadius: 2,
        '&:hover': {
          bgcolor: 'primary.light',
          color: 'white'
        }
      }}
    >
      <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        <School />
      </Box>
      <ListItemText primary={t('academics')} />
      {academicsOpen ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
  </ListItem>
  
  <Collapse in={academicsOpen} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
      {academicsMenu.map((m) => (
        <ListItem key={m.to} disablePadding>
          <ListItemButton
            component={Link}
            to={m.to}
            onClick={isMobile ? handleDrawerToggle : undefined}
            sx={{
              mx: 2,
              mb: 0.5,
              borderRadius: 2,
              pl: 4,
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'white'
              }
            }}
          >
            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              {m.icon}
            </Box>
            <ListItemText primary={m.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Collapse>
</List>
    </Box>
  )

  return (
    <Box sx={{ display:'flex', minHeight: '100vh' }}>
      <AppBar 
        position='fixed' 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #1f4b99 0%, #2d5aa0 100%)'
        }}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <Menu />
          </IconButton>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 2 }}>
            <img 
              src='https://admission.mpublp.ac.in/Images/logo.png' 
              alt='University Logo' 
              style={{ width: 40, height: 40, marginRight: 12 }}
            />
          </Box>
          
          <Typography 
            variant='h6' 
            sx={{ 
              flexGrow: 1,
              fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
              display: { xs: 'none', sm: 'block' }
            }}
          >
            माँ पाटेश्वरी विश्वविद्यालय, बलरामपुर / Maa Pateshwari University, Balrampur (UP)
          </Typography>
          
          <Typography 
            variant='subtitle1' 
            sx={{ 
              flexGrow: 1,
              display: { xs: 'block', sm: 'none' }
            }}
          >
            MPU Admin
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageSwitcher />
            <IconButton 
              color='inherit' 
              onClick={logout} 
              title='Logout'
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component='nav'
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider'
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'grey.50'
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}