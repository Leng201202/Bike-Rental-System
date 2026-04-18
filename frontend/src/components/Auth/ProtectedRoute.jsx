import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, hasAgreedToTerms, user, loading, hasCompletedStudentId } = useAuthStore();
    const location = useLocation();

    // Show nothing while checking auth state if needed
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
                <div className="w-12 h-12 border-4 border-[#A94442]/20 border-t-[#8B2E2E] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!hasAgreedToTerms && user?.role !== 'ADMIN' && location.pathname !== '/permissions') {
        // Force permissions agreement for non-admins before accessing role-specific routes
        return <Navigate to="/permissions" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        // Role not authorized, redirect to home or unauthorized page
        return <Navigate to="/" replace />;
    }

    const isRiderProtectedRoute = allowedRoles.includes('RIDER');
    const isProfileTab = location.pathname === '/rider' && location.search.includes('tab=profile');
    const studentIdCompleted = hasCompletedStudentId();

    if (isRiderProtectedRoute && !studentIdCompleted && !isProfileTab) {
        return <Navigate to="/rider?tab=profile" replace />;
    }

    return children;
};

export default ProtectedRoute;
