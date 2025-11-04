import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { 
  Box, Button, Grid, Paper, TextField, Typography, Stepper, Step, StepLabel, 
  MenuItem, Switch, FormControlLabel, Card, CardContent, Divider, Alert,
  useMediaQuery, useTheme, LinearProgress, Chip, Stack
} from '@mui/material'
import { 
  Business, LocationOn, ManageAccounts, ContactPhone, 
  Save, Cancel, ArrowBack, ArrowForward
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import UniversityLoader from '../components/UniversityLoader'

const steps = [
  { label: 'Basic Info', icon: <Business /> },
  { label: 'Address', icon: <LocationOn /> },
  { label: 'Management', icon: <ManageAccounts /> },
  { label: 'Contact', icon: <ContactPhone /> },
  { label: 'Status', icon: <Save /> }
]

export default function OrganizationForm(){
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isNew = id === 'new'
  
  const [model, setModel] = useState({
    organizationId: 0, nameEn:'', nameHi:'', instituteName:'', instituteCode:'', organizationTypeId:2, categoryId: null, subTypeId: null,
    isAffiliated:false, isAutonomous:false, specialization:'', managementTypeId:null, governmentCategoryId:null, isMinorityInstitution:false, minorityTypeId:null,
    yearOfEstablishment:null, locationTypeId:null, countryId:null, stateId:null, districtId:null, city:'', street:'', pincode:'', geoLatitude:null, geoLongitude:null,
    officialEmail:'', telephoneNumber:'', fax:'', extensionNumber:'', website:'', twitterLink:'', facebookLink:'', linkedinLink:'', statusId:1, isVisible:true, ouCategoryId:1, parentOrganizationId:null
  })
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [masters, setMasters] = useState({ 
    countries:[], states:[], districts:[], orgTypes:[], categories:[], subTypes:[], 
    mgmt:[], govtCats:[], minorities:[], locTypes:[], statuses:[], ouCats:[] 
  })

  const loadMasters = async ()=>{
    try {
      const [countries, states, districts, orgTypes, categories, subTypes, mgmt, govtCats, minorities, locTypes, statuses, ouCats] = await Promise.all([
        api.get('/api/masters/countries'), api.get('/api/masters/states'), api.get('/api/masters/districts'), api.get('/api/masters/organization-types'),
        api.get('/api/masters/categories'), api.get('/api/masters/subtypes'), api.get('/api/masters/management-types'),
        api.get('/api/masters/government-categories'), api.get('/api/masters/minority-types'), api.get('/api/masters/location-types'),
        api.get('/api/masters/statuses'), api.get('/api/masters/ou-categories'),
      ])
      setMasters({ 
        countries: countries.data, states: states.data, districts: districts.data, orgTypes: orgTypes.data, categories: categories.data, subTypes: subTypes.data,
        mgmt: mgmt.data, govtCats: govtCats.data, minorities: minorities.data, locTypes: locTypes.data, statuses: statuses.data, ouCats: ouCats.data 
      })
    } catch (err) {
      setError('Failed to load master data')
    }
  }

  useEffect(()=>{ 
    loadMasters()
    if (!isNew){ 
      api.get(`/api/organizations/${id}`).then(r=> setModel(prev=> ({...prev, ...r.data}))) 
    } 
  }, [id])

  const save = async ()=>{ 
    if (!model.nameEn.trim()) { 
      setError('Organization Name (English) is required')
      return
    }
    if (!model.organizationTypeId) { 
      setError('Organization Type is required')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      await api.post('/api/organizations', model)
      navigate('/organizations')
    } catch (err) {
      setError('Failed to save organization')
    } finally {
      setLoading(false)
    }
  }

  const next = ()=> setStep(s=> Math.min(s+1, steps.length-1))
  const prev = ()=> setStep(s=> Math.max(s-1,0))

  const handleChange = (field) => (event) => {
    let value = event.target.value
    if(['organizationId','organizationTypeId','categoryId','subTypeId','managementTypeId','governmentCategoryId','minorityTypeId','yearOfEstablishment','locationTypeId','countryId','stateId','districtId','statusId','ouCategoryId','parentOrganizationId'].includes(field)){ 
      value = value===''?null:Number(value) 
    }
    
    if(field === 'countryId') {
      setModel({...model, [field]:value, stateId:null, districtId:null})
    } else if(field === 'stateId') {
      setModel({...model, [field]:value, districtId:null})
    } else {
      setModel({...model, [field]:value})
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1f4b99 0%, #2d5aa0 100%)', color: 'white' }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold', mb: 1 }}>
          {isNew ? 'Add New' : 'Edit'} Organization
        </Typography>
        <Typography variant='body1' sx={{ opacity: 0.9 }}>
          {isNew ? 'Create a new educational institution profile' : 'Update organization information'}
        </Typography>
      </Paper>

      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Paper sx={{ mb: 3 }}>
          <UniversityLoader message='Saving Organization...' />
        </Paper>
      )}

      {/* Stepper */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper 
            activeStep={step} 
            alternativeLabel={!isMobile}
            orientation={isMobile ? 'vertical' : 'horizontal'}
          >
            {steps.map((stepInfo, index) => (
              <Step key={stepInfo.label}>
                <StepLabel 
                  icon={stepInfo.icon}
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontSize: isMobile ? '0.875rem' : '1rem'
                    }
                  }}
                >
                  {stepInfo.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant='h6' sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              {steps[step].icon}
              <Box sx={{ ml: 1 }}>{steps[step].label}</Box>
            </Typography>
            <Divider />
          </Box>

          {/* Step 0: Basic Info */}
          {step === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField 
                  label={t('name_en')} 
                  fullWidth 
                  value={model.nameEn} 
                  onChange={handleChange('nameEn')}
                  required
                  error={!model.nameEn.trim()}
                  helperText={!model.nameEn.trim() ? t('required_field') : ''}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  label={t('name_hi')} 
                  fullWidth 
                  value={model.nameHi||''} 
                  onChange={handleChange('nameHi')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  label={t('institute_name')} 
                  fullWidth 
                  value={model.instituteName||''} 
                  onChange={handleChange('instituteName')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  label={t('institute_code')} 
                  fullWidth 
                  value={model.instituteCode||''} 
                  onChange={handleChange('instituteCode')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  select 
                  label='Organization Type' 
                  fullWidth 
                  value={model.organizationTypeId||''} 
                  onChange={handleChange('organizationTypeId')}
                  required
                  error={!model.organizationTypeId}
                  helperText={!model.organizationTypeId ? 'Required field' : ''}
                >
                  {masters.orgTypes.map(x=> 
                    <MenuItem key={x.organizationTypeId} value={x.organizationTypeId}>
                      {x.typeName}
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  select 
                  label='Category' 
                  fullWidth 
                  value={model.categoryId||''} 
                  onChange={handleChange('categoryId')}
                >
                  {masters.categories.map(x=> 
                    <MenuItem key={x.categoryId} value={x.categoryId}>
                      {x.categoryName}
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  select 
                  label='Sub Type' 
                  fullWidth 
                  value={model.subTypeId||''} 
                  onChange={handleChange('subTypeId')}
                >
                  {masters.subTypes.map(x=> 
                    <MenuItem key={x.subTypeId} value={x.subTypeId}>
                      {x.subTypeName}
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  label='Year of Establishment' 
                  fullWidth 
                  type='number'
                  value={model.yearOfEstablishment||''} 
                  onChange={handleChange('yearOfEstablishment')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={model.isAffiliated} 
                      onChange={(e)=> setModel({...model, isAffiliated: e.target.checked})} 
                    />
                  } 
                  label='Affiliated Institution' 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={model.isAutonomous} 
                      onChange={(e)=> setModel({...model, isAutonomous: e.target.checked})} 
                    />
                  } 
                  label='Autonomous Institution' 
                />
              </Grid>
            </Grid>
          )}

          {/* Step 1: Address */}
          {step === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField 
                  select 
                  label={t('country')} 
                  fullWidth 
                  value={model.countryId||''} 
                  onChange={handleChange('countryId')}
                >
                  {masters.countries.map(x=> 
                    <MenuItem key={x.countryId} value={x.countryId}>
                      {x.countryName}
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField 
                  select 
                  label={t('state')} 
                  fullWidth 
                  value={model.stateId||''} 
                  onChange={handleChange('stateId')} 
                  disabled={!model.countryId}
                >
                  {masters.states.filter(s=> !model.countryId || s.countryId===model.countryId).map(x=> 
                    <MenuItem key={x.stateId} value={x.stateId}>
                      {x.stateName}
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField 
                  select 
                  label={t('district')} 
                  fullWidth 
                  value={model.districtId||''} 
                  onChange={handleChange('districtId')} 
                  disabled={!model.stateId}
                >
                  {masters.districts.filter(d=> !model.stateId || d.stateId===model.stateId).map(x=> 
                    <MenuItem key={x.districtId} value={x.districtId}>
                      {x.districtName}
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  label={t('city')} 
                  fullWidth 
                  value={model.city||''} 
                  onChange={handleChange('city')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  label='Pincode' 
                  fullWidth 
                  value={model.pincode||''} 
                  onChange={handleChange('pincode')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label='Street Address' 
                  fullWidth 
                  multiline
                  rows={2}
                  value={model.street||''} 
                  onChange={handleChange('street')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  label='Latitude' 
                  fullWidth 
                  type='number'
                  value={model.geoLatitude||''} 
                  onChange={handleChange('geoLatitude')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  label='Longitude' 
                  fullWidth 
                  type='number'
                  value={model.geoLongitude||''} 
                  onChange={handleChange('geoLongitude')}
                />
              </Grid>
            </Grid>
          )}

          {/* Step 2: Management */}
          {step === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField 
                  select 
                  label='Management Type' 
                  fullWidth 
                  value={model.managementTypeId||''} 
                  onChange={handleChange('managementTypeId')}
                >
                  {masters.mgmt.map(x=> 
                    <MenuItem key={x.managementTypeId} value={x.managementTypeId}>
                      {x.managementTypeName}
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  select 
                  label='Government Category' 
                  fullWidth 
                  value={model.governmentCategoryId||''} 
                  onChange={handleChange('governmentCategoryId')}
                >
                  {masters.govtCats.map(x=> 
                    <MenuItem key={x.governmentCategoryId} value={x.governmentCategoryId}>
                      {x.governmentCategoryName}
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  select 
                  label='Location Type' 
                  fullWidth 
                  value={model.locationTypeId||''} 
                  onChange={handleChange('locationTypeId')}
                >
                  {masters.locTypes.map(x=> 
                    <MenuItem key={x.locationTypeId} value={x.locationTypeId}>
                      {x.locationTypeName}
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={model.isMinorityInstitution} 
                      onChange={(e)=> setModel({...model, isMinorityInstitution: e.target.checked})} 
                    />
                  } 
                  label='Minority Institution' 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label='Specialization' 
                  fullWidth 
                  multiline
                  rows={3}
                  value={model.specialization||''} 
                  onChange={handleChange('specialization')}
                />
              </Grid>
            </Grid>
          )}

          {/* Step 3: Contact */}
          {step === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField 
                  label='Official Email' 
                  fullWidth 
                  type='email'
                  value={model.officialEmail||''} 
                  onChange={handleChange('officialEmail')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  label='Telephone Number' 
                  fullWidth 
                  value={model.telephoneNumber||''} 
                  onChange={handleChange('telephoneNumber')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  label='Fax Number' 
                  fullWidth 
                  value={model.fax||''} 
                  onChange={handleChange('fax')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  label='Extension Number' 
                  fullWidth 
                  value={model.extensionNumber||''} 
                  onChange={handleChange('extensionNumber')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label='Website URL' 
                  fullWidth 
                  type='url'
                  value={model.website||''} 
                  onChange={handleChange('website')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField 
                  label='Twitter Link' 
                  fullWidth 
                  value={model.twitterLink||''} 
                  onChange={handleChange('twitterLink')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField 
                  label='Facebook Link' 
                  fullWidth 
                  value={model.facebookLink||''} 
                  onChange={handleChange('facebookLink')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField 
                  label='LinkedIn Link' 
                  fullWidth 
                  value={model.linkedinLink||''} 
                  onChange={handleChange('linkedinLink')}
                />
              </Grid>
            </Grid>
          )}

          {/* Step 4: Status */}
          {step === 4 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField 
                  select 
                  label='Status' 
                  fullWidth 
                  value={model.statusId||''} 
                  onChange={handleChange('statusId')}
                >
                  {masters.statuses.map(x=> 
                    <MenuItem key={x.statusId} value={x.statusId}>
                      {x.statusName}
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  select 
                  label='OU Category' 
                  fullWidth 
                  value={model.ouCategoryId||''} 
                  onChange={handleChange('ouCategoryId')}
                >
                  {masters.ouCats.map(x=> 
                    <MenuItem key={x.ouCategoryId} value={x.ouCategoryId}>
                      {x.ouCategoryName}
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={model.isVisible} 
                      onChange={(e)=> setModel({...model, isVisible: e.target.checked})} 
                    />
                  } 
                  label='Visible to Public' 
                />
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Stack 
            direction={isMobile ? 'column' : 'row'} 
            spacing={2} 
            justifyContent='space-between'
            alignItems='center'
          >
            <Button 
              disabled={step === 0} 
              onClick={prev}
              startIcon={<ArrowBack />}
              variant='outlined'
              fullWidth={isMobile}
            >
              Previous
            </Button>
            
            <Chip 
              label={`Step ${step + 1} of ${steps.length}`} 
              color='primary' 
              variant='outlined'
            />

            {step < steps.length - 1 ? (
              <Button 
                variant='contained' 
                onClick={next}
                endIcon={<ArrowForward />}
                fullWidth={isMobile}
              >
                Next
              </Button>
            ) : (
              <Stack direction={isMobile ? 'column' : 'row'} spacing={1} sx={{ width: isMobile ? '100%' : 'auto' }}>
                <Button 
                  variant='contained' 
                  onClick={save}
                  disabled={loading}
                  startIcon={<Save />}
                  fullWidth={isMobile}
                >
                  {loading ? 'Saving...' : 'Save Organization'}
                </Button>
                <Button 
                  onClick={()=> navigate('/organizations')}
                  startIcon={<Cancel />}
                  fullWidth={isMobile}
                >
                  Cancel
                </Button>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}