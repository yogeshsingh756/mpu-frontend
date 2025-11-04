import { useEffect, useState } from 'react'
import api from '../api/axios'
import { 
  Grid, Paper, Typography, Box, Card, CardContent, Avatar, 
  useTheme, useMediaQuery, Stack, Divider 
} from '@mui/material'
import { 
  Business, School, Assignment, CheckCircle, 
  Edit, TrendingUp, People, MenuBook 
} from '@mui/icons-material'
import UniversityLoader from '../components/UniversityLoader'
import { useTranslation } from 'react-i18next'

// Enhanced Responsive Dashboard v2.0
export default function Dashboard(){
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [data, setData] = useState(null)
  
  useEffect(() => {
    api.get('/api/dashboard/summary')
      .then(r => setData(r.data))
      .catch(() => setData({ // Fallback data if API fails
        totalOrgs: 0, universities: 0, colleges: 0, 
        accreditations: 0, published: 0, draft: 0 
      }))
  }, [])
  
  if (!data) return <UniversityLoader message='Loading Dashboard Data...' />
  
  const stats = [
    { 
      label: 'Total Organizations', 
      value: data.totalOrgs || 0, 
      icon: <Business />, 
      color: 'primary',
      bgColor: 'primary.50'
    },
    { 
      label: 'Universities', 
      value: data.universities || 0, 
      icon: <School />, 
      color: 'secondary',
      bgColor: 'secondary.50'
    },
    { 
      label: 'Colleges', 
      value: data.colleges || 0, 
      icon: <MenuBook />, 
      color: 'success',
      bgColor: 'success.50'
    },
    { 
      label: 'Accreditations', 
      value: data.accreditations || 0, 
      icon: <Assignment />, 
      color: 'warning',
      bgColor: 'warning.50'
    },
    { 
      label: 'Published', 
      value: data.published || 0, 
      icon: <CheckCircle />, 
      color: 'success',
      bgColor: 'success.50'
    },
    { 
      label: 'Draft', 
      value: data.draft || 0, 
      icon: <Edit />, 
      color: 'grey',
      bgColor: 'grey.100'
    }
  ]
  
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Card sx={{ 
        mb: 4, 
        background: 'linear-gradient(135deg, #1f4b99 0%, #2d5aa0 100%)', 
        color: 'white' 
      }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            <img 
              src='/mpu-logo-final.png' 
              alt='University Logo' 
              style={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48 }}
            />
            <Box>
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
                {t('dashboard')}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                University Management System Overview
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={idx}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(31, 75, 153, 0.15)'
                }
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar 
                    sx={{ 
                      bgcolor: stat.bgColor,
                      color: `${stat.color}.main`,
                      width: 56,
                      height: 56
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h3" 
                      fontWeight="bold" 
                      color={`${stat.color}.main`}
                      sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Quick Actions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'primary.50' }
                }}
                onClick={() => window.location.href = '/organizations/new'}
              >
                <Business color="primary" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="body2">Add Organization</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'secondary.50' }
                }}
                onClick={() => window.location.href = '/academics/streams'}
              >
                <School color="secondary" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="body2">Manage Academics</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'success.50' }
                }}
                onClick={() => window.location.href = '/organizations'}
              >
                <People color="success" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="body2">View Organizations</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'warning.50' }
                }}
                onClick={() => window.location.href = '/masters'}
              >
                <TrendingUp color="warning" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="body2">Master Data</Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}