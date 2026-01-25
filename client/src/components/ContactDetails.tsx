import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Grid, Divider, Box
} from '@mui/material';

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
    customFields?: Record<string, string>;
}

interface ContactDetailsProps {
    open: boolean;
    onClose: () => void;
    contact: Contact | null;
}


const ContactDetails = ({ open, onClose, contact }: ContactDetailsProps) => {
    if (!contact) return null;

const handleExportContact = async () => {
    if (!contact) return;

    try {
        const response = await api.get(
            `/contacts/${contact._id}/export`,
            { responseType: 'blob' }
        );

        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${contact.firstName}_${contact.lastName}.csv`;
        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Contact export failed', error);
    }
};

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Typography variant="h5" component="div">
                    {contact.firstName} {contact.lastName}
                </Typography>
                {contact.firm && (
                    <Typography variant="subtitle1" color="text.secondary">
                        {contact.firm}
                    </Typography>
                )}
            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={2}>

                    <Grid size={{ xs: 12 }}>
                        <Typography variant="overline" color="text.secondary">Contact Information</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" fontWeight="bold">Email</Typography>
                        <Typography variant="body1">{contact.email || '-'}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" fontWeight="bold">Phone</Typography>
                        <Typography variant="body1">{contact.phone || '-'}</Typography>
                    </Grid>

                    {(contact.mobile || contact.fax) && (
                        <>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="body2" fontWeight="bold">Mobile</Typography>
                                <Typography variant="body1">{contact.mobile || '-'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="body2" fontWeight="bold">Fax</Typography>
                                <Typography variant="body1">{contact.fax || '-'}</Typography>
                            </Grid>
                        </>
                    )}

                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography variant="overline" color="text.secondary">Address</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                            {contact.address || 'No address provided'}
                        </Typography>
                    </Grid>

                    {contact.comment && (
                        <>
                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="overline" color="text.secondary">Private Notes</Typography>
                                <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
                                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                        {contact.comment}
                                    </Typography>
                                </Box>
                            </Grid>
                        </>
                    )}

                    {contact.customFields && Object.keys(contact.customFields).length > 0 && (
                        <>
                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="overline" color="text.secondary">Additional Info</Typography>
                            </Grid>

                            {Object.entries(contact.customFields).map(([key, value]) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={key}>
                                    <Typography variant="body2" fontWeight="bold">{key}</Typography>
                                    <Typography variant="body1">{value}</Typography>
                                </Grid>
                            ))}
                        </>
                    )}

                </Grid>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={handleExportContact}
                    color="secondary"
                >
                    Export contact (CSV)
                </Button>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ContactDetails;