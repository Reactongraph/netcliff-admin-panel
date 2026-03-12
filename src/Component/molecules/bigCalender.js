import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { RRule } from "rrule";
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
  Typography,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Today as TodayIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  CalendarMonth as CalendarMonthIcon,
  ViewWeek as ViewWeekIcon,
  ViewDay as ViewDayIcon,
  ViewAgenda as ViewAgendaIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import LiveTvProgramScheduleAddDialog from "../Dialog/LiveTvProgramScheduleAddDialog";
import { connect } from "react-redux";
import {
  createLiveTvProgram,
  deleteProgram,
  updateLiveTvProgram,
} from "../../store/LiveTv/liveTv.action";
import { formatProgramDates } from "../../util/helperFunctions";
import { Toast } from "../../util/Toast_";

const localizer = momentLocalizer(moment);

function ProgramSchedule(props) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");

  const existingUpdateData = JSON.parse(
    localStorage.getItem("updateChannelData")
  );

  // States for events and modals
  const [eventsList, setEventsList] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start: null,
    end: null,
    allDay: false,
    recurring: false,
    recurrence: {
      frequency: "WEEKLY",
      interval: 1,
      count: 1,
    },
  });

  useEffect(() => {
    if (
      mode === "update" &&
      Array.isArray(existingUpdateData?.programs) &&
      existingUpdateData?.programs.length
    ) {
      const formatted = formatProgramDates(existingUpdateData?.programs);
      setEventsList(formatted);
    }
  }, []);

  // Check for event overlap
  const checkOverlap = (newEventFor) => {
    const {
      start: newStart,
      end: newEnd,
      allDay,
      _id: currentEventId,
    } = newEventFor ?? {};
    const start = moment(newStart);
    const end = moment(newEnd);
    const isAllDay = allDay;

    return eventsList.some((event) => {
      if (currentEventId && event._id === currentEventId) {
        return false;
      }

      // If either event is an all-day event
      if (event.allDay || isAllDay) {
        const newDate = moment(newStart).startOf("day");
        const eventDate = moment(event.start).startOf("day");
        return newDate.isSame(eventDate);
      }

      // For time-specific events, check time overlap
      const eventStart = moment(event.start);
      const eventEnd = moment(event.end);

      return (
        (start.isSameOrAfter(eventStart) && start.isBefore(eventEnd)) ||
        (end.isAfter(eventStart) && end.isSameOrBefore(eventEnd)) ||
        (start.isSameOrBefore(eventStart) && end.isSameOrAfter(eventEnd))
      );
    });
  };

  // Generate recurring events
  const generateRecurringEvents = useCallback((event, recurrenceRule) => {
    const rule = new RRule({
      ...recurrenceRule,
      dtstart: new Date(event.start),
    });

    const dates = rule.all();
    return dates.map((date) => ({
      ...event,
      start: new Date(date),
      end: new Date(
        moment(date).add(moment(event.end).diff(event.start), "milliseconds")
      ),
      recurring: true,
      recurrenceRule,
      _id: Date.now() + Math.random(),
    }));
  }, []);

  // Handle event selection
  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  }, []);

  // Handle slot selection
  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      console.log("new Event", start, end, typeof start);
      setNewEvent({
        ...newEvent,
        start,
        end,
      });
      setIsCreateModalOpen(true);
    },
    [newEvent]
  );

  // Create new event
  const handleCreateEvent = async () => {
    if (!newEvent.title) {
      alert("Please enter an event title");
      return;
    }

    // if editing, means only editing single one
    if (newEvent.recurring && isEditModalOpen === false) {
      const recurringEvents = generateRecurringEvents(newEvent, {
        freq: RRule[newEvent.recurrence.frequency],
        interval: newEvent.recurrence.interval,
        count: newEvent.recurrence.count,
      });

      console.log("recurring", recurringEvents);
      // Check each recurring instance for overlap
      for (const eventInstance of recurringEvents) {
        const overlap = checkOverlap(eventInstance);

        if (overlap) {
          alert(
            `Overlap detected for event on ${moment(eventInstance.start).format(
              "MMMM Do YYYY, h:mm a"
            )}. Please choose different times or recurrence pattern.`
          );
          return;
        }
      }

      const programsToCreate = recurringEvents.map((val) => {
        return { ...val, streamId: existingUpdateData?._id };
      });
      const result = await props.createLiveTvProgram({
        programs: programsToCreate,
      });
      const { status, programs } = result || {};
      if (status) {
        const formatted = formatProgramDates(programs);
        setEventsList((prev) => [...prev, ...formatted]);
      }
    } else {
      //For non-recurring events, check overlap
      const overlap = checkOverlap(newEvent);
      if (overlap) {
        alert("This time slot overlaps with an existing event");
        return;
      }

      if (isEditModalOpen === true) {
        const result = await props.updateLiveTvProgram(newEvent?._id, newEvent);
        const { status, program } = result || {};
        if (status) {
          const formatted = formatProgramDates([program]);
          setEventsList((prevEvents) =>
            prevEvents.map((event) =>
              event._id === newEvent?._id ? formatted[0] : event
            )
          );
        }
      } else {
        const result = await props.createLiveTvProgram({
          programs: [{ ...newEvent, streamId: existingUpdateData?._id }],
        });
        const { status, programs } = result || {};
        if (status) {
          const formatted = formatProgramDates(programs);
          setEventsList((prev) => [...prev, ...formatted]);
        }
      }
    }

    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setNewEvent({
      title: "",
      start: null,
      end: null,
      allDay: false,
      recurring: false,
      recurrence: {
        frequency: "WEEKLY",
        interval: 1,
        count: 1,
      },
    });
  };

  // Update existing event
  const handleUpdateEvent = () => {
    if (
      checkOverlap(selectedEvent.start, selectedEvent.end, selectedEvent._id)
    ) {
      alert("This time slot overlaps with an existing event");
      return;
    }

    setEventsList((prev) =>
      prev.map((event) =>
        event._id === selectedEvent._id ? selectedEvent : event
      )
    );
    setIsEditModalOpen(false);
  };

  // Delete event
  const handleDeleteEvent = async () => {
    try {
      const res = await deleteProgram(selectedEvent?._id);
      if (res?.data?.status) {
        setEventsList((prev) =>
          prev.filter((event) => event._id !== selectedEvent._id)
        );
        setIsViewModalOpen(false);
        Toast("success", res.data.message);
      } else {
        Toast("error", res?.data?.message);
      }
    } catch (ex) {
      Toast("error", ex?.response?.data?.message);
    }
  };

  const handleNavigate = (date, view, action) => {
    const now = new Date();
    if (date < now) {
      return;
    }
    // Your navigation logic here if needed
  };

  const ViewEventModal = () => (
    <Dialog
      open={isViewModalOpen}
      onClose={() => setIsViewModalOpen(false)}
      maxWidth="sm"
      // fullWidth
    >
      <DialogTitle className="custom_modal_title">
        <h5>Program information</h5>

        <IconButton
          aria-label="close"
          className="modal_close_icon"
          onClick={() => setIsViewModalOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            "&:hover": {
              color: (theme) => theme.palette.grey[700],
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="modal_body channel_info">
        <Box
          className="channel_list"
          sx={{ display: "flex", alignItems: "center", mb: 3 }}
        >
          {selectedEvent?.title && (
            <Box
              sx={{
                display: "flex",
                padding: "8px 12px",
              }}
            >
              <EventIcon sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
                {selectedEvent?.title}
              </Typography>
            </Box>
          )}

          {/* Description Section */}
          {selectedEvent?.description && (
            <Box
              sx={{
                display: "flex",
                padding: "8px 12px",
                alignItems: "center",
              }}
            >
              <DescriptionIcon sx={{ mr: 2, color: "primary.main", mt: 0.5 }} />
              <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
                {selectedEvent?.description}
              </Typography>
            </Box>
          )}

          {/* Time Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "8px 12px",
                flex: 1,
              }}
            >
              {/* <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Time
              </Typography> */}
              <AccessTimeIcon sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="body1">
                {selectedEvent?.allDay ? (
                  "All Day"
                ) : (
                  <>
                    {moment(selectedEvent?.start).format(
                      "MMMM Do YYYY, h:mm a"
                    )}
                    {" - "}
                    {moment(selectedEvent?.end).format("h:mm a")}
                  </>
                )}
              </Typography>
              {/* <Typography variant="caption" color="textSecondary">
                Duration: {calculateDuration(selectedEvent?.start, selectedEvent?.end)}
              </Typography> */}
            </Box>
          </Box>

          {/* Recurring Event Info */}
          {/* {selectedEvent?.recurring && (
            <Box sx={{
              padding: '8px 12px'
            }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Recurring Schedule
              </Typography>
              <Typography variant="body1">
                Repeats: {selectedEvent?.recurrence?.frequency?.toLowerCase() || 'daily'}
                {selectedEvent?.recurrence?.interval > 1 &&
                  ` every ${selectedEvent?.recurrence?.interval} days`}
                {selectedEvent?.recurrence?.count > 1 &&
                  `, ${selectedEvent?.recurrence?.count} times`}
              </Typography>
            </Box>
          )} */}
        </Box>
      </DialogContent>
      <DialogActions className="modal_footer">
        <Button
          onClick={() => {
            setIsViewModalOpen(false);
            setIsEditModalOpen(true);
            setNewEvent(selectedEvent);
          }}
          variant="outlined"
          color="primary"
          className="defualt_btn"
          // startIcon={<EditIcon />}
        >
          Edit
        </Button>
        <Button
          onClick={handleDeleteEvent}
          variant="contained"
          className="defualt_btn whte_btn"
          color="error"
          // startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <div
        style={{ minHeight: 320, backgroundColor: "white" }}
        className="program_schedule"
      >
        <Calendar
          localizer={localizer}
          events={eventsList}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.WEEK}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          scrollToTime={new Date(1970, 1, 1, 6)}
          views={["week", "day", "agenda"]}
          onNavigate={handleNavigate}
        />
      </div>

      <LiveTvProgramScheduleAddDialog
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
        }}
        newEvent={newEvent}
        onEventChange={setNewEvent}
        onCreateEvent={handleCreateEvent}
        isEditing={isEditModalOpen}
      />

      {isViewModalOpen && selectedEvent && <ViewEventModal />}
    </>
  );
}

const mapStateToProps = (state) => ({
  // Add any required state mappings
});

const mapDispatchToProps = {
  createLiveTvProgram,
  updateLiveTvProgram,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProgramSchedule);
