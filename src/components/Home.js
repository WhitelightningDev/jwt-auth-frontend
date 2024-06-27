import React, { useEffect, useState } from 'react';
import { Typography, Container, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Home = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState([]);
  const [system, setSystem] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [ous, setOus] = useState([]);
  const [selectedOuId, setSelectedOuId] = useState('');
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    fetchCredentials();
    fetchOus();
    fetchRoles();
  }, []);

  const fetchCredentials = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3030/division-credentials', {
        headers: {
          Authorization: token
        }
      });
      setCredentials(response.data.credentials);
    } catch (error) {
      console.error('Error fetching credentials:', error);
      toast.error('Error fetching credentials. Please try again.');
    }
  };

  const fetchOus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3030/ous', {
        headers: {
          Authorization: token
        }
      });
      setOus(response.data.ous);
    } catch (error) {
      console.error('Error fetching OUs:', error);
      toast.error('Error fetching OUs. Please try again.');
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3030/roles', {
        headers: {
          Authorization: token
        }
      });
      setRoles(response.data.roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Error fetching roles. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    toast.success('Logged out successfully!');
  };

  const handleAddCredential = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3030/add-credential', {
        system,
        login,
        password,
        divisionId
      }, {
        headers: {
          Authorization: token
        }
      });

      setCredentials([...credentials, response.data.credential]);
      toast.success('Credential added successfully!');
    } catch (error) {
      console.error('Error adding credential:', error);
      if (error.response) {
        if (error.response.status === 404) {
          toast.error('Division not found. Please try again.');
        } else if (error.response.status === 403) {
          toast.error('Unauthorized to add credential to this division.');
        } else {
          toast.error('Error adding credential. Please try again later.');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        toast.error('No response received from server. Please try again later.');
      } else {
        console.error('Error setting up request:', error.message);
        toast.error('Error setting up request to add credential. Please try again later.');
      }
    }
  };

  const handleUpdateCredentials = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3030/update-credentials', {
        newPassword,
      }, {
        headers: {
          Authorization: token
        }
      });

      toast.success('Credentials updated successfully!');
      fetchCredentials();
    } catch (error) {
      console.error('Error updating credentials:', error);
      toast.error('Error updating credentials. Please try again.');
    }
  };

  const handleAssignDivision = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3030/assign-division', {
        divisionId: selectedOuId ? selectedOuId : divisionId,
      }, {
        headers: {
          Authorization: token
        }
      });

      toast.success('Division assigned successfully!');
      // Optionally, fetch updated credentials after assignment
      fetchCredentials();
    } catch (error) {
      console.error('Error assigning division:', error);
      toast.error('Error assigning division. Please try again.');
    }
  };

  const handleChangeRole = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3030/change-role', {
        userId: localStorage.getItem('userId'),
        newRole: selectedRole,
      }, {
        headers: {
          Authorization: token
        }
      });

      toast.success('Role changed successfully!');
      // Optionally, fetch updated credentials after role change
      fetchCredentials();
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error('Error changing role. Please try again.');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Your App
      </Typography>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
      <Typography variant="h5" component="h2" gutterBottom>
        Division Credentials
      </Typography>
      {credentials.map((credential, index) => (
        <div key={index}>
          <Typography variant="body1">
            System: {credential.system}, Login: {credential.login}, Password: {credential.password}
          </Typography>
        </div>
      ))}
      
      <Typography variant="h5" component="h2" gutterBottom>
        Add Credential
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="System"
            variant="outlined"
            fullWidth
            value={system}
            onChange={(e) => setSystem(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Login"
            variant="outlined"
            fullWidth
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleAddCredential}>
            Add Credential
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h5" component="h2" gutterBottom>
        Update Credentials
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="New Password"
            variant="outlined"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" onClick={handleUpdateCredentials}>
            Update Credentials
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h5" component="h2" gutterBottom>
        Assign Division or OU
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="select-ou-label">Organizational Unit</InputLabel>
            <Select
              labelId="select-ou-label"
              id="select-ou"
              value={selectedOuId}
              onChange={(e) => setSelectedOuId(e.target.value)}
              label="Organizational Unit"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {ous.map((ou) => (
                <MenuItem key={ou._id} value={ou._id}>{ou.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Division ID (if directly assigning)"
            variant="outlined"
            fullWidth
            value={divisionId}
            onChange={(e) => setDivisionId(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleAssignDivision}>
            Assign Division or OU
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h5" component="h2" gutterBottom>
        Change Role
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="select-role-label">Select Role</InputLabel>
            <Select
              labelId="select-role-label"
              id="select-role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              label="Select Role"
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleChangeRole}>
            Change Role
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
