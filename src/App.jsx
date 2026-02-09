import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import ManageMembers from './pages/ManageMembers';
import Login from './pages/Login';
import { AppProvider, AppContext } from './context/AppContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AppContext);
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <AppProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/add-expense" element={<AddExpense />} />
                        <Route path="/members" element={<ManageMembers />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AppProvider>
    );
}

export default App;
