import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, TextField, Button, Alert } from '@mui/material';
import AuthLayout from '../components/AuthLayout';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await register({ username, email, password });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <AuthLayout title="Sign Up">
            {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email Address"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign Up
                </Button>

                <Box textAlign="center">
                    <Link to="/login" style={{ textDecoration: 'none', color: '#9c27b0' }}>
                        {"Already have an account? Sign In"}
                    </Link>
                </Box>
            </Box>
        </AuthLayout>
    );
};

export default Register;