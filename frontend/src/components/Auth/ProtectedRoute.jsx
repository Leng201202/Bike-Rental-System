import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, hasAgreedToTerms, user, loading } = useAuthStore();
    const location = useLocation();

    // Show nothing while checking auth state if needed
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#242424]">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!hasAgreedToTerms && location.pathname !== '/permissions') {
        // Force permissions agreement before accessing role-specific routes
        return <Navigate to="/permissions" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        // Role not authorized, redirect to home or unauthorized page
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
