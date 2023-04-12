import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
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
import { Link, useNavigate } from 'react-router-dom';


// function Copyright(props) {
//     return (
//         <Typography variant="body2" color="text.secondary" align="center" {...props}>
//             {'Copyright © '}
//             <Link color="inherit" href="">
//                 CRM App
//             </Link>{' '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     );
// }


function LoginUser() {
    const [loading, setLoading] = useState(false);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { loginUser, currentUser } = useAuth();
    const navigate = useNavigate();
    const theme = createTheme();



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

        if (data.get('email') && data.get('password')) {
            console.log({
                email: data.get('email'),
                password: data.get('password')
            });

            try {
                setErrorMessage('');
                setLoading(true);
                await loginUser(data.get('email'), data.get('password'));
                handleOpenSnackBar();
                setTimeout(() => {
                    navigate('/dashboard')
                }, 1000);
            } catch (error) {
                console.error(error);
                setErrorMessage(JSON.stringify(error.message))
            }
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
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
                        Sign in
                    </Typography>
                    {
                        errorMessage && <Alert severity="error" variant='filled'>{errorMessage}</Alert>
                    }
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                        {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                {/* <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link> */}
                                <Link to="/register">Register</Link>
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
                        Login Successful!
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
}
export default LoginUser;