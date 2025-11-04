import { useEffect, useState } from "react";
import { 
  Button, Dialog, DialogContent, DialogTitle, TextField, Stack, Paper, 
  Table, TableHead, TableRow, TableCell, TableBody, Typography, Box,
  Card, CardContent, IconButton, Chip, Alert, CircularProgress,
  TableContainer, Divider, useTheme
} from "@mui/material";
import { 
  Add, Edit, Delete, School, Science, Palette, Business,
  CheckCircle, Cancel
} from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import { getStreams, saveStream, deleteStream } from "../../api/academics/streamsApi";
import UniversityLoader from '../../components/UniversityLoader';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function Streams() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ streamId:0, streamName:"", isActive:true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const theme = useTheme();

  const streamIcons = {
    'Science': <Science color="primary" />,
    'Arts': <Palette color="secondary" />,
    'Commerce': <Business color="success" />,
    'Engineering': <School color="warning" />
  };

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getStreams();
      setRows(data.data || data);
    } catch (err) {
      setError("Failed to load streams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); },[]);

  const onSave = async () => {
    if (!form.streamName.trim()) {
      setError("Stream name is required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const payload = { streamId: form.streamId, streamName: form.streamName.trim(), isActive: true };
      const { data } = await saveStream(payload);
      if(data.success!==false) { 
        setOpen(false); 
        setForm({streamId:0,streamName:"",isActive:true}); 
        await load(); 
      }
    } catch (err) {
      setError("Failed to save stream");
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (r)=>{ setForm({ streamId:r.streamId, streamName:r.streamName }); setOpen(true); };
  const handleDeleteClick = (stream) => {
    setDeleteDialog({ open: true, id: stream.streamId, name: stream.streamName });
  };

  const handleDeleteConfirm = async() => {
    try {
      setLoading(true);
      await deleteStream(deleteDialog.id);
      await load();
      setDeleteDialog({ open: false, id: null, name: '' });
    } catch (err) {
      setError("Failed to delete stream");
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
              <School sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">{t('academic_streams')}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('manage_streams')}</Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => { setForm({streamId:0,streamName:"",isActive:true}); setOpen(true); }}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                borderRadius: 2,
                px: 3
              }}
            >
              {t('add_stream')}
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

      {/* Stats Cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1, bgcolor: 'primary.50' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="primary" fontWeight="bold">{rows.length}</Typography>
            <Typography variant="body2" color="text.secondary">Total Streams</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, bgcolor: 'success.50' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="success.main" fontWeight="bold">
              {rows.filter(r => r.isActive).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Active Streams</Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Streams Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold">Streams List</Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <UniversityLoader message="Loading streams..." />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Stream</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r, i) => (
                    <TableRow key={r.streamId} hover>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {streamIcons[r.streamName] || <School color="action" />}
                          <Typography variant="body1" fontWeight="medium">{r.streamName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={r.isActive ? <CheckCircle /> : <Cancel />}
                          label={r.isActive ? "Active" : "Inactive"}
                          color={r.isActive ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          onClick={() => onEdit(r)}
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
                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No streams found. Click "Add Stream" to create your first stream.
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
          <School />
          {form.streamId ? t('edit') + ' ' + t('streams') : t('add_stream')}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <TextField 
              label="Stream Name" 
              value={form.streamName} 
              onChange={e => setForm({...form, streamName: e.target.value})}
              fullWidth
              variant="outlined"
              placeholder="e.g., Science, Arts, Commerce"
              helperText="Enter the name of the academic stream"
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
                disabled={loading || !form.streamName.trim()}
                startIcon={loading ? <CircularProgress size={16} /> : null}
              >
                {loading ? "Saving..." : "Save Stream"}
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
        title="Delete Stream"
        message={`Are you sure you want to delete the stream "${deleteDialog.name}"? This action cannot be undone.`}
        loading={loading}
      />
    </Box>
  );
}
