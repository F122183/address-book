import { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { ColorModeContext } from '../ColorModeContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    const handleLogout = () => {
        logout();    
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Box display="flex" alignItems="center" gap={1.5} sx={{ flexGrow: 1 }}>
                    <ImportContactsIcon />
                    <Typography variant="h6" fontWeight="bold">
                        Address Book
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                    <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>

                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;