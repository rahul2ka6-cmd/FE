import React, { useState } from 'react';
import { Typography, TextField, Button, Card, CardContent, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../lib/config';

const LoginRegister = ({ onLoginSuccess }) => {
  const [loginName, setLoginName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginName || typeof loginName !== 'string' || !loginName.trim()) {
      setError('Please enter a login name.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ login_name: loginName.trim() }),
      });

      if (!response.ok) {
        let errorMsg = 'Login failed';
        try {
          const data = await response.json();
          errorMsg = data.error || errorMsg;
        } catch (parseErr) {
          // response is not JSON
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      // data = { _id, first_name, last_name, token }
      onLoginSuccess(data);
      navigate(`/users/${data._id}`);
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: '40px auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              label="Login Name"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              placeholder="e.g. ian, john, ellen"
              disabled={loading}
              autoFocus
            />

            {error && (
              <Alert severity="error" style={{ marginTop: 8, marginBottom: 8 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: 16 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <Typography
            variant="body2"
            color="text.secondary"
            style={{ marginTop: 16, textAlign: 'center' }}
          >
            Available: ian, ellen, pippin, rey, april, john
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginRegister;
