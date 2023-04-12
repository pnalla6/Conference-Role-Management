import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockTwoTone';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';


// function Copyright(props) {
//     return (
//         <Typography variant="body2" color="text.secondary" align="center" {...props}>
//             {'Copyright © '}
//             <Link color="inherit" href="https://mui.com/">
//                 CRM APP
//             </Link>{' '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     );
// }

const theme = createTheme();

function RegisterUser() {
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { signUpUser, currentUser } = useAuth();
    const navigate = useNavigate();


    const handleOpenSnackBar = () => {
        setOpenSnackBar(true);
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };

    const snackBarAction = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleCloseSnackBar}>
                UNDO
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseSnackBar}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );



    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const firstName = data.get('firstName');
        const lastName = data.get('lastName');
        const email = data.get('email');
        const password = data.get('password');
        const confirmpassword = data.get('confirmpassword');

        if (password !== confirmpassword) {
            return setConfirmPasswordError(true);
        }
        else {
            try {
                setErrorMessage('');
                setLoading(true);
                await signUpUser(firstName, lastName, email, password);
                handleOpenSnackBar();
                setTimeout(() => {
                    navigate('/dashboard')
                }, 1500);
            } catch (error) {
                console.error(error);
                setErrorMessage(JSON.stringify(error.message))
            }
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            {/* <h1> {currentUser?.email}</h1> */}
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Create New Account
                    </Typography>
                    {
                        errorMessage && <Alert severity="error" variant='filled'>{errorMessage}</Alert>
                    }
                    <Box component="form" onSubmit={handleSubmit} noValidate={false} sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <TextField
                            error={confirmPasswordError ? true : false}
                            margin="normal"
                            required
                            fullWidth
                            name="confirmpassword"
                            label="Confirm Password"
                            type="confirmpassword"
                            id="confirmpassword"
                            autoComplete="current-confirmpassword"
                            helperText={confirmPasswordError ? 'passwords do not match!' : ''}
                        />
                        {/* <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        /> */}
                        <Button
                            type="submit"
                            color='success'
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            SIGN UP
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    {"Already have an account? Sign in"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackBar}
                    action={snackBarAction}
                >
                    <Alert onClose={handleCloseSnackBar} severity="success" sx={{ width: '100%' }}>
                        Registration Successful!
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
}

export default RegisterUser;