import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Grid,
  useTheme,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { Task } from './types/Task';

const API_URL = 'http://localhost:8081/api/tasks';

type Severity = 'success' | 'error' | 'info' | 'warning';

function App() {
  const theme = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    title: '',
    description: '',
    completed: false,
  });
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: Severity }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showSnackbar('Error fetching tasks', 'error');
    }
  };

  const handleCreateTask = async () => {
    try {
      await axios.post(API_URL, newTask);
      setNewTask({ title: '', description: '', completed: false });
      fetchTasks();
      showSnackbar('Task created successfully!', 'success');
    } catch (error) {
      console.error('Error creating task:', error);
      showSnackbar('Error creating task', 'error');
    }
  };

  const handleUpdateTask = async (task: Task) => {
    try {
      await axios.put(`${API_URL}/${task.id}`, task);
      setEditTask(null);
      setOpenDialog(false);
      fetchTasks();
      showSnackbar('Task updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating task:', error);
      showSnackbar('Error updating task', 'error');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
      showSnackbar('Task deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting task:', error);
      showSnackbar('Error deleting task', 'error');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await axios.put(`${API_URL}/${task.id}`, updatedTask);
      fetchTasks();
      showSnackbar(
        updatedTask.completed ? 'Task marked as completed!' : 'Task marked as pending!',
        'success'
      );
    } catch (error) {
      console.error('Error toggling task completion:', error);
      showSnackbar('Error updating task status', 'error');
    }
  };

  const showSnackbar = (message: string, severity: Severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            mb: 4,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Task Manager
        </Typography>

        <Card elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
          <CardContent>
            <Box component="form" sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                variant="outlined"
                size="small"
              />
              <TextField
                fullWidth
                label="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                variant="outlined"
                size="small"
              />
              <Button
                variant="contained"
                onClick={handleCreateTask}
                disabled={!newTask.title}
                startIcon={<AddIcon />}
                sx={{ minWidth: '120px' }}
              >
                Add Task
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tasks.map((task) => (
              <Box key={task.id}>
                <Card 
                  elevation={2}
                  sx={{ 
                    borderRadius: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <ListItem
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2
                    }}
                  >
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                      color="primary"
                    />
                    <ListItemText
                      primary={
                        <Typography
                          variant="h6"
                          sx={{
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? 'text.secondary' : 'text.primary'
                          }}
                        >
                          {task.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {task.description}
                          </Typography>
                          <Chip
                            label={task.completed ? 'COMPLETED' : 'PENDING'}
                            color={task.completed ? 'success' : 'warning'}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => {
                          setEditTask(task);
                          setOpenDialog(true);
                        }}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => task.id && handleDeleteTask(task.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Task Title"
              value={editTask?.title || ''}
              onChange={(e) =>
                setEditTask(editTask ? { ...editTask, title: e.target.value } : null)
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={editTask?.description || ''}
              onChange={(e) =>
                setEditTask(editTask ? { ...editTask, description: e.target.value } : null)
              }
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              onClick={() => editTask && handleUpdateTask(editTask)}
              variant="contained"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default App;
