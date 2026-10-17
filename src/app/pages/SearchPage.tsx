import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  AppBar,
  Toolbar,
  InputAdornment,
  Chip,
  Stack,
} from '@mui/material';
import { Search as SearchIcon, Clear } from '@mui/icons-material';
import { useInvoiceStore } from '../store/invoiceStore';
import { InvoiceCard } from '../components/InvoiceCard';
import { EmptyState } from '../components/EmptyState';
import { sortByDate } from '../utils/dateUtils';

export function SearchPage() {
  const invoices = useInvoiceStore((state) => state.invoices);
  const searchInvoices = useInvoiceStore((state) => state.searchInvoices);

  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const matches = query ? searchInvoices(query) : invoices;
  const results = sortByDate(
    dateFilter ? matches.filter((invoice) => invoice.date === dateFilter) : matches,
    'date',
    'desc',
  );

  const handleClearSearch = () => {
    setQuery('');
    setDateFilter(null);
  };

  // Get unique dates for filter chips
  const uniqueDates = Array.from(
    new Set(invoices.map((invoice) => invoice.date))
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

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
            بحث
          </Typography>
          {(query || dateFilter) && (
            <Chip
              label="مسح"
              size="small"
              onDelete={handleClearSearch}
              onClick={handleClearSearch}
              sx={{ fontWeight: 600 }}
            />
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="caption" color="text.secondary">
            البحث في الفواتير المحفوظة في هذا المتصفح.
          </Typography>

          <TextField
            placeholder="ابحث باسم العميل أو الملاحظات..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ ml: 1 }}>
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end" sx={{ mr: 1 }}>
                  <Clear
                    sx={{ cursor: 'pointer', color: 'text.secondary' }}
                    onClick={() => setQuery('')}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
                backgroundColor: 'grey.50',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
                '& input': {
                  paddingRight: '12px',
                  paddingLeft: '12px',
                },
              },
            }}
          />

          {uniqueDates.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 700 }}>
                تصفية حسب التاريخ:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {uniqueDates.map((date) => (
                  <Chip
                    key={date}
                    label={new Date(date).toLocaleDateString('ar-EG', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    onClick={() => setDateFilter(dateFilter === date ? null : date)}
                    color={dateFilter === date ? 'primary' : 'default'}
                    variant={dateFilter === date ? 'filled' : 'outlined'}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
              تم العثور على {results.length} {results.length === 1 ? 'نتيجة' : 'نتائج'}
            </Typography>

            {results.length === 0 ? (
              <EmptyState
                title="لم يتم العثور على نتائج"
                description="حاول تغيير كلمات البحث أو التصفية للعثور على ما تبحث عنه."
              />
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 3,
                }}
              >
                {results.map((invoice) => (
                  <InvoiceCard key={invoice.id} invoice={invoice} />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
