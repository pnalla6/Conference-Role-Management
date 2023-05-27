import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import NavBar from './NavBar';
import Image from 'material-ui-image';
import placeholder001 from '../../assets/placeholder001.jpeg';
import placeholder002 from '../../assets/placeholder0002.png';

function Landing() {
  return (
    <>
      <NavBar conferenceName="Conference Role Management App" />
      <Container maxWidth="md" sx={{ color: 'whitesmoke', marginTop: '2rem' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box pt={6} pb={2} textAlign="center">
              <Typography variant="h3" color="textPrimary" gutterBottom>
                Welcome to the Conference Role Management App
              </Typography>
            </Box>
            <Box pb={4} textAlign="center">
              <Typography variant="h5" color="textSecondary">
                The Most Effective Way to Manage Roles at Your Conference
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box pb={2}>
              <Typography variant="body1" color="textPrimary" textAlign="center">
                The Conference Role Management App provides a comprehensive solution for managing roles and tasks at conferences and events. With its intuitive interface and powerful features, it simplifies the process of assigning, tracking, and organizing roles for conference participants.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box pb={2} textAlign="center">
              <Typography variant="h4" color="textPrimary" gutterBottom>
                About
              </Typography>
              <Image src={placeholder001} alt="About Image" sx={{ borderRadius: '8px' }} />
              <Typography variant="body1" color="textPrimary">
                The app streamlines the management of conference roles by providing a centralized platform for administrators and participants to collaborate and coordinate their tasks. It offers real-time updates, notifications, and a user-friendly interface to ensure smooth communication and efficient role management.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box pb={2} textAlign="center">
              <Typography variant="h4" color="textPrimary" gutterBottom>
                Features
              </Typography>
              <Image src={placeholder002} alt="Features Image" sx={{ borderRadius: '8px' }} />
              <Typography variant="body1" color="textPrimary">
                Key features of the app include role assignment, deadline tracking, task dependencies, progress monitoring, and communication tools. It allows conference organizers to easily assign roles to participants, set deadlines for tasks, define task dependencies, and visualize the progress of each role using an interactive timeline. Participants can access their assigned roles, view task details, update progress, and communicate with other team members through the app.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box pb={2} textAlign="center">
              <Typography variant="h4" color="textPrimary" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body1" color="textPrimary">
                Please feel free to reach out to us at contact@crmapp.com for any inquiries or assistance regarding the Conference Role Management App. We are here to support you and ensure a successful conference experience.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Landing;
