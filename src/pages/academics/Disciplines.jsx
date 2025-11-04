import { useEffect, useState } from "react";
import { 
  Button, Dialog, DialogContent, DialogTitle, TextField, Stack, Paper, 
  Table, TableHead, TableRow, TableCell, TableBody, MenuItem, Typography, Box,
  Card, CardContent, IconButton, Chip, Alert, CircularProgress,
  TableContainer, Divider, useTheme, FormControl, InputLabel, Select
} from "@mui/material";
import { 
  Add, Edit, Delete, Category, FilterList, Science, Palette, Business,
  CheckCircle, Cancel, School
} from "@mui/icons-material";
import { getStreams } from "../../api/academics/streamsApi";
import { getDisciplines, saveDiscipline, deleteDiscipline } from "../../api/academics/disciplinesApi";
import ConfirmDialog from '../../components/ConfirmDialog';
import UniversityLoader from '../../components/UniversityLoader';

export default function Disciplines() {
  const [streams, setStreams] = useState([]);
  const [rows, setRows] = useState([]);
  const [filterStreamId, setFilterStreamId] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ disciplineId:0, streamId:"", disciplineName:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const theme = useTheme();

  const streamIcons = {
    'Science': <Science color="primary" />,
    'Arts': <Palette color="secondary" />,
    'Commerce': <Business color="success" />
  };

  const loadStreams = async() => { 
    try {
      const {data} = await getStreams(); 
      setStreams(data.data||data); 
    } catch (err) {
      setError("Failed to load streams");
    }
  };
  
  const load = async() => { 
    try {
      setLoading(true);
      setError("");
      const {data} = await getDisciplines(filterStreamId||null); 
      setRows(data.data||data); 
    } catch (err) {
      setError("Failed to load disciplines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ loadStreams(); },[]);
  useEffect(()=>{ load(); /* reload when filter changes */ },[filterStreamId]);

  const onSave = async() => {
    if (!form.streamId || !form.disciplineName.trim()) {
      setError("Stream and discipline name are required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const payload = { disciplineId: form.disciplineId, streamId: Number(form.streamId), disciplineName: form.disciplineName.trim(), isActive:true };
      const { data } = await saveDiscipline(payload);
      if(data.success!==false){ 
        setOpen(false); 
        setForm({disciplineId:0,streamId:"",disciplineName:""}); 
        await load(); 
      }
    } catch (err) {
      setError("Failed to save discipline");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (discipline) => {
    setDeleteDialog({ open: true, id: discipline.disciplineId, name: discipline.disciplineName });
  };

  const handleDeleteConfirm = async() => {
    try {
      setLoading(true);
      await deleteDiscipline(deleteDialog.id);
      await load();
      setDeleteDialog({ open: false, id: null, name: '' });
    } catch (err) {
      setError("Failed to delete discipline");
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
              <Category sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">Academic Disciplines</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Manage subjects and specializations under streams</Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => { setForm({disciplineId:0,streamId:"",disciplineName:""}); setOpen(true); }}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                borderRadius: 2,
                px: 3
              }}
            >
              Add Discipline
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

      {/* Filter & Stats */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <FilterList color="action" />
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Stream</InputLabel>
                <Select
                  value={filterStreamId}
                  label="Filter by Stream"
                  onChange={e => setFilterStreamId(e.target.value)}
                >
                  <MenuItem value="">All Streams</MenuItem>
                  {streams.map(s => (
                    <MenuItem key={s.streamId} value={s.streamId}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {streamIcons[s.streamName] || <School />}
                        {s.streamName}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>
        
        <Card sx={{ bgcolor: 'primary.50' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="primary" fontWeight="bold">{rows.length}</Typography>
            <Typography variant="body2" color="text.secondary">Total Disciplines</Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Disciplines Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold">Disciplines List</Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <UniversityLoader message="Loading disciplines..." />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Stream</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Discipline</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r, i) => {
                    const stream = streams.find(s => s.streamId === r.streamId);
                    return (
                      <TableRow key={r.disciplineId} hover>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {streamIcons[stream?.streamName] || <School color="action" />}
                            <Typography variant="body2" color="text.secondary">{stream?.streamName}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight="medium">{r.disciplineName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={<CheckCircle />}
                            label="Active"
                            color="success"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            size="small" 
                            onClick={() => { setForm({disciplineId:r.disciplineId,streamId:r.streamId,disciplineName:r.disciplineName}); setOpen(true); }}
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
                    );
                  })}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No disciplines found. Click "Add Discipline" to create your first discipline.
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
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Category />
          {form.disciplineId ? "Edit Discipline" : "Add New Discipline"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Stream</InputLabel>
              <Select
                value={form.streamId}
                label="Stream"
                onChange={e => setForm({...form, streamId: e.target.value})}
              >
                {streams.map(s => (
                  <MenuItem key={s.streamId} value={s.streamId}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {streamIcons[s.streamName] || <School />}
                      {s.streamName}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField 
              label="Discipline Name" 
              value={form.disciplineName} 
              onChange={e => setForm({...form, disciplineName: e.target.value})}
              fullWidth
              placeholder="e.g., Physics, Chemistry, Mathematics"
              helperText="Enter the name of the academic discipline"
            />
            
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
                disabled={loading || !form.streamId || !form.disciplineName.trim()}
                startIcon={loading ? <CircularProgress size={16} /> : null}
              >
                {loading ? "Saving..." : "Save Discipline"}
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
        title="Delete Discipline"
        message={`Are you sure you want to delete the discipline "${deleteDialog.name}"? This action cannot be undone.`}
        loading={loading}
      />
    </Box>
  );
}
