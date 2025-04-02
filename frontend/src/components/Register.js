import React, { useState } from 'react';
import {
  Box, Button, Input, Heading, Text, VStack
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  const navigate = useNavigate(); 
  // Handles user registration and navigates to login
  const handleRegister = async () => {
    try {
      await axios.post(`${API_URL}/register`, { name, email, password });
      alert('Registered! Now login.');
      navigate('/'); 
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    }
  };

  return (
    <Box bg="gray.900" color="white" minH="100vh" display="flex" justifyContent="center" alignItems="center">
      <VStack spacing={4} p={8} bg="gray.800" borderRadius="md" boxShadow="lg" w="100%" maxW="md">
        <Heading size="lg">Register</Heading>
        <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button colorScheme="teal" width="full" onClick={handleRegister}>Register</Button>
        <Text fontSize="sm">
          Already have an account? <Link to="/" style={{ color: '#90cdf4' }}>Login</Link>
        </Text>
      </VStack>
    </Box>
  );
}
