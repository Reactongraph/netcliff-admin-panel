import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ProgramDialog from "../Dialog/LiveTvProgramsDialog";

const DeleteConfirmDialog = ({ open, handleClose, handleConfirm }) => (
  <Dialog
    open={open}
    onClose={handleClose}
    PaperProps={{
      sx: {
        backgroundColor: "#1a1a1a",
        color: "#fff",
      },
    }}
  >
    <DialogTitle>Delete Program</DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to delete this program?</Typography>
    </DialogContent>
    <DialogActions>
      <button className="btn btn-secondary btn-sm" onClick={handleClose}>
        Cancel
      </button>
      <button className="btn btn-danger btn-sm" onClick={handleConfirm}>
        Delete
      </button>
    </DialogActions>
  </Dialog>
);

const Programs = ({ programs, setPrograms, error }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(programs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPrograms(items);
  };

  const handleAddProgram = async (programData) => {
    try {
      setIsLoading(true);
      setPrograms([...programs, { ...programData, _id: Date.now() }]);
    } catch (err) {
      console.error("Error adding program:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProgram = (programData) => {
    setPrograms(
      programs.map((p) =>
        p._id === selectedProgram._id ? { ...p, ...programData } : p
      )
    );
  };

  const handleDeleteProgram = (_id) => {
    setPrograms(programs.filter((p) => p._id !== _id));
  };

  const getTotalDuration = () => {
    let totalMinutes = 0;
    programs.forEach((program) => {
      const [startHour, startMinute] = program.startTime.split(":").map(Number);
      const [endHour, endMinute] = program.endTime.split(":").map(Number);

      let durationMinutes =
        endHour * 60 + endMinute - (startHour * 60 + startMinute);
      if (durationMinutes < 0) {
        durationMinutes += 24 * 60;
      }
      totalMinutes += durationMinutes;
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "#fff" }}>
          Programs Schedule
          <Typography
            component="span"
            sx={{
              ml: 1,
              color: "#999",
              fontSize: "0.875rem",
            }}
          >
            ({programs.length} programs)
          </Typography>
        </Typography>
        <IconButton
          onClick={() => {
            setSelectedProgram(null);
            setDialogOpen(true);
          }}
          disabled={isLoading}
          sx={{
            backgroundColor: "#2992ff",
            "&:hover": { backgroundColor: "#1976d2" },
            "&.Mui-disabled": {
              backgroundColor: "#1e1e1e",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            <AddIcon sx={{ color: "#fff" }} />
          )}
        </IconButton>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="programs">
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                borderRadius: 1,
                overflow: "hidden",
                minHeight: 40,
              }}
            >
              {programs.map((program, index) => (
                <Draggable
                  key={program?._id}
                  draggableId={program?._id.toString()}
                  index={index}
                  className="program-list"
                >
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="program-list"
                      sx={{
                        borderBottom: "1px solid #404040",
                        "&:last-child": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      <IconButton {...provided.dragHandleProps}>
                        <DragIndicatorIcon sx={{ color: "#666" }} />
                      </IconButton>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: "#fff" }}>
                            {program.title}
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ color: "#999" }}>
                            {program.startTime} - {program.endTime} (
                            {program.duration})
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => {
                            setSelectedProgram(program);
                            setDialogOpen(true);
                          }}
                        >
                          <EditIcon sx={{ color: "#fff" }} />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setProgramToDelete(program._id);
                            setDeleteConfirmOpen(true);
                          }}
                        >
                          <DeleteIcon sx={{ color: "#ff4444" }} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>

      <Typography sx={{ color: "#999", mt: 2, fontSize: "0.875rem" }}>
        Total Duration: {getTotalDuration()} minutes
      </Typography>

      {error && (
        <Typography
          sx={{
            color: "#ff4444",
            mt: 1,
            fontSize: "0.875rem",
          }}
        >
          {error}
        </Typography>
      )}

      <ProgramDialog
        open={dialogOpen}
        handleClose={() => {
          setDialogOpen(false);
          setSelectedProgram(null);
        }}
        program={selectedProgram}
        onSave={selectedProgram ? handleEditProgram : handleAddProgram}
      />

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        handleClose={() => {
          setDeleteConfirmOpen(false);
          setProgramToDelete(null);
        }}
        handleConfirm={() => {
          handleDeleteProgram(programToDelete);
          setDeleteConfirmOpen(false);
          setProgramToDelete(null);
        }}
      />
    </Box>
  );
};

export default Programs;
