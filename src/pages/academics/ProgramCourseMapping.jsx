import { useEffect, useState } from "react";
import { 
  Button, Paper, Stack, TextField, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, 
  Dialog, DialogTitle, DialogContent, Typography, Box, Card, CardContent, IconButton, 
  Chip, Alert, CircularProgress, TableContainer, Divider, useTheme, FormControl, 
  InputLabel, Select, Autocomplete
} from "@mui/material";
import { 
  Add, Edit, Delete, AccountTree, FilterList, School, MenuBook,
  CheckCircle, Cancel, Star, Code, Schedule
} from "@mui/icons-material";
import { getStreams } from "../../api/academics/streamsApi";
import { getDisciplines } from "../../api/academics/disciplinesApi";
import { getPrograms } from "../../api/academics/programsApi";
import { getSyllabus } from "../../api/academics/mappingApi";
import { lookupCourses, getCourses } from "../../api/academics/coursesApi";
import { saveMapping, deleteMapping } from "../../api/academics/mappingApi";
import { getBootstrap } from "../../api/academics/bootstrapApi";
import ConfirmDialog from '../../components/ConfirmDialog';
import UniversityLoader from '../../components/UniversityLoader';

export default function ProgramCourseMapping(){
  const [streams,setStreams]=useState([]);
  const [disciplines,setDisciplines]=useState([]);
  const [programs,setPrograms]=useState([]);
  const [semesters,setSemesters]=useState([]);
  const [components,setComponents]=useState([]);
  const [selected,setSelected]=useState({ streamId:"", disciplineId:"", programId:"" });
  const [syllabus,setSyllabus]=useState([]);
  const [open,setOpen]=useState(false);
  const [form,setForm]=useState({ programCourseId:0, courseId:"", semesterId:"", componentTypeId:"", isMandatory:true });
  const [courseOptions,setCourseOptions]=useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const theme = useTheme();

  const componentColors = {
    'Core': 'primary',
    'Elective': 'secondary',
    'SEC': 'success',
    'AEC': 'warning'
  };

  const loadMasters = async() => {
    try {
      setLoading(true);
      setError("");
      const {data} = await getBootstrap();
      const { streams, disciplines, semesters, nep } = (data.data || data);
      setStreams(streams); setDisciplines(disciplines); setSemesters(semesters); setComponents(nep);
    } catch (err) {
      setError("Failed to load master data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ loadMasters(); },[]);
  useEffect(()=>{ (async()=>{ if(selected.streamId){ const {data}=await getDisciplines(selected.streamId); setDisciplines(data.data||data); }})(); },[selected.streamId]);
  useEffect(()=>{ (async()=>{ if(selected.disciplineId){ const {data}=await getPrograms(selected.disciplineId); setPrograms(data.data||data); }})(); },[selected.disciplineId]);
  useEffect(()=>{ (async()=>{ if(selected.programId){ const {data}=await getSyllabus(selected.programId); setSyllabus(data.data||data); }})(); },[selected.programId]);

  const openAdd = ()=>{ setForm({ programCourseId:0, courseId:"", semesterId:"", componentTypeId:"", isMandatory:true }); setOpen(true); };
  const onSave = async() => {
    if (!form.courseId || !form.semesterId || !form.componentTypeId) {
      setError("All fields are required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const payload = {
        programCourseId: form.programCourseId,
        programId: Number(selected.programId),
        courseId: Number(form.courseId),
        semesterId: Number(form.semesterId),
        componentTypeId: Number(form.componentTypeId),
        isMandatory: form.isMandatory
      };
      const {data} = await saveMapping(payload);
      if(data.success!==false){ 
        setOpen(false); 
        const r = await getSyllabus(selected.programId); 
        setSyllabus(r.data.data||r.data); 
      }
    } catch (err) {
      setError("Failed to save mapping");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (mapping) => {
    setDeleteDialog({ open: true, id: mapping.programCourseId, name: `${mapping.courseCode} - ${mapping.courseName}` });
  };

  const handleDeleteConfirm = async() => {
    try {
      setLoading(true);
      await deleteMapping(deleteDialog.id);
      const r = await getSyllabus(selected.programId);
      setSyllabus(r.data.data||r.data);
      setDeleteDialog({ open: false, id: null, name: '' });
    } catch (err) {
      setError("Failed to delete mapping");
    } finally {
      setLoading(false);
    }
  };

  const onCourseSearch = async(q)=>{
    const {data} = await lookupCourses(q, 20);
    setCourseOptions(data.data||data);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1f4b99 0%, #2d5aa0 100%)', color: 'white' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AccountTree sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">Program-Course Mapping</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Create syllabus by mapping courses to programs</Typography>
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

      {/* Selection Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList /> Select Program
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="end">
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Stream</InputLabel>
              <Select
                value={selected.streamId}
                label="Stream"
                onChange={e => setSelected({...selected, streamId: e.target.value, disciplineId: "", programId: ""})}
              >
                {streams.map(s => (
                  <MenuItem key={s.streamId} value={s.streamId}>{s.streamName}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 200 }} disabled={!selected.streamId}>
              <InputLabel>Discipline</InputLabel>
              <Select
                value={selected.disciplineId}
                label="Discipline"
                onChange={e => setSelected({...selected, disciplineId: e.target.value, programId: ""})}
              >
                {disciplines.map(d => (
                  <MenuItem key={d.disciplineId} value={d.disciplineId}>{d.disciplineName}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 250 }} disabled={!selected.disciplineId}>
              <InputLabel>Program</InputLabel>
              <Select
                value={selected.programId}
                label="Program"
                onChange={e => setSelected({...selected, programId: e.target.value})}
              >
                {programs.map(p => (
                  <MenuItem key={p.programId} value={p.programId}>{p.programName}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button 
              variant="contained" 
              startIcon={<Add />}
              disabled={!selected.programId}
              onClick={openAdd}
              sx={{ minWidth: 150 }}
            >
              Add Course
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Syllabus Table */}
      {selected.programId && (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight="bold">
                Syllabus for {programs.find(p => p.programId == selected.programId)?.programName}
              </Typography>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <UniversityLoader message="Loading syllabus..." />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: 'grey.50' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Semester</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Component</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Credits</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {syllabus.map(row => (
                      <TableRow key={row.programCourseId} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Schedule color="action" fontSize="small" />
                            <Typography variant="body2">{row.semester}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={row.component}
                            color={componentColors[row.component] || 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">{row.courseName}</Typography>
                            <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                              {row.courseCode}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={<Star />}
                            label={`${row.credit}`}
                            color="success"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={row.isMandatory ? "Mandatory" : "Optional"}
                            color={row.isMandatory ? "error" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteClick(row)}
                            sx={{ color: 'error.main' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {syllabus.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No courses mapped yet. Click "Add Course" to start building the syllabus.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Course Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <MenuBook />
          Add Course to Program
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Semester</InputLabel>
                <Select
                  value={form.semesterId}
                  label="Semester"
                  onChange={e => setForm({...form, semesterId: e.target.value})}
                >
                  {semesters.map(s => (
                    <MenuItem key={s.semesterId} value={s.semesterId}>{s.semesterName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>NEP Component</InputLabel>
                <Select
                  value={form.componentTypeId}
                  label="NEP Component"
                  onChange={e => setForm({...form, componentTypeId: e.target.value})}
                >
                  {components.map(c => (
                    <MenuItem key={c.componentTypeId} value={c.componentTypeId}>
                      <Chip 
                        label={c.componentName}
                        color={componentColors[c.componentName] || 'default'}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      {c.componentName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            
            <TextField 
              label="Search Courses" 
              placeholder="Type course code or name to search..." 
              onChange={e => onCourseSearch(e.target.value)}
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel>Select Course</InputLabel>
              <Select
                value={form.courseId}
                label="Select Course"
                onChange={e => setForm({...form, courseId: e.target.value})}
              >
                {courseOptions.map(c => (
                  <MenuItem key={c.courseId} value={c.courseId}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Code fontSize="small" />
                      <Typography variant="body2" fontFamily="monospace">{c.courseCode}</Typography>
                      <Typography variant="body2">-</Typography>
                      <Typography variant="body2" sx={{ flex: 1 }}>{c.courseName}</Typography>
                      <Chip label={`${c.credit} Credits`} size="small" color="success" />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Divider />
            
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button 
                onClick={() => setOpen(false)}
                variant="outlined"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={onSave}
                disabled={loading || !form.courseId || !form.semesterId || !form.componentTypeId}
                startIcon={loading ? <CircularProgress size={16} /> : null}
              >
                {loading ? "Adding..." : "Add to Syllabus"}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Remove Course from Program"
        message={`Are you sure you want to remove "${deleteDialog.name}" from this program? This action cannot be undone.`}
        loading={loading}
      />
    </Box>
  );
}
