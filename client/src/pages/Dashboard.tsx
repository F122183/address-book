import { useEffect, useState } from 'react';
import {
    Container, Typography, CircularProgress, Grid, Paper, Fab, Box, Button, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import ContactDetails from '../components/ContactDetails';
import api from '../api/axios';

interface Contact {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    mobile?: string;
    fax?: string;
    firm?: string;
    address?: string;
    comment?: string;
}

const Dashboard = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    const [openForm, setOpenForm] = useState(false);

    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

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
                    <Typography variant="h4">My Contacts</Typography>
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
                                    <Paper
                                        sx={{
                                            p: 2,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="h6">
                                                {contact.firstName} {contact.lastName}
                                            </Typography>
                                            <Typography color="textSecondary" variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                                {contact.firm}
                                            </Typography>
                                            <Divider sx={{ my: 1 }} />
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                {contact.email}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {contact.phone}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => setSelectedContact(contact)}
                                            >
                                                View Details
                                            </Button>
                                        </Box>
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
                    onClick={() => setOpenForm(true)}
                >
                    <AddIcon />
                </Fab>

                <ContactForm
                    open={openForm}
                    onClose={() => setOpenForm(false)}
                    onSave={fetchContacts}
                />

                <ContactDetails
                    open={!!selectedContact}
                    onClose={() => setSelectedContact(null)}
                    contact={selectedContact}
                />

            </Container>
        </>
    );
};

export default Dashboard;