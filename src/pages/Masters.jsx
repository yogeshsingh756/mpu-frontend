import { useEffect, useState } from 'react'
import api from '../api/axios'
import { 
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, 
  TextField, Typography, Paper, Divider, IconButton, Alert, Card, CardContent,
  Avatar, Chip, Stack, Fab, useMediaQuery, useTheme, Skeleton, Badge
} from '@mui/material'
import { 
  Add, Delete, Edit, Settings, Public, LocationOn, Business, 
  School, ManageAccounts, Category, Close
} from '@mui/icons-material'

const configs = [
  { key:'countries', title:'Countries', path:'/api/masters/countries', id:'countryId', name:'countryName', icon: <Public />, color: '#1976d2' },
  { key:'states', title:'States', path:'/api/masters/states', id:'stateId', name:'stateName', extra: { countryId: { type:'select', source:'countries', label:'Country' } }, icon: <LocationOn />, color: '#388e3c' },
  { key:'districts', title:'Districts', path:'/api/masters/districts', id:'districtId', name:'districtName', extra: { stateId: { type:'select', source:'states', label:'State' } }, icon: <LocationOn />, color: '#f57c00' },
  { key:'organizationTypes', title:'Organization Types', path:'/api/masters/organization-types', id:'organizationTypeId', name:'typeName', icon: <Business />, color: '#7b1fa2' },
  { key:'categories', title:'Institution Categories', path:'/api/masters/categories', id:'categoryId', name:'categoryName', icon: <Category />, color: '#c2185b' },
  { key:'subtypes', title:'Sub Types', path:'/api/masters/subtypes', id:'subTypeId', name:'subTypeName', icon: <School />, color: '#303f9f' },
  { key:'managementTypes', title:'Management Types', path:'/api/masters/management-types', id:'managementTypeId', name:'managementTypeName', icon: <ManageAccounts />, color: '#1976d2' },
  { key:'governmentCategories', title:'Government Categories', path:'/api/masters/government-categories', id:'governmentCategoryId', name:'governmentCategoryName', icon: <Settings />, color: '#388e3c' },
  { key:'minorityTypes', title:'Minority Types', path:'/api/masters/minority-types', id:'minorityTypeId', name:'minorityTypeName', icon: <Settings />, color: '#f57c00' },
  { key:'locationTypes', title:'Location Types', path:'/api/masters/location-types', id:'locationTypeId', name:'locationTypeName', icon: <LocationOn />, color: '#7b1fa2' },
  { key:'statuses', title:'Statuses', path:'/api/masters/statuses', id:'statusId', name:'statusName', icon: <Settings />, color: '#c2185b' },
  { key:'ouCategories', title:'OU Categories', path:'/api/masters/ou-categories', id:'ouCategoryId', name:'ouCategoryName', icon: <Category />, color: '#303f9f' },
]

export default function Masters(){
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [data, setData] = useState({})
  const [open, setOpen] = useState(false)
  const [currentCfg, setCurrentCfg] = useState(null)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async ()=>{ 
    setLoading(true)
    try {
      const result = {}
      for (const cfg of configs){ 
        const res = await api.get(cfg.path)
        result[cfg.key] = res.data 
      } 
      setData(result)
      setError('')
    } catch (err) {
      setError('Failed to load master data')
    }
    setLoading(false)
  }

  useEffect(()=>{ load() }, [])

  const startAdd = (cfg)=>{ 
    setCurrentCfg(cfg)
    const init={}
    if (cfg.extra){ 
      for (const k of Object.keys(cfg.extra)){ 
        init[k]='' 
      } 
    } 
    init[cfg.id]=0
    init[cfg.name]=''
    setForm(init)
    setOpen(true) 
  }

  const save = async ()=>{ 
    try {
      await api.post(currentCfg.path, form)
      setOpen(false)
      await load()
    } catch (err) {
      setError('Failed to save record')
    }
  }

  const del = async (cfg, id)=>{ 
    if (confirm(`Delete this ${cfg.title.slice(0, -1)}?`)) {
      try {
        await api.delete(`${cfg.path}/${id}`)
        await load()
      } catch (err) {
        setError('Failed to delete record')
      }
    }
  }

  const MasterCard = ({ cfg }) => {
    const records = data[cfg.key] || []
    
    return (
      <Card 
        elevation={3}
        sx={{ 
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': { 
            elevation: 8,
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar 
              sx={{ 
                bgcolor: cfg.color, 
                mr: 2, 
                width: 48, 
                height: 48 
              }}
            >
              {cfg.icon}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {cfg.title}
              </Typography>
              <Badge badgeContent={records.length} color='primary' max={999}>
                <Chip 
                  label={`${records.length} records`} 
                  size='small' 
                  variant='outlined'
                />
              </Badge>
            </Box>
            <Button 
              size='small' 
              variant='contained' 
              startIcon={<Add />}
              onClick={()=> startAdd(cfg)}
              disabled={loading}
              sx={{ 
                bgcolor: cfg.color,
                '&:hover': { bgcolor: cfg.color, filter: 'brightness(0.9)' }
              }}
            >
              Add
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Records List */}
          <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
            {loading ? (
              <Stack spacing={1}>
                {[...Array(3)].map((_, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                    <Skeleton variant='text' width={40} height={20} sx={{ mr: 2 }} />
                    <Skeleton variant='text' width='70%' height={20} sx={{ flex: 1 }} />
                    <Skeleton variant='circular' width={32} height={32} />
                  </Box>
                ))}
              </Stack>
            ) : records.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                  No records found
                </Typography>
                <Button 
                  size='small' 
                  variant='outlined' 
                  startIcon={<Add />}
                  onClick={()=> startAdd(cfg)}
                >
                  Add First Record
                </Button>
              </Box>
            ) : (
              <Stack spacing={1}>
                {records.map(row => (
                  <Box 
                    key={row[cfg.id]} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { 
                        bgcolor: 'grey.50',
                        borderColor: cfg.color
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant='body2' 
                        color='text.secondary' 
                        sx={{ fontSize: '0.75rem' }}
                      >
                        ID: {row[cfg.id]}
                      </Typography>
                      <Typography 
                        variant='body1' 
                        sx={{ 
                          fontWeight: 'medium',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {row[cfg.name]}
                      </Typography>
                    </Box>
                    <IconButton 
                      size='small' 
                      color='error' 
                      onClick={()=> del(cfg, row[cfg.id])}
                      disabled={loading}
                      sx={{ 
                        ml: 1,
                        '&:hover': { 
                          bgcolor: 'error.light',
                          color: 'white'
                        }
                      }}
                    >
                      <Delete fontSize='small' />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </CardContent>
      </Card>
    )
  }

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
          Master Data Management
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Configure and manage all master data for the university system
        </Typography>
      </Box>

      {error && (
        <Alert severity='error' sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Masters Grid */}
      <Grid container spacing={3}>
        {configs.map(cfg => (
          <Grid item xs={12} sm={6} lg={4} key={cfg.key}>
            <MasterCard cfg={cfg} />
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={open} 
        onClose={()=> setOpen(false)} 
        fullWidth 
        maxWidth='sm'
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          bgcolor: 'primary.main',
          color: 'white',
          pb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {currentCfg?.icon}
            <Typography variant='h6' sx={{ ml: 1, fontWeight: 'bold' }}>
              Add {currentCfg?.title}
            </Typography>
          </Box>
          <IconButton 
            onClick={()=> setOpen(false)}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Extra Fields (Dropdowns) */}
            {currentCfg?.extra && Object.entries(currentCfg.extra).map(([k,meta])=> (
              meta.type==='select' ? (
                <TextField 
                  key={k} 
                  select 
                  label={meta.label} 
                  fullWidth
                  value={form[k]||''} 
                  onChange={e=> setForm({ ...form, [k]: Number(e.target.value) })}
                  variant='outlined'
                >
                  {(data[meta.source]||[]).map(x=> {
                    const sourceConfig = configs.find(c => c.key === meta.source)
                    return (
                      <MenuItem key={x[sourceConfig.id]} value={x[sourceConfig.id]}>
                        {x[sourceConfig.name]}
                      </MenuItem>
                    )
                  })}
                </TextField>
              ) : null
            ))}

            {/* Name Field */}
            <TextField 
              label={currentCfg?.name?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
              fullWidth
              value={form[currentCfg?.name]||''} 
              onChange={e=> setForm({ ...form, [currentCfg.name]: e.target.value })}
              variant='outlined'
              required
              helperText='Enter the name for this record'
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={()=> setOpen(false)}
            variant='outlined'
            startIcon={<Close />}
          >
            Cancel
          </Button>
          <Button 
            variant='contained' 
            onClick={save}
            startIcon={<Add />}
            disabled={!form[currentCfg?.name]?.trim()}
          >
            Save Record
          </Button>
        </DialogActions>
      </Dialog>

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
          onClick={() => {
            // Show a simple menu or just add the first config
            startAdd(configs[0])
          }}
        >
          <Add />
        </Fab>
      )}
    </Box>
  )
}