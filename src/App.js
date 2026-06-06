import './App.css';

import React, { useState, useEffect } from 'react';
import { Grid, Paper } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';

import TopBar from './components/TopBar';
import UserDetail from './components/UserDetail';
import UserList from './components/UserList';
import UserPhotos from './components/UserPhotos';
import LoginRegister from './components/LoginRegister';
import BASE_URL from './lib/config';

// Wrapper to redirect if userId is invalid (undefined, null, etc.)
const ValidUserDetail = () => {
  const { userId } = useParams();
  if (!userId || userId === 'undefined' || userId === 'null') {
    return <Navigate to="/users" replace />;
  }
  return <UserDetail />;
};

const ValidUserPhotos = ({ currentUser }) => {
  const { userId } = useParams();
  if (!userId || userId === 'undefined' || userId === 'null') {
    return <Navigate to="/users" replace />;
  }
  return <UserPhotos currentUser={currentUser} />;
};

const App = () => {
  // Restore user from localStorage on page load
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      // Only restore user if token exists
      if (saved && token) {
        return JSON.parse(saved);
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  // Listen for auth expiration (401 from backend)
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
    };
    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const handleLoginSuccess = (userData) => {
    // userData includes { _id, first_name, last_name, token }
    const { token, ...userInfo } = userData;
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    localStorage.setItem('token', token);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${BASE_URL}/admin/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
    } catch (err) {
      // Still logout locally even if server request fails
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar user={user} onLogout={handleLogout} />
          </Grid>

          <div className="main-topbar-buffer" />

          {!user ? (
            // Not logged in: show LoginRegister only
            <Grid item xs={12}>
              <Paper className="main-grid-item">
                <LoginRegister onLoginSuccess={handleLoginSuccess} />
              </Paper>
            </Grid>
          ) : (
            // Logged in: sidebar + main content
            <>
              <Grid item sm={3}>
                <Paper className="main-grid-item">
                  <UserList />
                </Paper>
              </Grid>

              <Grid item sm={9}>
                <Paper className="main-grid-item">
                  <Routes>
                    <Route path="/" element={<Navigate to="/users" replace />} />
                    <Route path="/users/:userId" element={<ValidUserDetail />} />
                    <Route path="/photos/:userId" element={<ValidUserPhotos currentUser={user} />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="*" element={<Navigate to="/users" replace />} />
                  </Routes>
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      </div>
    </Router>
  );
};

export default App;
