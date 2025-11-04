import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import api from '../api/axios'
import { Box, Card, CardContent, TextField, Button, Typography, Container, useMediaQuery, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import UniversityLoader from '../components/UniversityLoader'

const schema = yup.object({ 
  username: yup.string().email().required(), 
  password: yup.string().required() 
})

export default function Login(){
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { register, handleSubmit, formState:{ errors, isSubmitting } } = useForm({ 
    resolver: yupResolver(schema) 
  })
  
  const onSubmit = async (data)=>{ 
    try {
      const res = await api.post('/api/Auth/login', data)
      localStorage.setItem('token', res.data.token)
      window.location.href = '/dashboard'
    } catch (err) {
      console.error('Login failed:', err)
    }
  }
  
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }
      }}
    >
      <Container maxWidth='sm'>
        <Card 
          elevation={24}
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <img 
                src='https://admission.mpublp.ac.in/Images/logo.png' 
                alt='University Logo' 
                style={{ 
                  width: isMobile ? 60 : 80, 
                  height: isMobile ? 60 : 80, 
                  marginBottom: 16 
                }}
              />
              <Typography 
                variant={isMobile ? 'subtitle1' : 'h6'} 
                sx={{ 
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 1,
                  lineHeight: 1.2
                }}
              >
                माँ पाटेश्वरी विश्वविद्यालय, बलरामपुर (UP)
              </Typography>
              <Typography 
                variant='body2' 
                color='text.secondary'
                sx={{ mb: 2 }}
              >
                Maa Pateshwari University, Balrampur (UP)
              </Typography>
              <Typography 
                variant='h5' 
                sx={{ 
                  fontWeight: 'bold',
                  color: 'primary.dark',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                University Management System
              </Typography>
            </Box>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField 
                label='Email' 
                fullWidth 
                sx={{ mb: 3 }} 
                {...register('username')} 
                error={!!errors.username} 
                helperText={errors.username?.message}
                variant='outlined'
                size={isMobile ? 'medium' : 'large'}
              />
              <TextField 
                type='password' 
                label='Password' 
                fullWidth 
                sx={{ mb: 4 }} 
                {...register('password')} 
                error={!!errors.password} 
                helperText={errors.password?.message}
                variant='outlined'
                size={isMobile ? 'medium' : 'large'}
              />
              <Button 
                type='submit' 
                variant='contained' 
                fullWidth 
                disabled={isSubmitting}
                sx={{ 
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 'bold',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #1f4b99 0%, #2d5aa0 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1a3f7a 0%, #254a85 100%)',
                  }
                }}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
      
      {/* Loading Overlay */}
      {isSubmitting && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <UniversityLoader message='Logging in...' />
        </Box>
      )}
    </Box>
  )
}