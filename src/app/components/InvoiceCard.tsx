import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import { Description, CalendarToday } from '@mui/icons-material';
import { Invoice } from '../types/invoice';
import { formatDate } from '../utils/dateUtils';
import { useNavigate } from 'react-router';

interface InvoiceCardProps {
  invoice: Invoice;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/invoice/${invoice.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        position: 'relative',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          borderColor: 'primary.light',
        },
        '&:active': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="220"
        image={invoice.imageUrl}
        alt={invoice.clientName}
        sx={{
          objectFit: 'cover',
          backgroundColor: 'grey.50',
          borderBottom: '1px solid #f1f5f9',
        }}
      />
      <CardContent sx={{ p: 2.5 }}>
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          sx={{
            fontSize: '1.1rem',
            fontWeight: 800,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'text.primary',
            mb: 1.5,
          }}
        >
          {invoice.clientName}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <CalendarToday sx={{ fontSize: 16, color: 'primary.main', opacity: 0.8 }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {formatDate(invoice.date)}
          </Typography>
        </Box>

        {invoice.notes && (
          <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            backgroundColor: 'grey.50',
            p: 1.5,
            borderRadius: 2,
            border: '1px solid #f1f5f9'
          }}>
            <Description sx={{ fontSize: 16, color: 'text.secondary', mt: 0.3 }} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.6,
                fontWeight: 500,
                textAlign: 'right',
              }}
            >
              {invoice.notes}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
