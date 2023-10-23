import React, { useState } from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import { ROOT_ROLE } from '../../../common/tools/tenantTools';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async event => {
        event.preventDefault();
        setError('');
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.role === ROOT_ROLE) {
                localStorage.setItem('root-admin-user', JSON.stringify(data));
                window.location.href = '/instances';
            } else {
                setError('Invalid role for user');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Invalid username or password');
        }
    };

    return (
        <Container
            maxWidth="xs"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 8,
            }}
        >
            <Typography variant="h4" align="center" gutterBottom>
                Sign In
            </Typography>
            {error && (
                <Typography variant="body1" color="error" gutterBottom>
                    {error}
                </Typography>
            )}
            <form
                onSubmit={handleSubmit}
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <TextField
                    label="Username"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    autoFocus
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Login
                </Button>
            </form>
        </Container>
    );
};

export default LoginForm;
