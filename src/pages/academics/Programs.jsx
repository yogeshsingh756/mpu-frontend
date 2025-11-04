import { useEffect, useState } from "react";
import { 
  Button, Dialog, DialogContent, DialogTitle, TextField, Stack, Paper, 
  Table, TableHead, TableRow, TableCell, TableBody, MenuItem, Typography, Box,
  Card, CardContent, IconButton, Chip, Alert, CircularProgress,
  TableContainer, Divider, useTheme, FormControl, InputLabel, Select,
  InputAdornment
} from "@mui/material";
import { 
  Add, Edit, Delete, School, Search, FilterList, Grade,
  CheckCircle, Cancel, AccessTime, Star
} from "@mui/icons-material";
import { getStreams } from "../../api/academics/streamsApi";
import { getDisciplines } from "../../api/academics/disciplinesApi";
import { searchPrograms, saveProgram, deleteProgram } from "../../api/academics/programsApi";
import ConfirmDialog from '../../components/ConfirmDialog';

export default function Programs(){
  const [streams, setStreams] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [filter, setFilter] = useState({ disciplineId:"", q:"" });
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ programId:0, programName:"", degreeLevel:"UG", streamId:"", disciplineId:"", durationYears:3, totalCredits:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const theme = useTheme();

  const degreeLevelColors = {
    'UG': 'primary',
    'PG': 'secondary', 
    'Diploma': 'success'
  };

  const loadStreams = async() => { 
    try {
      const {data} = await getStreams(); 
      setStreams(data.data||data); 
    } catch (err) {
      setError("Failed to load streams");
    }
  };
  
  const loadDisciplines = async(streamId) => { 
    try {
      const {data} = await getDisciplines(streamId||null); 
      setDisciplines(data.data||data); 
    } catch (err) {
      setError("Failed to load disciplines");
    }
  };
  
  const load = async() => {
    try {
      setLoading(true);
      setError("");
      const {data} = await searchPrograms({ disciplineId: filter.disciplineId || null, q: filter.q, page:1, pageSize:100 });
      setRows(data.data||data);
    } catch (err) {
      setError("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ loadStreams(); },[]);
  useEffect(()=>{ loadDisciplines(form.streamId); },[form.streamId]);
  useEffect(()=>{ loadDisciplines(filter.streamId); },[filter.streamId]);
  useEffect(()=>{ load(); },[filter]);

  const onSave = async() => {
    if (!form.programName.trim() || !form.disciplineId) {
      setError("Program name and discipline are required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const payload = {
        programId: form.programId,
        programName: form.programName.trim(),
        degreeLevel: form.degreeLevel,
        disciplineId: Number(form.disciplineId),
        durationYears: Number(form.durationYears),
        totalCredits: form.totalCredits? Number(form.totalCredits): null,
        isActive:true
      };
      const {data} = await saveProgram(payload);
      if(data.success!==false){ 
        setOpen(false); 
        setForm({programId:0, programName:"", degreeLevel:"UG", streamId:"", disciplineId:"", durationYears:3, totalCredits:""}); 
        await load(); 
      }
    } catch (err) {
      setError("Failed to save program");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (program) => {
    setDeleteDialog({ open: true, id: program.programId, name: program.programName });
  };

  const handleDeleteConfirm = async() => {
    try {
      setLoading(true);
      await deleteProgram(deleteDialog.id);
      await load();
      setDeleteDialog({ open: false, id: null, name: '' });
    } catch (err) {
      setError("Failed to delete program");
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
              <Grade sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">Academic Programs</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Manage degree programs and courses</Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => { setForm({programId:0, programName:"", degreeLevel:"UG", streamId:"", disciplineId:"", durationYears:3, totalCredits:""}); setOpen(true); }}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                borderRadius: 2,
                px: 3
              }}
            >
              Add Program
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Filters & Stats */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 2 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField 
                size="small" 
                label="Search Programs" 
                value={filter.q} 
                onChange={e => setFilter({...filter, q: e.target.value})}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 200 }}
              />
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Discipline</InputLabel>
                <Select
                  value={filter.disciplineId || ""}
                  label="Filter by Discipline"
                  onChange={e => setFilter({...filter, disciplineId: e.target.value})}
                >
                  <MenuItem value="">All Disciplines</MenuItem>
                  {disciplines.map(d => (
                    <MenuItem key={d.disciplineId} value={d.disciplineId}>{d.disciplineName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>
        
        <Stack direction="row" spacing={2}>
          <Card sx={{ bgcolor: 'primary.50' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary" fontWeight="bold">{rows.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total Programs</Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: 'success.50' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main" fontWeight="bold">
                {rows.filter(r => r.degreeLevel === 'UG').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">UG Programs</Typography>
            </CardContent>
          </Card>
        </Stack>
      </Stack>

      {/* Programs Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold">Programs List</Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Program</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Degree Level</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Credits</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r, i) => (
                    <TableRow key={r.programId} hover>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <School color="action" />
                          <Typography variant="body1" fontWeight="medium">{r.programName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={r.degreeLevel}
                          color={degreeLevelColors[r.degreeLevel] || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="body2">{r.durationYears} years</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Star fontSize="small" color="action" />
                          <Typography variant="body2">{r.totalCredits || "N/A"}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          onClick={() => { setForm({...r, streamId:""}); setOpen(true); }}
                          sx={{ mr: 1, color: 'primary.main' }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteClick(r)}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No programs found. Click "Add Program" to create your first program.
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

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Grade />
          {form.programId ? "Edit Program" : "Add New Program"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <TextField 
              label="Program Name" 
              value={form.programName} 
              onChange={e => setForm({...form, programName: e.target.value})}
              fullWidth
              placeholder="e.g., B.Sc Physics, M.A English"
              helperText="Enter the full name of the academic program"
            />
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Degree Level</InputLabel>
                <Select
                  value={form.degreeLevel}
                  label="Degree Level"
                  onChange={e => setForm({...form, degreeLevel: e.target.value})}
                >
                  <MenuItem value="UG">Undergraduate (UG)</MenuItem>
                  <MenuItem value="PG">Postgraduate (PG)</MenuItem>
                  <MenuItem value="Diploma">Diploma</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Discipline</InputLabel>
                <Select
                  value={form.disciplineId}
                  label="Discipline"
                  onChange={e => setForm({...form, disciplineId: e.target.value})}
                >
                  {disciplines.map(d => (
                    <MenuItem key={d.disciplineId} value={d.disciplineId}>{d.disciplineName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField 
                type="number" 
                label="Duration (Years)" 
                value={form.durationYears} 
                onChange={e => setForm({...form, durationYears: e.target.value})}
                fullWidth
                inputProps={{ min: 1, max: 10 }}
              />
              <TextField 
                type="number" 
                label="Total Credits (Optional)" 
                value={form.totalCredits || ""} 
                onChange={e => setForm({...form, totalCredits: e.target.value})}
                fullWidth
                helperText="Leave empty if not applicable"
              />
            </Stack>
            
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
                disabled={loading || !form.programName.trim() || !form.disciplineId}
                startIcon={loading ? <CircularProgress size={16} /> : null}
              >
                {loading ? "Saving..." : "Save Program"}
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
        title="Delete Program"
        message={`Are you sure you want to delete the program "${deleteDialog.name}"? This action cannot be undone.`}
        loading={loading}
      />
    </Box>
  );
}
