import { Box, Typography, Button } from '@mui/material';
import { Receipt } from '@mui/icons-material';
import { useNavigate } from 'react-router';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      navigate('/add');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 96,
          height: 96,
          borderRadius: '32px',
          backgroundColor: 'primary.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
          boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.15)',
        }}
      >
        <Receipt sx={{ fontSize: 48, color: 'primary.main' }} />
      </Box>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>
        {title}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 350, lineHeight: 1.6, fontWeight: 500 }}>
        {description}
      </Typography>

      {actionLabel && (
        <Button
          variant="contained"
          onClick={handleAction}
          sx={{ borderRadius: 3, px: 5, py: 1.5, fontWeight: 700, fontSize: '1rem' }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
