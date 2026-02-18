import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';

// Page Imports
import HomePage from './pages/HomePage';
import BikesPage from './pages/User/BikesPage';
import UserDashboard from './pages/User/UserDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Permissions from './pages/Auth/Permissions';

import ProtectedRoute from './components/Auth/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-[#242424] text-white selection:bg-blue-500/30 selection:text-blue-200">
        {/* Navigation */}
        <Navbar />

        {/* Global Page Layout */}
        <main>
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
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
