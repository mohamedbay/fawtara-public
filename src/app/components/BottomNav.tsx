import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, Add, Search } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveRoute = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname === '/add') return 1;
    if (location.pathname === '/search') return 2;
    return 0;
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/add');
        break;
      case 2:
        navigate('/search');
        break;
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: '24px 24px 0 0',
        overflow: 'hidden',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      }}
      elevation={0}
    >
      <BottomNavigation
        showLabels
        value={getActiveRoute()}
        onChange={handleChange}
        sx={{
          height: 80,
          backgroundColor: 'background.paper',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '12px 0 16px',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.9rem',
            marginTop: '8px',
            fontWeight: 700,
          },
          '& .Mui-selected': {
            color: 'primary.main',
          },
        }}
      >
        <BottomNavigationAction
          label="الفواتير"
          icon={<Home />}
        />
        <BottomNavigationAction
          label="إضافة"
          icon={<Add />}
        />
        <BottomNavigationAction
          label="البحث"
          icon={<Search />}
        />
      </BottomNavigation>
    </Paper>
  );
}
