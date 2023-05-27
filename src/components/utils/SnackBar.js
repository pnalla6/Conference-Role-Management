import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function SnackBar(props) {
    const [openSnackBar, setOpenSnackBar] = useState(false);

    useEffect(() => {
        setOpenSnackBar(props.open);

    }, [props.open])


    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };
    const snackBarAction = (
        <>
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
        </>
    );

    return (
        <>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={props.autoHideDuration}
                onClose={handleCloseSnackBar}
                action={snackBarAction}
            >
                <Alert onClose={handleCloseSnackBar} severity="success" sx={{ width: '100%' }}>
                    {props.text}
                </Alert>
            </Snackbar>
        </>
    )
}

export default SnackBar