import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import RequestList from '../components/RequestList';

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', category: '', total_stock: '', available_stock: '' });
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  const fetchRequests = () => {
    api.get('/requests')
      .then((res) => setRequests(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/requests/${id}/approve`);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Approve failed');
    }
  };

  const handleReject = async (id) => {
    const remarks = prompt('Reason for rejection:');
    try {
      await api.put(`/requests/${id}/reject`, { remarks });
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Reject failed');
    }
  };

  const handleItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/inventory', {
        ...newItem,
        total_stock: Number(newItem.total_stock),
        available_stock: Number(newItem.available_stock)
      });
      setNewItem({ name: '', category: '', total_stock: '', available_stock: '' });
      alert('Item added!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '30px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Admin Panel — {user?.name}</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div style={{ border: '1px solid #ccc', padding: 16, marginBottom: 20 }}>
        <h3>Add Inventory Item</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleAddItem}>
          <input name="name" placeholder="Item name" value={newItem.name} onChange={handleItemChange} required />
          <br /><br />
          <input name="category" placeholder="Category" value={newItem.category} onChange={handleItemChange} required />
          <br /><br />
          <input name="total_stock" type="number" placeholder="Total stock" value={newItem.total_stock} onChange={handleItemChange} required />
          <br /><br />
          <input name="available_stock" type="number" placeholder="Available stock" value={newItem.available_stock} onChange={handleItemChange} required />
          <br /><br />
          <button type="submit">Add Item</button>
        </form>
      </div>

      <h3>All Requests</h3>
      <RequestList requests={requests} isAdmin onApprove={handleApprove} onReject={handleReject} />
    </div>
  );
};

export default AdminPanel;