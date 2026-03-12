import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ProgramDialog = ({ open, handleClose, program, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        duration: ''
    });

    // Reset form when dialog opens with new data
    useEffect(() => {
        if (program) {
            setFormData({
                title: program.title || '',
                description: program.description || '',
                startTime: program.startTime || '',
                endTime: program.endTime || '',
                duration: program.duration || ''
            });
        } else {
            // Reset form for new program
            setFormData({
                title: '',
                description: '',
                startTime: '',
                endTime: '',
                duration: ''
            });
        }
    }, [program, open]);

    // Generate time slots in 30-minute intervals
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute of ['00', '30']) {
                const time = `${hour.toString().padStart(2, '0')}:${minute}`;
                slots.push(time);
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const calculateDuration = (start, end) => {
        if (!start || !end) return '';

        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);

        let durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
        if (durationMinutes < 0) {
            durationMinutes += 24 * 60; // Add 24 hours if end time is on next day
        }

        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;

        return `${hours}h ${minutes}m`;
    };

    const handleTimeChange = (type, value) => {
        setFormData(prev => {
            const newData = { ...prev, [type]: value };

            // Clear end time if start time is after it
            if (type === 'startTime' && prev.endTime && value >= prev.endTime) {
                newData.endTime = '';
            }

            return newData;
        });
    };

    const isTimeSlotDisabled = (slot, type) => {
        if (type === 'endTime' && formData.startTime) {
            return slot <= formData.startTime;
        }
        return false;
    };

    const handleSubmit = () => {
        const duration = calculateDuration(formData.startTime, formData.endTime);
        onSave({
            ...formData,
            duration 
        });
        handleClose();
    };

    const isSubmitDisabled = !formData.title || !formData.startTime || !formData.endTime;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    backgroundColor: '#1a1a1a',
                    color: '#fff',
                    minWidth: '500px'
                }
            }}
        >
            <DialogTitle>
                {program ? 'Edit Program' : 'Add New Program'}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: '#fff'
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    margin="normal"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                                borderColor: '#666',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#999',
                        },
                    }}
                />

                <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    margin="normal"
                    multiline
                    rows={4}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                                borderColor: '#666',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#999',
                        },
                    }}
                />

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    mt: 2,
                    '& .MuiFormControl-root': {
                        flex: 1
                    }
                }}>
                    <FormControl fullWidth>
                        <InputLabel sx={{ color: '#999' }}>Start Time</InputLabel>
                        <Select
                            value={formData.startTime}
                            label="Start Time"
                            onChange={(e) => handleTimeChange('startTime', e.target.value)}
                            sx={{
                                color: '#fff',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#666',
                                },
                            }}
                        >
                            {timeSlots.map((time) => (
                                <MenuItem
                                    key={time}
                                    value={time}
                                >
                                    {time}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel sx={{ color: '#999' }}>End Time</InputLabel>
                        <Select
                            value={formData.endTime}
                            label="End Time"
                            onChange={(e) => handleTimeChange('endTime', e.target.value)}
                            sx={{
                                color: '#fff',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#666',
                                },
                            }}
                        >
                            {timeSlots.map((time) => (
                                <MenuItem
                                    key={time}
                                    value={time}
                                    disabled={isTimeSlotDisabled(time, 'endTime')}
                                >
                                    {time}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {formData.startTime && formData.endTime && (
                    <Typography sx={{
                        mt: 2,
                        color: '#2992ff',
                        fontSize: '0.875rem'
                    }}>
                        Duration: {calculateDuration(formData.startTime, formData.endTime)}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, m: 2 }}>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleClose}
                >
                    Cancel
                </button>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={handleSubmit}
                    disabled={isSubmitDisabled}
                >
                    Save
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default ProgramDialog;
