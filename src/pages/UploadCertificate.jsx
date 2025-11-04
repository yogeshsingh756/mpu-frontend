import { useState } from 'react'
import api from '../api/axios'
import { Box, Button, Paper, TextField, Typography, Grid, Card, CardContent, Alert, LinearProgress, useMediaQuery, useTheme } from '@mui/material'
import { CloudUpload, Visibility } from '@mui/icons-material'

export default function UploadCertificate(){
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [orgId, setOrgId] = useState('')
  const [agencyId, setAgencyId] = useState('1')
  const [grade, setGrade] = useState('')
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const upload = async ()=>{ 
    if (!file) { 
      setError('Please choose a PDF file')
      return
    }
    if (!orgId.trim()) {
      setError('Organization ID is required')
      return
    }
    
    setUploading(true)
    setError('')
    
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await api.post(`/api/upload/organization/${orgId}/certificate?agencyId=${agencyId}&grade=${grade}`, form, { 
        headers:{ 'Content-Type':'multipart/form-data' } 
      })
      setUrl(res.data.url)
    } catch (err) {
      setError('Failed to upload certificate. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper 
        elevation={3}
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
        }}
      >
        <Typography 
          variant={isMobile ? 'h5' : 'h4'} 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            color: 'primary.main',
            textAlign: 'center'
          }}
        >
          Upload Accreditation Certificate
        </Typography>
        
        <Typography 
          variant='body2' 
          color='text.secondary' 
          sx={{ mb: 4, textAlign: 'center' }}
        >
          Upload PDF certificates for organization accreditation
        </Typography>

        {error && (
          <Alert severity='error' sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField 
              label='Organization ID' 
              fullWidth
              value={orgId} 
              onChange={e=> setOrgId(e.target.value)}
              required
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label='Agency ID (1=NAAC)' 
              fullWidth
              value={agencyId} 
              onChange={e=> setAgencyId(e.target.value)}
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label='Grade/Status' 
              fullWidth
              value={grade} 
              onChange={e=> setGrade(e.target.value)}
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                Certificate File (PDF only)
              </Typography>
              <Button
                component='label'
                variant='outlined'
                fullWidth
                sx={{ 
                  py: 2,
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  '&:hover': {
                    borderStyle: 'dashed',
                    borderWidth: 2,
                  }
                }}
              >
                <CloudUpload sx={{ mr: 1 }} />
                {file ? file.name : 'Choose PDF File'}
                <input 
                  type='file' 
                  accept='application/pdf' 
                  onChange={e=> setFile(e.target.files?.[0] || null)}
                  hidden
                />
              </Button>
            </Box>
          </Grid>
        </Grid>

        {uploading && (
          <Box sx={{ mt: 3 }}>
            <LinearProgress />
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1, textAlign: 'center' }}>
              Uploading certificate...
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            variant='contained' 
            onClick={upload}
            disabled={uploading}
            size='large'
            sx={{ 
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Certificate'}
          </Button>
        </Box>

        {url && (
          <Card sx={{ mt: 4, bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Certificate Uploaded Successfully!
              </Typography>
              <Button 
                variant='contained' 
                color='success'
                startIcon={<Visibility />}
                href={url} 
                target='_blank'
                sx={{ borderRadius: 2 }}
              >
                View Certificate
              </Button>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Box>
  )
}