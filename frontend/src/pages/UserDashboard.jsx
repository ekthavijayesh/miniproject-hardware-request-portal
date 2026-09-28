import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import RequestForm from '../components/RequestForm';
import RequestList from '../components/RequestList';

const UserDashboard = () => {
  const [requests, setRequests] = useState([]);
  const { user, logout } = useAuth();

  const fetchRequests = () => {
    api.get('/requests/my')
      .then((res) => setRequests(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '30px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Welcome, {user?.name}</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <RequestForm onRequestCreated={fetchRequests} />

      <h3>My Requests</h3>
      <RequestList requests={requests} />
    </div>
  );
};

export default UserDashboard;