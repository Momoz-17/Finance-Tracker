import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Profile from './pages/Profile';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Listen for manual logins/logouts within the same tab
    const handleAuthChange = () => {
      setToken(localStorage.getItem('token'));
    };
    
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const isAuthenticated = !!token;

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {/* Pass isAuthenticated to Navbar to show/hide logout button */}
        <Navbar isAuthenticated={isAuthenticated} setToken={setToken} />
        <main>
          <Routes>
            <Route 
              path="/auth" 
              element={!isAuthenticated ? <Auth setToken={setToken} /> : <Navigate to="/" replace />} 
            />

            <Route 
              path="/" 
              element={isAuthenticated ? <Home /> : <Navigate to="/auth" replace />} 
            />
            
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile /> : <Navigate to="/auth" replace />} 
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;