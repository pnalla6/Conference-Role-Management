import React, { useState, useEffect } from 'react';
// import { Type, List, Calendar, AlertOctagon, AlertTriangle, X } from 'react-feather';
import AddTaskModal from '../../tasks/taskModal/AddTaskModal';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SnackBar from '../../utils/SnackBar';

const theme = createTheme();

function EditCardModal(props) {
    const [formValues, setFormValues] = useState({
        taskType: props?.cardData?.task_type || '',
        taskDescription: props?.cardData?.task_description || '',
        taskNotes: props?.cardData?.task_notes || '',
        isTaskFlexible: props?.cardData?.is_flexible || false,
        existinghardDeadline: props?.cardData?.deadlines?.hard || null,
        existingsoftDeadline: props?.cardData?.deadlines?.soft || null,
        taskDependency: props?.cardData?.task_dependency || [],
    });
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [allTasksList, setAllTasksList] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const data = await props.getAllTasks();
            const filteredTasks = data.filter((task) => {
                return task.role_id !== props?.cardData?.roleId;
            });
            setAllTasksList(filteredTasks);
        }
        fetchData();
    }, []);

    const handleOpenSnackBar = () => {
        setOpenSnackBar(true);
    };


    const handleSaveClick = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const taskType = data.get('task_type');
        const taskDescription = data.get('task_description');
        const taskNotes = data.get('task_notes');
        const isFlexible = formValues.isTaskFlexible;
        const hardDeadline = formValues.existinghardDeadline;
        const softDeadline = formValues.existingsoftDeadline;
        const taskCreatedDdate = props?.cardData?.task_created_date;
        const taskDependency = formValues.taskDependency;

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

        // console.log(props);
        props.editTaskInRole(props?.cardData?.roleId, props?.cardData?.task_id, taskObj).then(() => {
            props.onClose();
        });
        handleOpenSnackBar();
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
                            Edit Task
                        </Typography>
                        <Box component="form" onSubmit={handleSaveClick} noValidate sx={{ mt: 0, display: 'grid' }}>
                            <TextField
                                value={formValues.taskType}
                                size='small'
                                margin="normal"
                                required
                                id="task_type"
                                label="Task Type"
                                name="task_type"
                                autoFocus
                                autoComplete="off"
                                multiline
                                onChange={(e) => {
                                    setFormValues({
                                        ...formValues,
                                        taskType: e.target.value
                                    });
                                }}
                            // fullWidth
                            />
                            <TextField
                                value={formValues.taskDescription}
                                size='small'
                                margin="normal"
                                required
                                name="task_description"
                                label="Task Description"
                                type="task_description"
                                id="task_description"
                                autoComplete="off"
                                multiline
                                onChange={(e) => {
                                    setFormValues({
                                        ...formValues,
                                        taskDescription: e.target.value
                                    });
                                }}
                            // fullWidth
                            />
                            <TextField
                                value={formValues.taskNotes}
                                size='small'
                                margin="normal"
                                required
                                name="task_notes"
                                label="Task Notes"
                                type="task_notes"
                                id="task_notes"
                                autoComplete="off"
                                multiline
                                onChange={(e) => {
                                    setFormValues({
                                        ...formValues,
                                        taskNotes: e.target.value
                                    });
                                }}
                            // fullWidth
                            />
                            <FormControlLabel
                                sx={{ display: 'block' }}
                                value='is_flexible'
                                control={<Checkbox checked={formValues.isTaskFlexible} size='small' onChange={(e) => {
                                    setFormValues({
                                        ...formValues,
                                        isTaskFlexible: e.target.checked
                                    });
                                }}
                                    color="primary" />}
                                label="Is Flexible"
                            />
                            <FormControlLabel
                                control={<TextField value={formValues.existingsoftDeadline}
                                    size='small'
                                    sx={{ ml: 1.5, mr: 1, mb: 1 }}
                                    onChange={(e) => {
                                        setFormValues({
                                            ...formValues,
                                            existingsoftDeadline: e.target.value
                                        });
                                    }} id='soft_deadline' type='date' color="primary" />}
                                label="Soft Deadline"
                            />
                            <FormControlLabel
                                control={<TextField value={formValues.existinghardDeadline} size='small' sx={{ ml: 1.5, mr: 1 }}
                                    onChange={(e) => {
                                        setFormValues({
                                            ...formValues,
                                            existinghardDeadline: e.target.value
                                        });
                                    }}
                                    id='hard_deadline' type='date' color="primary" />}
                                label="Hard Deadline"
                            />
                            <FormControl size='small'>
                                <InputLabel size='small' id="task_dependency_inputlabel">Task Dependencies</InputLabel>
                                <Select
                                    size='small'
                                    labelId="task_dependency_select_label"
                                    id="task_dependency"
                                    multiple
                                    value={formValues.taskDependency}
                                    onChange={(e) => {
                                        setFormValues({
                                            ...formValues,
                                            taskDependency: e.target.value
                                        });
                                    }}
                                    label="Task Dependencies"
                                >
                                    <MenuItem value={''}>Select task dependencies</MenuItem>
                                    {allTasksList.map(task => (
                                        <MenuItem
                                            key={task.task_id}
                                            value={task.task_id}
                                        >
                                            {task.task_type}
                                        </MenuItem>
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
                                Update Task
                            </Button>
                        </Box>
                    </Box>
                    <SnackBar
                        text='Task Update Success!'
                        open={openSnackBar}
                        autoHideDuration={6000}
                    />
                </Container>
            </ThemeProvider>
        </AddTaskModal>
    )
}

export default EditCardModal