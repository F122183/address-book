import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Grid, Alert
} from '@mui/material';
import api from '../api/axios';

interface ContactFormProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
}

const ContactForm = ({ open, onClose, onSave }: ContactFormProps) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        mobile: '',
        fax: '',
        firm: '',
        address: '',
        comment: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await api.post('/contacts', formData);
            onSave();
            handleClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save contact');
        }
    };

    const handleClose = () => {
        setError('');
        setFormData({
            firstName: '', lastName: '', email: '', phone: '',
            mobile: '', fax: '', firm: '', address: '', comment: ''
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
                <Grid container spacing={2} sx={{ mt: 0.5 }}>

                    <Grid size={{ xs: 6 }}>
                        <TextField name="firstName" label="First Name" fullWidth required value={formData.firstName} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField name="lastName" label="Last Name" fullWidth required value={formData.lastName} onChange={handleChange} />
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <TextField name="firm" label="Company / Firm" fullWidth value={formData.firm} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField name="email" label="Email" fullWidth value={formData.email} onChange={handleChange} />
                    </Grid>

                    <Grid size={{ xs: 4 }}>
                        <TextField name="phone" label="Phone" fullWidth value={formData.phone} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                        <TextField name="mobile" label="Mobile" fullWidth value={formData.mobile} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                        <TextField name="fax" label="Fax" fullWidth value={formData.fax} onChange={handleChange} />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField name="address" label="Address" fullWidth multiline rows={2} value={formData.address} onChange={handleChange} />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField name="comment" label="Private Comments" fullWidth multiline rows={2} value={formData.comment} onChange={handleChange} />
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">Save Contact</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ContactForm;