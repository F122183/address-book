import { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, Button, TextField,
    Box, IconButton, List, ListItem, ListItemText,
    Select, InputLabel, FormControl, MenuItem, Typography, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CircleIcon from '@mui/icons-material/Circle';
import api from '../api/axios';

interface Tag {
    _id: string;
    name: string;
    color: string;
    parent?: { _id: string; name: string } | null;
}

interface TagManagerProps {
    open: boolean;
    onClose: () => void;
}

const TagManager = ({ open, onClose }: TagManagerProps) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [name, setName] = useState('');
    const [color, setColor] = useState('#1976d2');
    const [parentId, setParentId] = useState('');

    const fetchTags = async () => {
        try {
            const { data } = await api.get('/tags');
            setTags(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (open) fetchTags();
    }, [open]);

    const handleCreate = async () => {
        if (!name) return;
        try {
            await api.post('/tags', { name, color, parent: parentId || undefined });
            setName('');
            setParentId('');
            fetchTags();
        } catch (err) {
            alert('Error creating tag');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this tag?')) return;
        try {
            await api.delete(`/tags/${id}`);
            fetchTags();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Manage Tags</DialogTitle>
            <DialogContent dividers>

                <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                    <Grid container spacing={2} alignItems="center">

                        <Grid size={{ xs: 5 }}>
                            <TextField
                                label="Name"
                                size="small"
                                fullWidth
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 2 }}>
                            <TextField
                                type="color"
                                size="small"
                                fullWidth
                                value={color}
                                onChange={e => setColor(e.target.value)}
                                sx={{ '& input': { height: 40, p: 0.5 } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 5 }}>
                            <FormControl size="small" fullWidth>
                                <InputLabel>Parent</InputLabel>
                                <Select
                                    value={parentId}
                                    label="Parent"
                                    onChange={e => setParentId(e.target.value)}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {tags.map(t => <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleCreate}
                                disabled={!name}
                            >
                                Add Tag
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                <List>
                    {tags.length === 0 ? <Typography variant="body2">No tags yet.</Typography> : null}

                    {tags.map((tag) => (
                        <ListItem
                            key={tag._id}
                            sx={{ borderBottom: '1px solid #eee' }}
                            secondaryAction={
                                <IconButton edge="end" onClick={() => handleDelete(tag._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <Box display="flex" alignItems="center" gap={2}>
                                <CircleIcon sx={{ color: tag.color, fontSize: 16 }} />
                                <ListItemText
                                    primary={tag.name}
                                    secondary={tag.parent ? `Parent: ${tag.parent.name}` : null}
                                />
                            </Box>
                        </ListItem>
                    ))}
                </List>

            </DialogContent>
            <Box p={2} display="flex" justifyContent="flex-end">
                <Button onClick={onClose}>Done</Button>
            </Box>
        </Dialog>
    );
};

export default TagManager;