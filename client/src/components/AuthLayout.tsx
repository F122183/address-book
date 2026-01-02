import { type ReactNode } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
}

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f5f5f5'
            }}
        >
            <Container maxWidth="xs">
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5" align="center" gutterBottom>
                            {title}
                        </Typography>

                        {children}

                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default AuthLayout;