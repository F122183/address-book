import { useEffect, useState } from 'react';
import {
    Container, Typography, CircularProgress, Grid, Paper, Fab, Box, Button, Divider, Chip, IconButton,
    TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import ContactDetails from '../components/ContactDetails';
import TagManager from '../components/TagManager';
import api from '../api/axios';

interface Tag {
    _id: string;
    name: string;
    color: string;
}

interface Contact {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    mobile: string;
    fax: string;
    firm: string;
    address: string;
    comment: string;
    tags: Tag[];
    customFields?: Record<string, string>;
}

const Dashboard = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);

    const [openForm, setOpenForm] = useState(false);
    const [openTags, setOpenTags] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [editData, setEditData] = useState<Contact | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterTagId, setFilterTagId] = useState('');

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

    const fetchTags = async () => {
        try {
            const { data } = await api.get('/tags');
            setAvailableTags(data);
        } catch (err) {
            console.error('Failed to load tags');
        }
    };

    useEffect(() => {
        fetchContacts();
        fetchTags();
    }, []);

    const filteredContacts = contacts.filter((contact) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
            contact.firstName.toLowerCase().includes(query) ||
            contact.lastName.toLowerCase().includes(query) ||
            (contact.email && contact.email.toLowerCase().includes(query)) ||
            (contact.firm && contact.firm.toLowerCase().includes(query));

        const matchesTag = filterTagId
            ? contact.tags.some(tag => tag._id === filterTagId)
            : true;

        return matchesSearch && matchesTag;
    });


    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this contact?')) return;
        try {
            await api.delete(`/contacts/${id}`);
            fetchContacts();
        } catch (err) {
            alert('Failed to delete contact');
        }
    };

    const handleEdit = (contact: Contact) => {
        setEditData(contact);
        setOpenForm(true);
    };

    const handleFormClose = () => {
        setOpenForm(false);
        setEditData(null);
    };

    return (
        <>
            <Navbar />
            <Container sx={{ mt: 4, pb: 10 }}>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4">My Contacts</Typography>
                    <Button variant="outlined" onClick={() => setOpenTags(true)}>
                        Manage Tags
                    </Button>
                </Box>

                <Paper sx={{ p: 2, mb: 4, bgcolor: 'background.default' }} elevation={0} variant="outlined">
                    <Grid container spacing={2} alignItems="center">

                        <Grid size={{ xs: 12, md: 8 }}>
                            <TextField
                                fullWidth
                                placeholder="Search by name, email, or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ bgcolor: 'background.paper' }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl fullWidth size="small" sx={{ bgcolor: 'background.paper' }}>
                                <InputLabel>Filter by Tag</InputLabel>
                                <Select
                                    value={filterTagId}
                                    label="Filter by Tag"
                                    onChange={(e) => setFilterTagId(e.target.value)}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <FilterListIcon fontSize="small" />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="">
                                        <em>Show All</em>
                                    </MenuItem>
                                    {availableTags.map((tag) => (
                                        <MenuItem key={tag._id} value={tag._id}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Box
                                                    sx={{
                                                        width: 10, height: 10, borderRadius: '50%',
                                                        bgcolor: tag.color
                                                    }}
                                                />
                                                {tag.name}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {loading ? (
                    <CircularProgress />
                ) : (
                    <Grid container spacing={3}>
                        {filteredContacts.length === 0 ? (
                            <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
                                <Typography color="textSecondary">
                                    {contacts.length === 0
                                        ? "No contacts yet. Click + to add one!"
                                        : "No contacts match your search."}
                                </Typography>
                            </Box>
                        ) : (
                            filteredContacts.map((contact) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={contact._id}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            position: 'relative',
                                            transition: '0.3s',
                                            '&:hover': { boxShadow: 4 }
                                        }}
                                    >
                                        <Box>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    {contact.firstName} {contact.lastName}
                                                </Typography>

                                                <Box>
                                                    <IconButton size="small" onClick={() => handleEdit(contact)} color="primary">
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => handleDelete(contact._id)} color="error">
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>

                                            <Typography color="textSecondary" variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                                {contact.firm}
                                            </Typography>

                                            {contact.tags && contact.tags.length > 0 && (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                                                    {contact.tags.map((tag) => (
                                                        <Chip
                                                            key={tag._id}
                                                            label={tag.name}
                                                            size="small"
                                                            sx={{ bgcolor: tag.color, color: '#fff', height: 20, fontSize: '0.7rem' }}
                                                        />
                                                    ))}
                                                </Box>
                                            )}

                                            <Divider sx={{ my: 1 }} />
                                            <Typography variant="body2" sx={{ mt: 1 }}>{contact.email}</Typography>
                                            <Typography variant="body2" color="textSecondary">{contact.phone}</Typography>
                                        </Box>

                                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button size="small" onClick={() => setSelectedContact(contact)}>
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
                    onClick={() => {
                        setEditData(null);
                        setOpenForm(true);
                    }}
                >
                    <AddIcon />
                </Fab>

                <ContactForm
                    open={openForm}
                    onClose={handleFormClose}
                    onSave={() => { fetchContacts(); fetchTags(); }}
                    initialData={editData}
                />

                <ContactDetails
                    open={!!selectedContact}
                    onClose={() => setSelectedContact(null)}
                    contact={selectedContact}
                />

                <TagManager
                    open={openTags}
                    onClose={() => { setOpenTags(false); fetchTags(); }}
                />

            </Container>
        </>
    );
};

export default Dashboard;