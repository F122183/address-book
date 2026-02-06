import { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { ColorModeContext } from '../ColorModeContext';
import api from '../api/axios';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, setUser, logout } = useAuth() as any;
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    const [editing, setEditing] = useState(false);
    const [usernameInput, setUsernameInput] = useState(user?.username || '');
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleEdit = () => {
        setEditing(true);
        setUsernameInput(user.username);
    };

    const handleCancel = () => {
        setEditing(false);
        setUsernameInput(user.username);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const { data } = await api.put('/auth/profile', { username: usernameInput });
            const updatedUser = { ...user, username: data.username };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setEditing(false);
        } catch (error: any) {
            console.error(error.response?.data?.message || 'Error updating username');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppBar position="static">
    <Toolbar sx={{ position: 'relative' }}>
        <Box display="flex" alignItems="center" gap={1.5}>
            <ImportContactsIcon />
            <Typography variant="h6" fontWeight="bold">
                Address Book
            </Typography>
        </Box>

        {user && (
            <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
                {editing ? (
                    <>
                        <TextField
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                                    sx={{
                                        input: { color: 'white' },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'lightgray',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'white'
                                            },
                                        },
                                    }}
                            size="small"
                        />
                        <Button color="inherit" onClick={handleSave} disabled={loading}>
                            Save
                        </Button>
                        <Button color="inherit" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography>{`Hey, ${user.username}`}</Typography>
                        <Button color="inherit" size='small' sx={{ml: 1}} onClick={handleEdit}>
                            Edit username
                        </Button>
                    </>
                )}
            </Box>
        )}

        <Box display="flex" alignItems="center" gap={1} sx={{ marginLeft: 'auto' }}>
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
