import { useEffect, useState } from "react";
import { 
  Button, Paper, Stack, TextField, MenuItem, Table, TableHead, TableRow, TableCell, TableBody,
  Typography, Box, Card, CardContent, IconButton, Chip, Alert, CircularProgress,
  TableContainer, Divider, useTheme, FormControl, InputLabel, Select, Grid,
  Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText
} from "@mui/material";
import { 
  Add, Edit, Delete, Assignment, FilterList, School, Business,
  CheckCircle, Cancel, People, Star, ExpandMore, MenuBook, Schedule
} from "@mui/icons-material";
import { getPrograms } from "../../api/academics/programsApi";
import { getOrgPrograms, saveOrgProgram, deleteOrgProgram } from "../../api/academics/orgProgramsApi";
import { getDisciplines } from "../../api/academics/disciplinesApi";
import { getStreams } from "../../api/academics/streamsApi";
import api from "../../api/axios";
import UniversityLoader from '../../components/UniversityLoader';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function AssignProgramToCollege() {
  const [organizations, setOrganizations] = useState([]);
  const [streams,setStreams]=useState([]);
  const [disciplines,setDisciplines]=useState([]);
  const [programs,setPrograms]=useState([]);
  const [filter,setFilter]=useState({ organizationId: "", streamId:"", disciplineId:"", programId:"" });
  const [list,setList]=useState([]);
  const [intake,setIntake]=useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const theme = useTheme();

  const loadOrganizations = async() => {
    try {
      const {data} = await api.get('/api/organizations');
      setOrganizations(data);
    } catch (err) {
      setError("Failed to load organizations");
    }
  };

  const loadAssignments = async() => {
    if (!filter.organizationId) return;
    try {
      setLoading(true);
      const {data} = await getOrgPrograms(filter.organizationId);
      setList(data.data || data);
    } catch (err) {
      setError("Failed to load program assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrganizations(); }, []);
  useEffect(() => { (async() => { const {data} = await getStreams(); setStreams(data.data||data); })(); }, []);
  useEffect(() => { (async() => { if(filter.streamId){ const {data} = await getDisciplines(filter.streamId); setDisciplines(data.data||data); }})(); }, [filter.streamId]);
  useEffect(() => { (async() => { if(filter.disciplineId){ const {data} = await getPrograms(filter.disciplineId); setPrograms(data.data||data); }})(); }, [filter.disciplineId]);
  useEffect(() => { loadAssignments(); }, [filter.organizationId]);

  const add = async() => {
    if (!filter.organizationId || !filter.programId) {
      setError("Please select both college and program");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const payload = { 
        organizationProgramId: 0, 
        organizationId: Number(filter.organizationId), 
        programId: Number(filter.programId), 
        intakeCapacity: intake ? Number(intake) : null, 
        isActive: true 
      };
      await saveOrgProgram(payload);
      await loadAssignments();
      setIntake(""); 
      setFilter({...filter, programId: ""});
    } catch (err) {
      setError("Failed to assign program");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveClick = (program) => {
    setDeleteDialog({ open: true, id: program.organizationProgramId, name: program.programName });
  };

  const handleRemoveConfirm = async() => {
    try {
      setLoading(true);
      await deleteOrgProgram(deleteDialog.id);
      await loadAssignments();
      setDeleteDialog({ open: false, id: null, name: '' });
    } catch (err) {
      setError("Failed to remove assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1f4b99 0%, #2d5aa0 100%)', color: 'white' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Assignment sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">Assign Programs to Colleges</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Manage program offerings and intake capacity</Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Assignment Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList /> Assign New Program
          </Typography>
          
          <Stack spacing={2}>
            {/* College Selection */}
            <FormControl fullWidth>
              <InputLabel>Select College</InputLabel>
              <Select
                value={filter.organizationId}
                label="Select College"
                onChange={e => setFilter({...filter, organizationId: e.target.value, streamId: "", disciplineId: "", programId: ""})}
              >
                {organizations.map(org => (
                  <MenuItem key={org.organizationId} value={org.organizationId}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Business fontSize="small" />
                      {org.nameEn || org.instituteName}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Program Selection */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl sx={{ minWidth: 200 }} disabled={!filter.organizationId}>
                <InputLabel>Stream</InputLabel>
                <Select
                  value={filter.streamId}
                  label="Stream"
                  onChange={e => setFilter({...filter, streamId: e.target.value, disciplineId: "", programId: ""})}
                >
                  {streams.map(s => (
                    <MenuItem key={s.streamId} value={s.streamId}>{s.streamName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: 200 }} disabled={!filter.streamId}>
                <InputLabel>Discipline</InputLabel>
                <Select
                  value={filter.disciplineId}
                  label="Discipline"
                  onChange={e => setFilter({...filter, disciplineId: e.target.value, programId: ""})}
                >
                  {disciplines.map(d => (
                    <MenuItem key={d.disciplineId} value={d.disciplineId}>{d.disciplineName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: 250 }} disabled={!filter.disciplineId}>
                <InputLabel>Program</InputLabel>
                <Select
                  value={filter.programId}
                  label="Program"
                  onChange={e => setFilter({...filter, programId: e.target.value})}
                >
                  {programs.map(p => (
                    <MenuItem key={p.programId} value={p.programId}>{p.programName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField 
                type="number" 
                label="Intake Capacity" 
                value={intake} 
                onChange={e => setIntake(e.target.value)}
                sx={{ width: 180 }}
                placeholder="Optional"
                helperText="Leave empty if not specified"
              />
              
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={add} 
                disabled={loading || !filter.programId}
                sx={{ minWidth: 120, height: 56 }}
              >
                {loading ? "Assigning..." : "Assign"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Programs Grid */}
      {filter.organizationId && (
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Programs for {organizations.find(o => o.organizationId == filter.organizationId)?.nameEn || organizations.find(o => o.organizationId == filter.organizationId)?.instituteName}
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <UniversityLoader message="Loading programs..." />
            </Box>
          ) : list.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No programs assigned yet. Use the form above to assign programs to this college.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {list.map((program) => (
                <Grid item xs={12} md={6} lg={4} key={program.programId}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      {/* Program Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                            {program.programName}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <Chip label={program.degreeLevel} color="primary" size="small" />
                            <Chip label={`${program.durationYears} Years`} color="secondary" size="small" />
                            <Chip 
                              label={`${program.totalCredits || 
                                program.semesters?.reduce((total, sem) => 
                                  total + (sem.courses?.reduce((semTotal, course) => 
                                    semTotal + (course.credit || 0), 0) || 0), 0) || 0
                              } Credits`} 
                              color="success" 
                              size="small" 
                            />
                          </Stack>
                        </Box>
                        <IconButton 
                          size="small" 
                          onClick={() => handleRemoveClick(program)}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Semesters */}
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                        Curriculum ({program.semesters?.length || 0} Semesters)
                      </Typography>
                      
                      {program.semesters?.map((semester) => (
                        <Accordion key={semester.semesterId} sx={{ mb: 1 }}>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Schedule fontSize="small" color="action" />
                              <Typography variant="body2" fontWeight="medium">
                                {semester.semesterName}
                              </Typography>
                              <Chip 
                                label={`${semester.courses?.length || 0} Courses`} 
                                size="small" 
                                color="info"
                              />
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ pt: 0 }}>
                            <List dense>
                              {semester.courses?.map((course) => (
                                <ListItem key={course.courseId} sx={{ px: 0 }}>
                                  <Box sx={{ width: '100%' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Box>
                                        <Typography variant="body2" fontWeight="medium">
                                          {course.courseCode} - {course.courseName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                          <Chip 
                                            label={course.component} 
                                            size="small" 
                                            color={course.component?.includes('Core') ? 'primary' : 'default'}
                                          />
                                          <Chip 
                                            label={`${Math.round(course.credit)} Credits`} 
                                            size="small" 
                                            color="success"
                                          />
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                </ListItem>
                              ))}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null, name: '' })}
        onConfirm={handleRemoveConfirm}
        title="Remove Program Assignment"
        message={`Are you sure you want to remove "${deleteDialog.name}" from this college? This action cannot be undone.`}
        loading={loading}
      />
    </Box>
  );
}
