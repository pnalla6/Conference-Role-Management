import React, { useState, useEffect } from 'react';
// import { Type, List, Calendar, AlertOctagon, AlertTriangle, X } from 'react-feather';
import AddTaskModal from '../../tasks/taskModal/AddTaskModal';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import Container from '@mui/material/Container';

const theme = createTheme();

function NewCardModal(props) {
    const [isFlexibleCheckBox, setIsFlexible] = useState(false);
    const [hardDeadlineDate, setHardDeadline] = useState(null);
    const [softDeadlineDate, setSoftdDeadline] = useState(null);
    const [taskDependencyIds, setTaskDependencyIds] = useState('');
    const [allTasksList, setAllTasksList] = useState([]);
    const { getAllTasks } = props;
    console.log(props);

    useEffect(() => {
        async function fetchData() {
            const data = await getAllTasks();
            const filteredTasks = data.filter((task) => {
                return task.role_id !== props.role_id;
            });
            setAllTasksList(filteredTasks);
        }
        fetchData();
    }, []);



    const handleSaveClick = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const taskType = data.get('task_type');
        const taskDescription = data.get('task_description');
        const taskNotes = data.get('task_notes');
        const taskDependency = taskDependencyIds;
        const isFlexible = isFlexibleCheckBox;
        const hardDeadline = hardDeadlineDate;
        const softDeadline = softDeadlineDate;
        const taskCreatedDdate = new Date().toISOString();

        const taskObj = {
            taskType,
            taskDescription,
            taskNotes,
            isFlexible,
            hardDeadline,
            softDeadline,
            taskDependency,
            taskCreatedDdate
        }

        console.log(taskObj);
        props.addNewTaskToRole(props.role_id, taskObj).then(() => {
            props.onClose();
        });
    };

    return (
        <AddTaskModal onClose={() => { props.onClose() }}>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography component="h1" variant="h6">
                            Add New Task
                        </Typography>
                        <Box component="form" onSubmit={handleSaveClick} noValidate sx={{ mt: 0, display: 'grid' }}>
                            <TextField
                                size='small'
                                margin="normal"
                                required
                                id="task_type"
                                label="Task Type"
                                name="task_type"
                                autoFocus
                                autoComplete="off"
                                multiline
                            // fullWidth
                            />
                            <TextField
                                size='small'
                                margin="normal"
                                required
                                name="task_description"
                                label="Task Description"
                                type="task_description"
                                id="task_description"
                                autoComplete="off"
                                multiline
                            // fullWidth
                            />
                            <TextField
                                size='small'
                                margin="normal"
                                required
                                name="task_notes"
                                label="Task Notes"
                                type="task_notes"
                                id="task_notes"
                                autoComplete="off"
                                multiline
                            // fullWidth
                            />
                            <FormControlLabel
                                sx={{ display: 'block' }}
                                value='is_flexible'
                                control={<Checkbox size='small' onChange={() => { setIsFlexible(!isFlexibleCheckBox) }} color="primary" />}
                                label="Is Flexible"
                            />
                            <FormControlLabel
                                control={<TextField size='small' sx={{ ml: 1.5, mr: 1, mb: 1 }} onChange={(e) => { setSoftdDeadline(e.currentTarget.value) }} id='soft_deadline' type='date' color="primary" />}
                                label="Soft Deadline"
                            />
                            <FormControlLabel
                                control={<TextField size='small' sx={{ ml: 1.5, mr: 1 }} onChange={(e) => { setHardDeadline(e.currentTarget.value) }} id='hard_deadline' type='date' color="primary" />}
                                label="Hard Deadline"
                            />

                            <FormControl size='small'>
                                <InputLabel size='small' id="task_dependency_inputlabel">Task Dependency</InputLabel>
                                <Select
                                    size='small'
                                    labelId="task_dependency_select_label"
                                    id="task_dependency"
                                    multiple
                                    value={taskDependencyIds || []}
                                    onChange={(e) => {
                                        setTaskDependencyIds(e.target.value);
                                    }}
                                    label="Task Dependency"
                                >
                                    {allTasksList.map(task => (
                                        <MenuItem key={task.task_id} value={task.task_id}>{task.task_type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>


                            <Button
                                type="submit"
                                // fullWidth
                                variant="outlined"
                                color="secondary"
                                sx={{ display: 'block', margin: 'auto', mt: 3, mb: 2 }}
                            >
                                Add Task
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </AddTaskModal>
    )
}

export default NewCardModal