import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography
} from "@mui/material";
import moment from 'moment';

// Default event structure
const defaultEvent = {
  title: '',
  start: null,
  end: null,
  allDay: false,
  recurring: false,
  recurrence: {
    frequency: 'DAILY',
    interval: 1,
    count: 1
  }
};

const CreateEventModal = ({
  isOpen = false,
  onClose = () => { },
  newEvent = defaultEvent,
  onEventChange = () => { },
  onCreateEvent = () => { },
  isEditing = false
}) => {

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

  const getTimeFromDate = (date) => {
    if (!date) return '';
    return moment(date).format('HH:mm');
  };

  const handleTimeChange = (type, timeValue) => {
    const field = type === 'startTime' ? 'start' : 'end';

    // Create moment object from the existing Date object
    let currentMoment;
    if (!newEvent[field]) {
      currentMoment = moment(); // Create new moment with current date
    } else {
      currentMoment = moment(newEvent[field]); // Use existing date
    }
    // Update only the time portion while keeping the date
    const [hours, minutes] = timeValue.split(':').map(Number);
    const newDateTime = currentMoment
      .hours(hours)
      .minutes(minutes)
      .seconds(0)
      .milliseconds(0);

    if (type === 'startTime') {
      // If start time is after or equal to end time, set end time to 30 minutes after start
      if (newDateTime.isSameOrAfter(moment(newEvent.end))) {
        onEventChange({
          ...newEvent,
          start: newDateTime.toDate(), // Convert to Date object for react-big-calendar
          end: newDateTime.clone().add(30, 'minutes').toDate()
        });
        return;
      }
    }

    onEventChange({
      ...newEvent,
      [field]: newDateTime.toDate() // Convert to Date object for react-big-calendar
    });
  };

  const handleRecurrenceChange = (field, value) => {
    onEventChange({
      ...newEvent,
      recurrence: {
        ...(newEvent?.recurrence || {}),
        [field]: value,
      },
    });
  };

  const isTimeSlotDisabled = (slot, type) => {
    //Disabled for all day
    if (newEvent?.allDay) return true;

    if (type === 'endTime' && newEvent?.start) {
      const startTime = getTimeFromDate(newEvent.start);
      return slot <= startTime;
    }
    return false;
  };

  const handleAllDayChange = (checked) => {
    const currentDate = moment(newEvent.start);
    onEventChange({
      ...newEvent,
      allDay: checked,
      // If switching to all day, set fixed times
      ...(checked && {
        start: currentDate.startOf('day').toDate(),
        end: currentDate.endOf('day').toDate()
      }),
      // If switching from all day, reset times
      // ...(!checked && {
      //   start: null,
      //   end: null
      // })
    });
  };

  const isSubmitDisabled = !(newEvent?.title && ((newEvent?.start && newEvent?.end) || newEvent?.allDay));

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#ffffff',
          color: '#333333'
        }
      }}
    >
      <DialogTitle>{isEditing ? 'Edit Program' : "Create New Program"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Title"
            value={newEvent?.title || ''}
            onChange={(e) => onEventChange({ ...newEvent, title: e.target.value })}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#333333',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#666666',
              },
            }}
          />

          <TextField
            label="Description"
            value={newEvent?.description || ''}
            onChange={(e) => onEventChange({ ...newEvent, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#333333',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#666666',
              },
            }}
          />

          <Box sx={{
            display: 'flex',
            gap: 2,
            '& .MuiFormControl-root': {
              flex: 1
            }
          }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#666666' }}>Start Time</InputLabel>
              <Select
                value={getTimeFromDate(newEvent?.start) || ''}
                label="Start Time"
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
                disabled={newEvent?.allDay}
                sx={{
                  color: '#333333',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                }}
              >
                {timeSlots.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={{ color: '#666666' }}>End Time</InputLabel>
              <Select
                value={getTimeFromDate(newEvent?.end) || ''}
                label="End Time"
                onChange={(e) => handleTimeChange('endTime', e.target.value)}
                disabled={newEvent?.allDay}
                sx={{
                  color: '#333333',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
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

          <FormControlLabel
            control={
              <Switch
                checked={newEvent?.allDay || false}
                onChange={(e) => handleAllDayChange(e.target.checked)}
              />
            }
            label="All Day Event"
            sx={{ color: '#333333' }}
          />

          {
            !isEditing ?
              <>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newEvent?.recurring || false}
                      onChange={(e) => onEventChange({ ...newEvent, recurring: e.target.checked })}
                    />
                  }
                  label="Recurring Event"
                  sx={{ color: '#333333' }}
                />

                {newEvent?.recurring && (
                  <>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: '#666666' }}>Frequency</InputLabel>
                      <Select
                        value={newEvent?.recurrence?.frequency || 'DAILY'}
                        onChange={(e) => handleRecurrenceChange('frequency', e.target.value)}
                        sx={{
                          color: '#333333',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0',
                          },
                        }}
                      >
                        <MenuItem value="DAILY">Daily</MenuItem>
                        <MenuItem value="WEEKLY">Weekly</MenuItem>
                        <MenuItem value="MONTHLY">Monthly</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      type="number"
                      label="Interval"
                      value={newEvent?.recurrence?.interval || 1}
                      onChange={(e) => handleRecurrenceChange('interval', parseInt(e.target.value))}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#333333',
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666666',
                        },
                      }}
                    />

                    <TextField
                      type="number"
                      label="Occurrences"
                      value={newEvent?.recurrence?.count || 1}
                      onChange={(e) => handleRecurrenceChange('count', parseInt(e.target.value))}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#333333',
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666666',
                        },
                      }}
                    />
                  </>
                )}
              </>
              : <></>
          }

        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, m: 2 }}>
        <Button
          onClick={onClose}
          className="btn btn-secondary btn-sm"
        >
          Cancel
        </Button>
        <Button
          onClick={onCreateEvent}
          disabled={isSubmitDisabled}
          className="btn btn-primary btn-sm"
        >{isEditing ? 'Update' : 'Create'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(CreateEventModal);
