/** Software Version: 2.3 | Dev: Engr Shuvo Das **/
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import ManageMembers from './pages/ManageMembers';
import BajarRecords from './pages/BajarRecords';
import Login from './pages/Login';
import Settings from './pages/Settings';
import About from './pages/About';
import Settlements from './pages/Settlements';
import Meals from './pages/Meals';
import { AppProvider, AppContext } from './context/AppContext';
import { ConfigProvider, theme as antdTheme } from 'antd';

// Protected Route Component to prevent unauthorized access
const ProtectedRoute = () => {
    const { isAuthenticated } = useContext(AppContext);
    const location = useLocation();

    // Log the current state for debugging in Browser Console (F12)
    console.log("[PaiseGone Router] Authenticated:", isAuthenticated, "Path:", location.pathname);

    if (isAuthenticated === true) {
        return <Outlet />;
    }

    // If not logged in, force redirect to Login page
    return <Navigate to="/login" state={{ from: location }} replace />;
};

const AppContent = () => {
    const { resolvedTheme, isAuthenticated } = useContext(AppContext);

    return (
        <ConfigProvider
            theme={{
                algorithm: resolvedTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                token: {
                    colorPrimary: '#ff4d4f',
                    borderRadius: 12,
                    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
                },
            }}
        >
            <Routes>
                {/* Public Route: Login Page */}
                <Route
                    path="/login"
                    element={isAuthenticated === true ? <Navigate to="/" replace /> : <Login />}
                />

                {/* Secure Area: All routes inside ProtectedRoute call */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        {/* Root path '/' - This should show Dashboard */}
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/add-expense" element={<AddExpense />} />
                        <Route path="/meals" element={<Meals />} />
                        <Route path="/bajar-records" element={<BajarRecords />} />
                        <Route path="/members" element={<ManageMembers />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/settlements" element={<Settlements />} />
                    </Route>
                </Route>

                {/* 404 / Catch-all Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </ConfigProvider>
    );
};

function App() {
    return (
        <Router>
            <AppProvider>
                <AppContent />
            </AppProvider>
        </Router>
    );
}

export default App;
