import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Container, Button, Typography } from '@mui/material';
import NavBar from '../home/NavBar';


const useStyles = styled((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        marginTop: theme.spacing(8),
    },
    title: {
        marginBottom: theme.spacing(4),
    },
    button: {
        marginTop: theme.spacing(2),
    },
}));

function NotFound() {
    const classes = useStyles();

    return (
        <>
            <NavBar />
            <Container className={classes.container}>
                <Typography variant="h4" component="h1" className={classes.title}>
                    404 - Page not found
                </Typography>
                <Typography variant="body1">
                    The page you are looking for might have been removed or is temporarily unavailable.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/"
                    className={classes.button}
                >
                    Go back to Home
                </Button>
            </Container>
        </>
    );
}

export default NotFound;
