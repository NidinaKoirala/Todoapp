import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { Box, Modal, Typography, Button, TextField, Stack, Grid } from '@mui/material';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Function to split the title into lines with a maximum of 3 words per line
const splitTitleIntoLines = (title, wordsPerLine = 3) => {
  const words = title.split(' ');
  const lines = [];

  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(' '));
  }

  return lines.join('\n'); // Return with newline characters for pre-wrap behavior
};

const TodoCalendar = ({ todos, onTaskAdded, onTaskUpdated, onTaskDeleted }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [moreTasksOpen, setMoreTasksOpen] = useState(false);
  const [extraTasks, setExtraTasks] = useState([]);
  const [editText, setEditText] = useState('');
  const [editDate, setEditDate] = useState(new Date());
  const [editTime, setEditTime] = useState(new Date());
  const [isNewTask, setIsNewTask] = useState(false);
  const [defaultView, setDefaultView] = useState(() => {
    return localStorage.getItem('calendarView') || Views.MONTH;
  });

  const scrollToTime = new Date();

  useEffect(() => {
    localStorage.setItem('calendarView', defaultView);
  }, [defaultView]);

  const handleOpenModal = (event) => {
    if (!event.isMoreButton) {
      const normalizedEvent = {
        ...event,
        text: event.title || event.text || '',
        date: event.start || event.date || new Date(),
      };

      setIsNewTask(false);
      setSelectedEvent(normalizedEvent);
      setEditText(normalizedEvent.text);
      setEditDate(new Date(normalizedEvent.date));
      setEditTime(new Date(normalizedEvent.date));
      setModalOpen(true);
    }
  };

  const handleSelectSlot = (slotInfo) => {
    setIsNewTask(true);
    setEditDate(slotInfo.start);
    setEditTime(slotInfo.start);
    setEditText('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const handleCloseMoreTasksModal = () => {
    setMoreTasksOpen(false);
  };

  const handleSaveEdit = () => {
    const taskDateTime = new Date(editDate);
    taskDateTime.setHours(editTime.getHours());
    taskDateTime.setMinutes(editTime.getMinutes());

    const status = taskDateTime > new Date() ? 'Pending' : 'Overdue';

    if (!isNewTask && selectedEvent && !isNaN(taskDateTime.getTime())) {
      const updatedTask = {
        ...selectedEvent,
        text: editText,
        date: taskDateTime.toISOString(),
      };
      onTaskUpdated(selectedEvent.index, updatedTask);
      setModalOpen(false);
    } else if (isNewTask) {
      const newTask = {
        text: editText,
        date: taskDateTime.toISOString(),
        status,
      };
      onTaskAdded(newTask);
      setModalOpen(false);
    }
  };

  const events = todos.map((todo, index) => ({
    title: todo.text,
    start: new Date(todo.date),
    end: new Date(todo.date),
    status: todo.status,
    time: format(new Date(todo.date), 'hh:mm a'),
    index,
  }));

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad'; 
    if (event.status === 'Done') backgroundColor = '#d1e7dd'; 
    if (event.status === 'Overdue') backgroundColor = '#f8d7da'; 
    if (event.status === 'Pending') backgroundColor = '#fff3cd'; 

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        padding: '2px',
        fontSize: '0.65rem',
        color: 'black',
        whiteSpace: 'pre-wrap', // Ensures the newlines are respected
        textAlign: 'left',
        wordWrap: 'break-word',
      },
    };
  };

  const renderEventForDay = (events, date) => {
    const dayEvents = events.filter(event => format(new Date(event.start), 'yyyy-MM-dd') === format(new Date(date), 'yyyy-MM-dd'));
    const firstTwoEvents = dayEvents.slice(0, 2);
    const remainingCount = dayEvents.length - 2;

    return (
      <>
        {firstTwoEvents.map((event, idx) => (
          <div key={idx} style={{ marginBottom: '5px' }}>
            <strong>{event.time}</strong> {'\n'}{splitTitleIntoLines(event.title)}
          </div>
        ))}
        {remainingCount > 0 && (
          <div style={{ textAlign: 'center' }}>
            <Button
              variant="text"
              sx={{ padding: 0, minWidth: 'auto', textTransform: 'none', fontSize: '0.65rem' }}
              onClick={(e) => {
                e.stopPropagation();
                setExtraTasks(dayEvents.slice(2));
                setMoreTasksOpen(true);
              }}
            >
              +{remainingCount} more
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: '0 8px',
          }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{
              flexGrow: 1,
              width: '100%',
              height: '100%',
              minHeight: 'calc(100vh - 64px)',
            }}
            selectable
            eventPropGetter={eventStyleGetter}
            components={{
              event: ({ event }) => renderEventForDay(events, event.start),
            }}
            views={{ month: true, week: true, day: true }}
            defaultView={defaultView}
            onView={(view) => setDefaultView(view)}
            scrollToTime={scrollToTime}
            defaultDate={new Date()}
            popup
            onSelectEvent={(event) => handleOpenModal(event)}
            onSelectSlot={handleSelectSlot}
            showMultiDayTimes={true}
          />
        </Box>

        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="task-details-title"
          aria-describedby="task-details-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: 400,
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              maxHeight: '80vh',
              overflowY: 'auto',
              backgroundColor: 'white',
            }}
          >
            <Typography
              id="task-details-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold', textAlign: 'center' }}
            >
              {isNewTask ? 'Add New Task' : 'Edit Task Details'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Task Name"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Task Date"
                    value={editDate}
                    onChange={(newValue) => setEditDate(newValue)}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TimePicker
                    label="Task Time"
                    value={editTime}
                    onChange={(newValue) => setEditTime(newValue)}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </Grid>
              </Grid>
              <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveEdit}
                >
                  {isNewTask ? 'Add Task' : 'Save Changes'}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={moreTasksOpen}
          onClose={handleCloseMoreTasksModal}
          aria-labelledby="more-tasks-title"
          aria-describedby="more-tasks-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: 400,
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              maxHeight: '80vh',
              overflowY: 'auto',
              backgroundColor: 'white',
            }}
          >
            <Typography
              id="more-tasks-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold', textAlign: 'center' }}
            >
              More Tasks
            </Typography>
            <Box sx={{ mt: 2 }}>
              {extraTasks.map((task, idx) => (
                <Typography key={idx} variant="body1" gutterBottom>
                  <strong>{task.time}</strong> {'\n'}{splitTitleIntoLines(task.title)}
                </Typography>
              ))}
            </Box>
            <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleCloseMoreTasksModal}>
                Close
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
};

export default TodoCalendar;
