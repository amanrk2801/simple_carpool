import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth.jsx';
import Navbar from '@/components/Navbar';
import Home from '@/components/Home';
import Login from '@/components/Login';
import Register from '@/components/Register';
import OfferRide from '@/components/OfferRide';
import FindRide from '@/components/FindRide';
import Dashboard from '@/components/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/offer-ride" 
              element={
                <ProtectedRoute>
                  <OfferRide />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/find-ride" 
              element={
                <ProtectedRoute>
                  <FindRide />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

