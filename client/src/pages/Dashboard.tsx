import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Grid, Paper, Fab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import api from '../api/axios';

interface Contact {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    firm?: string;
}

const Dashboard = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    const fetchContacts = async () => {
        try {
            const { data } = await api.get('/contacts');
            setContacts(data);
        } catch (err) {
            console.error('Failed to load contacts', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <>
            <Navbar />
            <Container sx={{ mt: 4, pb: 10 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4">
                        My Contacts
                    </Typography>
                </Box>

                {loading ? (
                    <CircularProgress />
                ) : (
                    <Grid container spacing={3}>
                        {contacts.length === 0 ? (
                            <Typography sx={{ mt: 2, ml: 3 }}>No contacts yet. Click + to add one!</Typography>
                        ) : (
                            contacts.map((contact) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={contact._id}>
                                    <Paper sx={{ p: 2, height: '100%' }}>
                                        <Typography variant="h6">
                                            {contact.firstName} {contact.lastName}
                                        </Typography>
                                        <Typography color="textSecondary" sx={{ mb: 1 }}>{contact.firm}</Typography>
                                        <Typography variant="body2">{contact.email}</Typography>
                                        <Typography variant="body2">{contact.phone}</Typography>
                                    </Paper>
                                </Grid>
                            ))
                        )}
                    </Grid>
                )}

                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{ position: 'fixed', bottom: 32, right: 32 }}
                    onClick={() => setOpenDialog(true)}
                >
                    <AddIcon />
                </Fab>

                <ContactForm
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    onSave={fetchContacts}
                />

            </Container>
        </>
    );
};

export default Dashboard;