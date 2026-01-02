import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Grid, Divider, Box, Chip
} from '@mui/material';

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

interface ContactDetailsProps {
    open: boolean;
    onClose: () => void;
    contact: Contact | null;
}

const ContactDetails = ({ open, onClose, contact }: ContactDetailsProps) => {
    if (!contact) return null;

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
                                <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                        {contact.comment}
                                    </Typography>
                                </Box>
                            </Grid>
                        </>
                    )}

                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ContactDetails;