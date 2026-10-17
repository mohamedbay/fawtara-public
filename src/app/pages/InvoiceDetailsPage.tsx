import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from '@mui/material';
import { ArrowBack, Edit, Delete, Save, Close, CalendarToday } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { useInvoiceStore } from '../store/invoiceStore';
import { formatDate } from '../utils/dateUtils';
import { toast } from 'sonner';

export function InvoiceDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const getInvoiceById = useInvoiceStore((state) => state.getInvoiceById);
  const updateInvoice = useInvoiceStore((state) => state.updateInvoice);
  const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);

  const invoice = id ? getInvoiceById(id) : null;

  const [editing, setEditing] = useState(false);
  const [clientName, setClientName] = useState(invoice?.clientName || '');
  const [notes, setNotes] = useState(invoice?.notes || '');
  const [date, setDate] = useState(invoice?.date || '');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!invoice) {
    return (
      <Box sx={{ pb: 10 }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Toolbar>
            <IconButton edge="start" onClick={() => navigate(-1)}>
              <ArrowBack sx={{ transform: 'scaleX(-1)' }} />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 700 }}
            >
              الفاتورة غير موجودة
            </Typography>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 3 }}>
          <Typography sx={{ fontWeight: 500 }}>الفاتورة غير موجودة</Typography>
        </Container>
      </Box>
    );
  }

  const handleSave = () => {
    if (!clientName.trim()) {
      toast.error('لا يمكن أن يكون اسم العميل فارغاً');
      return;
    }

    updateInvoice(invoice.id, {
      clientName: clientName.trim(),
      notes: notes.trim(),
      date,
    });

    setEditing(false);
    toast.success('تم تحديث الفاتورة بنجاح!');
  };

  const handleCancel = () => {
    setClientName(invoice.clientName);
    setNotes(invoice.notes);
    setDate(invoice.date);
    setEditing(false);
  };

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    toast.success('تم حذف الفاتورة بنجاح!');
    navigate('/');
  };

  return (
    <Box sx={{ pb: 10 }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate(-1)}>
            <ArrowBack sx={{ transform: 'scaleX(-1)' }} />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 700 }}
          >
            تفاصيل الفاتورة
          </Typography>
          {!editing && (
            <>
              <IconButton aria-label="تعديل الفاتورة" onClick={() => setEditing(true)}>
                <Edit />
              </IconButton>
              <IconButton aria-label="حذف الفاتورة" onClick={() => setDeleteDialogOpen(true)} color="error">
                <Delete />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
            }}
          >
            <Box
              component="img"
              src={invoice.imageUrl}
              alt={invoice.clientName}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 500,
                objectFit: 'contain',
                backgroundColor: 'grey.50',
              }}
            />
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            {editing ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="اسم العميل"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '& input': { paddingRight: '12px', paddingLeft: '12px' },
                    },
                  }}
                />

                <TextField
                  label="التاريخ"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '& input': { paddingRight: '12px', paddingLeft: '12px' },
                    },
                  }}
                />

                <TextField
                  label="ملاحظات"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      padding: '12px 16px',
                    },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save sx={{ ml: 1, mr: -1 }} />}
                    onClick={handleSave}
                    fullWidth
                    sx={{
                      borderRadius: 3,
                      py: 1.5,
                      fontWeight: 700,
                      '& .MuiButton-startIcon': { marginLeft: '8px', marginRight: '-4px' }
                    }}
                  >
                    حفظ
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Close sx={{ ml: 1, mr: -1 }} />}
                    onClick={handleCancel}
                    fullWidth
                    sx={{
                      borderRadius: 3,
                      py: 1.5,
                      fontWeight: 700,
                      '& .MuiButton-startIcon': { marginLeft: '8px', marginRight: '-4px' }
                    }}
                  >
                    إلغاء
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" color="text.primary" sx={{ fontWeight: 800 }}>
                    {invoice.clientName}
                  </Typography>
                  <Chip
                    icon={<CalendarToday sx={{ fontSize: '1rem !important' }} />}
                    label={formatDate(invoice.date)}
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 1.5, fontWeight: 600, px: 0.5 }}
                  />
                </Box>

                {invoice.notes && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700 }}>
                      ملاحظات
                    </Typography>
                    <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                      {invoice.notes}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Box>
      </Container>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 4, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>حذف الفاتورة</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 500 }}>
            هل أنت متأكد أنك تريد حذف هذه الفاتورة؟ لا يمكن التراجع عن هذا الإجراء.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontWeight: 700 }}>إلغاء</Button>
          <Button onClick={handleDelete} color="error" variant="contained" sx={{ borderRadius: 2, fontWeight: 700 }}>
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
