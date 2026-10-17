import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useInvoiceStore } from '../store/invoiceStore';
import { ImageCapture } from '../components/ImageCapture';
import { getCurrentDate } from '../utils/dateUtils';
import { toast } from 'sonner';

export function AddInvoicePage() {
  const navigate = useNavigate();
  const addInvoice = useInvoiceStore((state) => state.addInvoice);

  const [imageUrl, setImageUrl] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>(getCurrentDate());
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!imageUrl || !clientName.trim() || !date) {
      toast.error('أضف صورة الفاتورة واسم العميل والتاريخ');
      return;
    }
    setSaving(true);
    try {
      addInvoice({ imageUrl, clientName: clientName.trim(), notes: notes.trim(), date });
      toast.success('تم حفظ الفاتورة في هذا المتصفح');
      navigate('/');
    } catch {
      toast.error('تعذر الحفظ. تحقق من مساحة التخزين المتاحة في المتصفح.');
    } finally {
      setSaving(false);
    }
  };

  const canSave = Boolean(imageUrl && clientName.trim() && date);

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
            إضافة فاتورة
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <ImageCapture onImageCapture={setImageUrl} currentImage={imageUrl} />

          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
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
                placeholder="أضف أي تفاصيل إضافية أو تعليقات أو وصف..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    padding: '12px 16px',
                  },
                }}
              />

              <Button
                variant="contained"
                size="large"
                startIcon={<Save sx={{ ml: 1, mr: -1 }} />}
                onClick={handleSave}
                disabled={!canSave || saving}
                fullWidth
                sx={{
                  borderRadius: 3,
                  py: 1.8,
                  mt: 1,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  '& .MuiButton-startIcon': {
                    marginLeft: '12px',
                    marginRight: '-4px',
                  },
                }}
              >
                {saving ? 'جاري الحفظ...' : 'حفظ الفاتورة'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
