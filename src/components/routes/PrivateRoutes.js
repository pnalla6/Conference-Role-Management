import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../user/AuthProvider';

function PrivateRoutes() {
    const { currentUser } = useAuth();
    console.log('loggedin=', currentUser);
    return (
        currentUser ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoutes