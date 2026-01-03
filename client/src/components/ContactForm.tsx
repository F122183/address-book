import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Grid, Alert, FormControl, InputLabel,
    Select, MenuItem, OutlinedInput, Box, Chip, type SelectChangeEvent,
    IconButton, Typography, Divider
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import api from '../api/axios';

interface Tag {
    _id: string;
    name: string;
    color: string;
}

interface CustomFieldRow {
    label: string;
    value: string;
}

interface ContactData {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    mobile: string;
    fax: string;
    firm: string;
    address: string;
    comment: string;
    tags: string[] | any[];
    customFields?: Record<string, string>;
}

interface ContactFormProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    initialData?: ContactData | null;
}

const ContactForm = ({ open, onClose, onSave, initialData }: ContactFormProps) => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        mobile: '', fax: '', firm: '', address: '', comment: '',
        tags: [] as string[]
    });

    const [customFields, setCustomFields] = useState<CustomFieldRow[]>([]);

    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            api.get('/tags').then(res => setAvailableTags(res.data)).catch(console.error);
        }
    }, [open]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.firstName || '',
                lastName: initialData.lastName || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                mobile: initialData.mobile || '',
                fax: initialData.fax || '',
                firm: initialData.firm || '',
                address: initialData.address || '',
                comment: initialData.comment || '',
                tags: initialData.tags.map((t: any) => (typeof t === 'object' ? t._id : t)) || []
            });

            if (initialData.customFields) {
                const fieldsArray = Object.entries(initialData.customFields).map(([key, value]) => ({
                    label: key,
                    value: String(value)
                }));
                setCustomFields(fieldsArray);
            } else {
                setCustomFields([]);
            }
        } else {
            setFormData({
                firstName: '', lastName: '', email: '', phone: '',
                mobile: '', fax: '', firm: '', address: '', comment: '', tags: []
            });
            setCustomFields([]);
        }
    }, [initialData, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTagChange = (event: SelectChangeEvent<string[]>) => {
        const { value } = event.target;
        setFormData({
            ...formData,
            tags: typeof value === 'string' ? value.split(',') : value,
        });
    };

    const addCustomField = () => {
        setCustomFields([...customFields, { label: '', value: '' }]);
    };

    const removeCustomField = (index: number) => {
        const newFields = [...customFields];
        newFields.splice(index, 1);
        setCustomFields(newFields);
    };

    const handleCustomFieldChange = (index: number, field: 'label' | 'value', text: string) => {
        const newFields = [...customFields];
        newFields[index][field] = text;
        setCustomFields(newFields);
    };

    const handleSubmit = async () => {
        try {
            const customFieldsMap: Record<string, string> = {};
            customFields.forEach(field => {
                if (field.label.trim()) {
                    customFieldsMap[field.label] = field.value;
                }
            });

            const payload = {
                ...formData,
                customFields: customFieldsMap
            };

            if (initialData && initialData._id) {
                await api.put(`/contacts/${initialData._id}`, payload);
            } else {
                await api.post('/contacts', payload);
            }
            onSave();
            handleClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save contact');
        }
    };

    const handleClose = () => {
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>{initialData?._id ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
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
                        <FormControl fullWidth>
                            <InputLabel>Tags</InputLabel>
                            <Select
                                multiple
                                value={formData.tags}
                                onChange={handleTagChange}
                                input={<OutlinedInput label="Tags" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => {
                                            const tag = availableTags.find(t => t._id === value);
                                            if (!tag) return null;
                                            return <Chip key={value} label={tag.name} size="small" sx={{ bgcolor: tag.color, color: '#fff' }} />;
                                        })}
                                    </Box>
                                )}
                            >
                                {availableTags.map((tag) => (
                                    <MenuItem key={tag._id} value={tag._id}>
                                        <CircleIcon sx={{ color: tag.color, mr: 2, fontSize: 16 }} />
                                        {tag.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField name="address" label="Address" fullWidth multiline rows={2} value={formData.address} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField name="comment" label="Private Comments" fullWidth multiline rows={2} value={formData.comment} onChange={handleChange} />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="subtitle1">Custom Fields</Typography>
                            <Button
                                startIcon={<AddCircleOutlineIcon />}
                                size="small"
                                onClick={addCustomField}
                            >
                                Add Field
                            </Button>
                        </Box>

                        {customFields.map((field, index) => (
                            <Grid container spacing={2} key={index} sx={{ mb: 2 }} alignItems="center">
                                <Grid size={{ xs: 5 }}>
                                    <TextField
                                        label="Label"
                                        placeholder="e.g. Birthday"
                                        size="small"
                                        fullWidth
                                        value={field.label}
                                        onChange={(e) => handleCustomFieldChange(index, 'label', e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        label="Value"
                                        placeholder="e.g. Jan 25"
                                        size="small"
                                        fullWidth
                                        value={field.value}
                                        onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{ xs: 1 }}>
                                    <IconButton color="error" onClick={() => removeCustomField(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {initialData?._id ? 'Update Contact' : 'Save Contact'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ContactForm;