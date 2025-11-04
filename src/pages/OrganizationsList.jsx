import { useEffect, useState } from 'react'
import api from '../api/axios'
import { deleteOrganization } from '../api/organizationsApi'
import ConfirmDialog from '../components/ConfirmDialog'
import { 
  Box, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, 
  Pagination, Typography, Paper, Chip, IconButton, InputAdornment, Card, 
  CardContent, Grid, Avatar, Divider, TableContainer, Skeleton, Fab,
  useMediaQuery, useTheme, Stack, Badge
} from '@mui/material'
import { 
  Search, Add, Edit, Visibility, Business, LocationOn, Phone, 
  Email, Language, School, FilterList, Delete
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function OrganizationsList(){
  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))
  
  const [rows, setRows] = useState([])
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState(isMobile ? 'card' : 'table')
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' })
  const pageSize = isMobile ? 6 : 10

  const load = async (p=1)=>{ 
    setLoading(true)
    try {
      const res = await api.get('/api/organizations', { params: { q, page: p, pageSize } })
      setRows(res.data)
      setTotal(parseInt(res.headers['x-total-count']||'0',10))
    } catch (err) {
      console.error('Failed to load organizations')
    }
    setLoading(false)
  }

  useEffect(()=>{ load(page) }, [page])
  
  const onSearch = ()=>{ setPage(1); load(1) }
  const pages = Math.max(1, Math.ceil(total / pageSize))

  const handleDeleteClick = (org) => {
    setDeleteDialog({ open: true, id: org.organizationId, name: org.nameEn || org.instituteName })
  }

  const handleDeleteConfirm = async() => {
    try {
      await deleteOrganization(deleteDialog.id)
      await load(page)
      setDeleteDialog({ open: false, id: null, name: '' })
    } catch (err) {
      console.error('Failed to delete organization')
    }
  }

  const getStatusColor = (statusId) => {
    switch(statusId) {
      case 1: return 'success'
      case 2: return 'warning' 
      case 3: return 'error'
      default: return 'default'
    }
  }

  const getStatusText = (statusId) => {
    switch(statusId) {
      case 1: return 'Active'
      case 2: return 'Pending'
      case 3: return 'Inactive'
      default: return 'Unknown'
    }
  }

  const OrganizationCard = ({ org }) => (
    <Card 
      elevation={2}
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': { 
          elevation: 8,
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(31, 75, 153, 0.15)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              mr: 2, 
              width: 48, 
              height: 48,
              fontSize: '1.2rem'
            }}
          >
            <Business />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant='h6' 
              sx={{ 
                fontWeight: 'bold',
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {org.nameEn || 'N/A'}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
              ID: {org.organizationId}
            </Typography>
            <Chip 
              label={getStatusText(org.statusId)} 
              color={getStatusColor(org.statusId)}
              size='small'
              sx={{ mb: 2 }}
            />
          </Box>
        </Box>

        {org.nameHi && (
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            {org.nameHi}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1} sx={{ mb: 3 }}>
          {org.instituteCode && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <School sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant='body2'>
                Code: {org.instituteCode}
              </Typography>
            </Box>
          )}
          {org.city && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant='body2'>
                {org.city}
              </Typography>
            </Box>
          )}
          {org.officialEmail && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant='body2' sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {org.officialEmail}
              </Typography>
            </Box>
          )}
        </Stack>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <IconButton 
            size='small' 
            color='primary'
            onClick={()=> navigate(`/organizations/${org.organizationId}`)}
            sx={{ 
              bgcolor: 'primary.light',
              color: 'white',
              '&:hover': { bgcolor: 'primary.main' }
            }}
          >
            <Edit fontSize='small' />
          </IconButton>
          <IconButton 
            size='small' 
            color='info'
            sx={{ 
              bgcolor: 'info.light',
              color: 'white',
              '&:hover': { bgcolor: 'info.main' }
            }}
          >
            <Visibility fontSize='small' />
          </IconButton>
          <IconButton 
            size='small' 
            color='error'
            onClick={() => handleDeleteClick(org)}
            sx={{ 
              bgcolor: 'error.light',
              color: 'white',
              '&:hover': { bgcolor: 'error.main' }
            }}
          >
            <Delete fontSize='small' />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  )

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(6)].map((_, i) => (
        <Grid item xs={12} sm={6} lg={4} key={i}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant='circular' width={48} height={48} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant='text' width='80%' height={24} />
                  <Skeleton variant='text' width='40%' height={20} />
                </Box>
              </Box>
              <Skeleton variant='text' width='100%' />
              <Skeleton variant='text' width='60%' />
              <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
                <Skeleton variant='circular' width={32} height={32} />
                <Skeleton variant='circular' width={32} height={32} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant={isMobile ? 'h4' : 'h3'} 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 1
          }}
        >
          College Management
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Manage and monitor all educational institutions
        </Typography>
      </Box>

      {/* Search and Actions */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} md={6}>
              <TextField 
                size='small' 
                value={q} 
                onChange={e=>setQ(e.target.value)}
                placeholder="Search organizations..."
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                onKeyPress={e => e.key === 'Enter' && onSearch()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'stretch', md: 'flex-end' } }}>
                <Button 
                  variant='outlined' 
                  onClick={onSearch}
                  disabled={loading}
                  startIcon={<Search />}
                  sx={{ flex: { xs: 1, md: 'none' } }}
                >
                  Search
                </Button>
                <Button 
                  variant='contained' 
                  onClick={()=> navigate('/organizations/new')}
                  startIcon={<Add />}
                  sx={{ flex: { xs: 1, md: 'none' } }}
                >
                  Add New
                </Button>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography variant='body2' color='text.secondary'>
              {loading ? 'Loading...' : `${total} organizations found`}
            </Typography>
            <Badge badgeContent={total} color='primary' max={999}>
              <Business color='action' />
            </Badge>
          </Box>
        </CardContent>
      </Card>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : rows.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Business sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
              No organizations found
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              {q ? 'Try adjusting your search terms' : 'Get started by adding your first organization'}
            </Typography>
            <Button 
              variant='contained' 
              startIcon={<Add />}
              onClick={()=> navigate('/organizations/new')}
            >
              Add Organization
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Card View (Mobile/Tablet) */}
          {(isMobile || viewMode === 'card') && (
            <Grid container spacing={3}>
              {rows.map(org => (
                <Grid item xs={12} sm={6} lg={4} key={org.organizationId}>
                  <OrganizationCard org={org} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Table View (Desktop) */}
          {!isMobile && viewMode === 'table' && (
            <Paper elevation={2}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: 'grey.50' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Organization</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell align='center' sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(org => (
                      <TableRow key={org.organizationId} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>
                              <Business fontSize='small' />
                            </Avatar>
                            <Box>
                              <Typography variant='body1' fontWeight='medium'>
                                {org.nameEn || 'N/A'}
                              </Typography>
                              <Typography variant='body2' color='text.secondary'>
                                ID: {org.organizationId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>
                            {org.instituteCode || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>
                            {org.city || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusText(org.statusId)} 
                            color={getStatusColor(org.statusId)}
                            size='small'
                          />
                        </TableCell>
                        <TableCell align='center'>
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <IconButton 
                              size='small' 
                              color='primary'
                              onClick={()=> navigate(`/organizations/${org.organizationId}`)}
                            >
                              <Edit fontSize='small' />
                            </IconButton>
                            <IconButton size='small' color='info'>
                              <Visibility fontSize='small' />
                            </IconButton>
                            <IconButton 
                              size='small' 
                              color='error'
                              onClick={() => handleDeleteClick(org)}
                            >
                              <Delete fontSize='small' />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={pages} 
            page={page} 
            onChange={(_,p)=> setPage(p)}
            color='primary'
            showFirstButton 
            showLastButton
            size={isMobile ? 'small' : 'medium'}
          />
        </Box>
      )}

      {/* Floating Action Button (Mobile) */}
      {isMobile && (
        <Fab 
          color='primary' 
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24,
            zIndex: 1000
          }}
          onClick={()=> navigate('/organizations/new')}
        >
          <Add />
        </Fab>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Organization"
        message={`Are you sure you want to delete "${deleteDialog.name}"? This action cannot be undone.`}
      />
    </Box>
  )
}