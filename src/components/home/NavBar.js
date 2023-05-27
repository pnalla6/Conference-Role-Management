import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from '../user/AuthProvider';
import { Settings } from 'react-feather';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mui/material';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Home', 'Dashboard', 'Export', 'Logout'];

function NavBar(props) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { currentUser, logOutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(currentUser);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSetting = async (key) => {
    // logout user if logged in
    if (key === 'Logout' && currentUser) {
      try {
        await logOutUser();
      } catch (error) {
        console.error(error);
      }
    }

    // navigate to login if logged out
    if (key === 'Logout' && !currentUser) {
      try {
        navigate('/login');
      } catch (error) {
        console.error(error);
      }
    }

    // export conference data as .json
    if (key === 'Export') {
      try {
        props.handleSaveToPC();
      } catch (error) {
        console.error(error);
      }
    }

    // navigate to dashboard
    if (key === 'Dashboard') {
      try {
        navigate('/dashboard');
      } catch (error) {
        console.error(error);
      }
    }
    // navigate to home
    if (key === 'Home') {
      try {
        navigate('/home');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const showLoginLogoutButton = location.pathname === '/home';

  return (
    <AppBar position="static" sx={{ backgroundColor: '#0a0a0a', boxShadow: 'none' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {props?.conferenceName || 'CRM APP'}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))} */}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {showLoginLogoutButton && (
              <Button
                variant="outlined"
                onClick={() => handleSetting('Logout')}
                sx={{ color: '#fff', borderColor: '#fff' }}
              >
                {currentUser ? 'Logout' : 'Login'}
              </Button>
            )}
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ backgroundColor: 'darkslateblue' }} alt="Settings">
                  <Settings />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => {
                    handleCloseUserMenu();
                    handleSetting(setting);
                  }}
                >
                  <Typography
                    textAlign="center"
                    onClick={() => {
                      handleSetting(setting);
                    }}
                  >
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
