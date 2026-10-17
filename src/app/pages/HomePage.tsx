import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Fab,
  Button,
} from '@mui/material';
import { Add, FilterList } from '@mui/icons-material';
import { useInvoiceStore } from '../store/invoiceStore';
import { InvoiceCard } from '../components/InvoiceCard';
import { EmptyState } from '../components/EmptyState';
import { sortByDate } from '../utils/dateUtils';
import { useNavigate } from 'react-router';

export function HomePage() {
  const navigate = useNavigate();
  const invoices = useInvoiceStore((state) => state.invoices);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (order: 'asc' | 'desc') => {
    setSortOrder(order);
    handleMenuClose();
  };

  const sortedInvoices = sortByDate(invoices, 'date', sortOrder);

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
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 700 }}
          >
            فواتيري
          </Typography>
          <Chip
            label={`${invoices.length} ${invoices.length === 1 ? 'فاتورة' : 'فواتير'}`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mr: 1, fontWeight: 600 }}
          />
          <IconButton aria-label="ترتيب الفواتير" onClick={handleMenuOpen}>
            <FilterList />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleSortChange('desc')} sx={{ fontWeight: 500 }}>
          الأحدث أولاً
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('asc')} sx={{ fontWeight: 500 }}>
          الأقدم أولاً
        </MenuItem>
      </Menu>

      <Container sx={{ mt: 3, mb: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          الفواتير محفوظة في هذا المتصفح فقط. حذف بيانات المتصفح يمسحها.
        </Typography>
        {invoices.length === 0 ? (
          <Box sx={{ mt: 8 }}>
            <EmptyState
              title="لا توجد فواتير بعد"
              description="ابدأ بإضافة فاتورتك الأولى. التقط صورة أو قم برفعها للبدء بتنظيم فواتيرك."
              actionLabel="إضافة فاتورة"
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 3,
            }}
          >
            {sortedInvoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </Box>
        )}
      </Container>

      <Fab
        color="primary"
        aria-label="إضافة فاتورة جديدة"
        onClick={() => navigate('/add')}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
}
