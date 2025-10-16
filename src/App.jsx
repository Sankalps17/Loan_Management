import { CssBaseline, Container } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import AdminRoute from './components/layout/AdminRoute.jsx';
import Welcome from './pages/Welcome.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ApplyLoan from './pages/ApplyLoan.jsx';
import EMITracker from './pages/EMITracker.jsx';
import RepaymentTable from './pages/RepaymentTable.jsx';
import ApprovedLoans from './pages/ApprovedLoans.jsx';
import { useAuth } from './context/AuthContext.jsx';
import SnackbarOutlet from './components/feedback/SnackbarOutlet.jsx';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <CssBaseline />
      <SnackbarOutlet />
      {isAuthenticated && <Navbar />}
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
        <Container maxWidth="lg" className="py-6">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={(
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/apply"
              element={(
                <ProtectedRoute>
                  <ApplyLoan />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/emi-tracker"
              element={(
                <ProtectedRoute>
                  <EMITracker />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/repayment"
              element={(
                <ProtectedRoute>
                  <RepaymentTable />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/admin"
              element={(
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              )}
            />
            <Route
              path="/admin/approved"
              element={(
                <AdminRoute>
                  <ApprovedLoans />
                </AdminRoute>
              )}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </main>
    </>
  );
};

export default App;
