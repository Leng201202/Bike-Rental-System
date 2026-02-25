import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Lazy loaded page components
const HomePage = lazy(() => import('./pages/HomePage'));
const BikesPage = lazy(() => import('./pages/User/BikesPage'));
const UserDashboard = lazy(() => import('./pages/User/UserDashboard'));
const PaymentPage = lazy(() => import('./pages/User/PaymentPage'));
const LiveTracking = lazy(() => import('./pages/User/LiveTracking'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Permissions = lazy(() => import('./pages/Auth/Permissions'));

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-[#242424]">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-[#242424] text-white selection:bg-blue-500/30 selection:text-blue-200">
        {/* Navigation */}
        <Navbar />

        {/* Global Page Layout */}
        <main>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Core Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/bikes" element={<BikesPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/permissions" element={<Permissions />} />

              {/* Dashboard Routes */}
              <Route
                path="/rider"
                element={
                  <ProtectedRoute allowedRoles={['RIDER']}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute allowedRoles={['RIDER']}>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute allowedRoles={['RIDER']}>
                    <LiveTracking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
