import React, { useState } from 'react';
import './AddNewRole.css'
import { X } from 'react-feather';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, Link, TextField, Typography } from '@mui/material';

function AddNewRole(props) {
  const [showAddNewRole, setShowAddNewRole] = useState(false);
  // const [roleType, setRoleType] = useState('');
  // const [rolePersonName, setRolePersonName] = useState('');
  const theme = createTheme();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (props.onSubmit) props.onSubmit(data.get('roleType'), data.get('rolePersonName'));
    setShowAddNewRole(false);
    // setRoleType(" ");
    // setRolePersonName(" ");
  }

  return (
    <div className='addNewRole'>
      {showAddNewRole
        ?
        <ThemeProvider theme={theme}>
          <Container component="main" sx={{ widows: '10%' }}>
            <CssBaseline />
            <Box
              sx={{
                marginTop: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box component="form"
                onSubmit={handleSubmit}
                noValidate sx={{ mt: 1 }
                }>
                <TextField
                  size='small'
                  margin="normal"
                  required
                  id="roleType"
                  label="Role Type"
                  name="roleType"
                  autoComplete="off"
                  autoFocus
                />
                <TextField
                  size='small'
                  margin="normal"
                  required
                  name="rolePersonName"
                  label="Name"
                  type="rolePersonName"
                  id="rolePersonName"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ display: 'block', margin: 'auto', mt: 3, mb: 1 }}
                >
                  Add Role
                </Button>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
        // <form className='addNewRoleForm' onSubmit={(e) => {
        //   e.preventDefault();
        //   if (props.onSubmit) props.onSubmit(roleType, rolePersonName);
        //   setShowAddNewRole(false);
        //   setRoleType(" ");
        //   setRolePersonName(" ");
        // }}>
        //   <input value={roleType} type="text" placeholder="Enter Role Type" autoFocus={true} onChange={(e) => { setRoleType(e.target.value); }} />
        //   <input value={rolePersonName} type="text" placeholder="Enter Name" onChange={(e) => { setRolePersonName(e.target.value); }} />
        //   <div className='addNewRoleFormFooter'>
        //     <button type='submit'>{props.buttonText || 'Add'}</button>
        //     <X onClick={() => setShowAddNewRole(false)} />
        //   </div>
        // </form>
        :
        <p className='addNewRoleButton' style={{ cursor: "pointer" }} onClick={() => setShowAddNewRole(true)}>Add Role</p>
      }
    </div>
  )
}

export default AddNewRole