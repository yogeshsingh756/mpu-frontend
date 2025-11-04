import { useEffect, useState } from "react";
import { 
  Button, Dialog, DialogContent, DialogTitle, TextField, Stack, Paper, 
  Table, TableHead, TableRow, TableCell, TableBody, Typography, Box,
  Card, CardContent, IconButton, Chip, Alert, CircularProgress,
  TableContainer, Divider, useTheme, InputAdornment
} from "@mui/material";
import { 
  Add, Edit, Delete, MenuBook, Search, Star, Code,
  CheckCircle, Cancel
} from "@mui/icons-material";
import { getCourses, saveCourse, deleteCourse } from "../../api/academics/coursesApi";
import ConfirmDialog from '../../components/ConfirmDialog';
import UniversityLoader from '../../components/UniversityLoader';

export default function Courses(){
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ courseId:0, courseCode:"", courseName:"", credit:4 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const theme = useTheme();

  const getCreditColor = (credit) => {
    if (credit >= 4) return 'success';
    if (credit >= 2) return 'warning';
    return 'default';
  };

  const load = async() => { 
    try {
      setLoading(true);
      setError("");
      const {data} = await getCourses(q); 
      setRows(data.data||data); 
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { 
    const timer = setTimeout(() => load(), 300); // Debounce search
    return () => clearTimeout(timer);
  }, [q]);

  const onSave = async() => {
    if (!form.courseCode.trim() || !form.courseName.trim()) {
      setError("Course code and name are required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const payload = { ...form, courseCode: form.courseCode.trim(), courseName: form.courseName.trim(), credit: Number(form.credit), isActive:true };
      const {data} = await saveCourse(payload);
      if(data.success!==false){ 
        setOpen(false); 
        setForm({courseId:0,courseCode:"",courseName:"",credit:4}); 
        await load(); 
      }
    } catch (err) {
      setError("Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (course) => {
    setDeleteDialog({ open: true, id: course.courseId, name: `${course.courseCode} - ${course.courseName}` });
  };

  const handleDeleteConfirm = async() => {
    try {
      setLoading(true);
      await deleteCourse(deleteDialog.id);
      await load();
      setDeleteDialog({ open: false, id: null, name: '' });
    } catch (err) {
      setError("Failed to delete course");
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
              <MenuBook sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">Academic Courses</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Manage course subjects and credits</Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => { setForm({courseId:0,courseCode:"",courseName:"",credit:4}); setOpen(true); }}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                borderRadius: 2,
                px: 3
              }}
            >
              Add Course
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

      {/* Search & Stats */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 2 }}>
          <CardContent>
            <TextField 
              size="small" 
              label="Search Courses" 
              value={q} 
              onChange={e => setQ(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              placeholder="Search by course code or name..."
            />
          </CardContent>
        </Card>
        
        <Stack direction="row" spacing={2}>
          <Card sx={{ bgcolor: 'primary.50' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary" fontWeight="bold">{rows.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total Courses</Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: 'success.50' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main" fontWeight="bold">
                {rows.reduce((sum, r) => sum + (r.credit || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Credits</Typography>
            </CardContent>
          </Card>
        </Stack>
      </Stack>

      {/* Courses Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold">Courses List</Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <UniversityLoader message="Loading courses..." />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Course Code</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Course Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Credits</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r, i) => (
                    <TableRow key={r.courseId} hover>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Code color="action" fontSize="small" />
                          <Typography variant="body1" fontWeight="medium" fontFamily="monospace">
                            {r.courseCode}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{r.courseName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={<Star />}
                          label={`${r.credit} Credits`}
                          color={getCreditColor(r.credit)}
                          size="small"
                        />
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
                          onClick={() => { setForm(r); setOpen(true); }}
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
                          {q ? `No courses found matching "${q}"` : "No courses found. Click \"Add Course\" to create your first course."}
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
          <MenuBook />
          {form.courseId ? "Edit Course" : "Add New Course"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <TextField 
              label="Course Code" 
              value={form.courseCode} 
              onChange={e => setForm({...form, courseCode: e.target.value})}
              fullWidth
              placeholder="e.g., PHY101, MATH201"
              helperText="Enter a unique course identifier"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Code />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField 
              label="Course Name" 
              value={form.courseName} 
              onChange={e => setForm({...form, courseName: e.target.value})}
              fullWidth
              placeholder="e.g., Mechanics, Calculus I"
              helperText="Enter the full name of the course"
            />
            
            <TextField 
              type="number" 
              label="Credits" 
              value={form.credit} 
              onChange={e => setForm({...form, credit: e.target.value})}
              fullWidth
              inputProps={{ min: 1, max: 10 }}
              helperText="Number of credit hours for this course"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Star />
                  </InputAdornment>
                ),
              }}
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
                disabled={loading || !form.courseCode.trim() || !form.courseName.trim()}
                startIcon={loading ? <CircularProgress size={16} /> : null}
              >
                {loading ? "Saving..." : "Save Course"}
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
        title="Delete Course"
        message={`Are you sure you want to delete the course "${deleteDialog.name}"? This action cannot be undone.`}
        loading={loading}
      />
    </Box>
  );
}
