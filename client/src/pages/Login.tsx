import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, TextField, Button, Alert } from '@mui/material';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login({ email, password });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <AuthLayout title="Sign In">
            {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email Address"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign In
                </Button>

                <Box textAlign="center">
                    <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Box>
            </Box>
        </AuthLayout>
    );
};

export default Login;