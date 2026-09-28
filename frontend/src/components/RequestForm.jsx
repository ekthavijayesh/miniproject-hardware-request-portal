import { useState, useEffect } from 'react';
import api from '../services/api';

const RequestForm = ({ onRequestCreated }) => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ item: '', quantity: 1, reason: '', urgency: 'low' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/inventory')
      .then((res) => setItems(res.data))
      .catch(() => setError('Could not load inventory'));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/requests', form);
      setSuccess('Request submitted!');
      setForm({ item: '', quantity: 1, reason: '', urgency: 'low' });
      if (onRequestCreated) onRequestCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 16, marginBottom: 20 }}>
      <h3>New Hardware Request</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <select name="item" value={form.item} onChange={handleChange} required>
          <option value="">-- Select item --</option>
          {items.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name} (available: {i.available_stock})
            </option>
          ))}
        </select>
        <br /><br />
        <input
          name="quantity"
          type="number"
          min="1"
          value={form.quantity}
          onChange={handleChange}
          required
        />
        <br /><br />
        <textarea
          name="reason"
          placeholder="Reason for request"
          value={form.reason}
          onChange={handleChange}
          required
        />
        <br /><br />
        <select name="urgency" value={form.urgency} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <br /><br />
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default RequestForm;