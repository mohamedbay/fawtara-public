import { Outlet } from 'react-router';
import { BottomNav } from './BottomNav';
import { Box } from '@mui/material';

export function Layout() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Outlet />
      <BottomNav />
    </Box>
  );
}
