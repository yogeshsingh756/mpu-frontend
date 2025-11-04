import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Avatar } from '@mui/material'
import { Warning } from '@mui/icons-material'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, loading = false }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <img 
            src='/mpu-logo-final.png' 
            alt='University Logo' 
            style={{ width: 48, height: 48 }}
          />
          <Typography variant="h6" fontWeight="bold" color="error">
            {title || "Confirm Delete"}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', py: 2 }}>
        <Avatar sx={{ bgcolor: 'error.light', mx: 'auto', mb: 2, width: 56, height: 56 }}>
          <Warning sx={{ fontSize: 32, color: 'error.main' }} />
        </Avatar>
        <Typography variant="body1" color="text.secondary">
          {message || "Are you sure you want to delete this item? This action cannot be undone."}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error"
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}