import React, { useState } from 'react';
import {
  Box, Button, Input, Heading, Text, VStack
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();

  // Handles login and navigates to dashboard 
  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.name);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <Box bg="gray.900" color="white" minH="100vh" display="flex" justifyContent="center" alignItems="center">
      <VStack spacing={4} p={8} bg="gray.800" borderRadius="md" boxShadow="lg" w="100%" maxW="md">
        <Heading size="lg">Login</Heading>
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button bg="#74c6c7" color="white" width="full" onClick={handleLogin}>Login</Button>
        <Text fontSize="sm">
          Don't have an account? <Link to="/register" style={{ color: '#90cdf4' }}>Register</Link>
        </Text>
      </VStack>
    </Box>
  );
}
