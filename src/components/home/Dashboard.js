import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ControlPoint } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../user/AuthProvider';
import { ref, onValue, push, set } from 'firebase/database';
import { crmdatabase } from '../../Firebase';

const Item = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    color: theme.palette.mode === 'dark' ? '#fff' : '#1A2027',
    padding: theme.spacing(2),
    textAlign: 'center',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
}));

const CenteredDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        maxWidth: 400,
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
    },
}));

function CreateNewConferenceBoard(props) {
    const [conferenceName, setConferenceName] = useState('');
    const [conferenceDeadline, setConferenceDeadline] = useState('true');
    const [isConferenceNameValid, setIsConferenceNameValid] = useState(true);
    const [isConferenceDeadlineValid, setIsConferenceDeadlineValid] = useState(true);
    const { currentUser } = useAuth();

    const handleConferenceNameChange = (event) => {
        setConferenceName(event.target.value);
    };
    const handleConferenceDeadline = (event) => {
        setConferenceDeadline(event.target.value);
    };

    const handleCreate = () => {
        if (conferenceName.trim() === '') {
            setIsConferenceNameValid(false);
            setConferenceDeadline(false)
            setTimeout(() => { setIsConferenceNameValid(true); setIsConferenceDeadlineValid(true) }, 1000);
            return;
        }
        if (!conferenceDeadline) {
            setIsConferenceDeadlineValid(false)
            setTimeout(() => { setIsConferenceDeadlineValid(true) }, 1000);
            return;
        }
        const db = crmdatabase;
        const conferencesRef = ref(db, `conferences/${currentUser.uid}/conferences`);
        const newConferenceRef = push(conferencesRef);
        set(newConferenceRef, {
            conference_id: newConferenceRef.key,
            conference_name: conferenceName,
            conference_created: new Date().toLocaleDateString('en-US'),
            conference_deadline: conferenceDeadline,
        });
        props.onClose();
    };

    return (
        <CenteredDialog open={props.open} onClose={props.onClose}>
            <DialogTitle>New Conference Board</DialogTitle>
            <DialogContent>
                <TextField
                    error={!isConferenceNameValid ? true : false}
                    sx={{ mt: 1 }}
                    size="small"
                    label="Conference Name"
                    variant="outlined"
                    value={conferenceName}
                    onChange={handleConferenceNameChange}
                    autoComplete='off'
                    required={true}
                    fullWidth
                    autoFocus
                    helperText={!isConferenceNameValid && 'Please enter a conference name'}
                />
                <TextField
                    error={!isConferenceDeadlineValid ? true : false}
                    sx={{ mt: 2 }}
                    size="small"
                    label="Conference Date"
                    variant="outlined"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                    onChange={handleConferenceDeadline}
                    helperText={!isConferenceDeadlineValid && 'Please enter a conference deadline'}
                    InputProps={{
                        inputProps: {
                            locale: 'en-US',
                        },
                    }}
                />


            </DialogContent>
            <DialogActions sx={{ margin: 'auto' }}>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button color='success' onClick={handleCreate} variant="contained" disableElevation>
                    Create
                </Button>
            </DialogActions>
        </CenteredDialog>
    );
}

function Dashboard() {
    const [open, setOpen] = useState(false);
    const theme = createTheme();
    const [userConferencesList, setUserConferencesList] = useState(null);
    const { currentUser } = useAuth();


    useEffect(() => {
        const db = crmdatabase;
        const conferencesRef = ref(db, `conferences/${currentUser.uid}/conferences`);
        onValue(conferencesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const conferences = Object.values(data);
                setUserConferencesList(conferences);
            }
        });
    }, [currentUser.uid]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <ThemeProvider theme={theme}>
                <NavBar />
                <Container component="main" maxWidth="xl">
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            {userConferencesList ? userConferencesList?.map((conference, index) => (
                                <Grid item xs={2} sm={4} md={4} key={index}>
                                    <Link style={{ textDecoration: 'none', fontWeight: 'bold' }} to={`/conference/${conference.conference_id}`}>
                                        <Item sx={{ cursor: 'pointer', ':hover': { textDecoration: 'underline', color: '#ef476f' } }}>{conference.conference_name}</Item>
                                    </Link>
                                </Grid>

                            )) : <Grid item xs={2} sm={4} md={4} >
                                <Item sx={{ cursor: 'pointer' }}>No Conferences yet!</Item>
                            </Grid>}
                            <Grid item xs={2} sm={4} md={4}>
                                <Item onClick={handleOpen} sx={{ backgroundColor: '#A7D3A6', cursor: 'pointer' }}>
                                    <ControlPoint />
                                </Item>
                            </Grid>
                        </Grid>
                    </Box>
                    <CreateNewConferenceBoard open={open} onClose={handleClose} />
                </Container>
            </ThemeProvider>
        </>
    );
}

export default Dashboard;
