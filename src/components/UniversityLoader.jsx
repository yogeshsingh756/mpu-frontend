import { Box, Typography, CircularProgress, keyframes } from '@mui/material'
import { School, MenuBook, Science, Computer } from '@mui/icons-material'

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
`

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

export default function UniversityLoader({ message = 'Loading...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        p: 4,
        position: 'relative'
      }}
    >
      {/* University Logo */}
      <Box sx={{ position: 'relative', mb: 3 }}>
        <img 
          src='https://admission.mpublp.ac.in/Images/logo.png' 
          alt='University Logo' 
          style={{ 
            width: 80, 
            height: 80,
            animation: `${float} 3s ease-in-out infinite`
          }}
        />
        
        {/* Circular Progress around logo */}
        <CircularProgress
          size={100}
          thickness={2}
          sx={{
            position: 'absolute',
            top: -10,
            left: -10,
            color: 'primary.main',
            animation: `${rotate} 2s linear infinite`
          }}
        />
      </Box>

      {/* Floating Academic Icons */}
      <Box sx={{ position: 'relative', mb: 3 }}>
        <School
          sx={{
            position: 'absolute',
            top: -20,
            left: -40,
            fontSize: 24,
            color: 'primary.main',
            animation: `${pulse} 2s ease-in-out infinite`,
            animationDelay: '0s'
          }}
        />
        <MenuBook
          sx={{
            position: 'absolute',
            top: -30,
            right: -40,
            fontSize: 20,
            color: 'secondary.main',
            animation: `${pulse} 2s ease-in-out infinite`,
            animationDelay: '0.5s'
          }}
        />
        <Science
          sx={{
            position: 'absolute',
            bottom: -20,
            left: -30,
            fontSize: 22,
            color: 'success.main',
            animation: `${pulse} 2s ease-in-out infinite`,
            animationDelay: '1s'
          }}
        />
        <Computer
          sx={{
            position: 'absolute',
            bottom: -25,
            right: -35,
            fontSize: 18,
            color: 'info.main',
            animation: `${pulse} 2s ease-in-out infinite`,
            animationDelay: '1.5s'
          }}
        />
      </Box>

      {/* University Name */}
      <Typography
        variant='h6'
        sx={{
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 1,
          textAlign: 'center',
          background: 'linear-gradient(45deg, #1f4b99, #2d5aa0)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        माँ पाटेश्वरी विश्वविद्यालय
      </Typography>

      <Typography
        variant='body2'
        sx={{
          color: 'text.secondary',
          mb: 2,
          textAlign: 'center'
        }}
      >
        Maa Pateshwari University
      </Typography>

      {/* Loading Message */}
      <Typography
        variant='body1'
        sx={{
          color: 'primary.main',
          fontWeight: 'medium',
          animation: `${pulse} 1.5s ease-in-out infinite`
        }}
      >
        {message}
      </Typography>

      {/* Loading Dots */}
      <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              animation: `${pulse} 1s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </Box>
    </Box>
  )
}