import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../user/AuthProvider';

function PrivateRoutes() {
    const location = useLocation();
    const { currentUser } = useAuth();
    
    if (currentUser && location.pathname === '/') {
        return <Navigate to="/dashboard" />
    }

    return (
        currentUser ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoutes