import React, { useState } from 'react';
import axios from 'axios';

const AddLead = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    company: '',
    interest: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE}/api/leads`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: formData.source,
        metadata: {
          company: formData.company,
          interest: formData.interest
        }
      });
      setMessage(`✅ Lead added: ${res.data.name}`);
      setFormData({ name: '', email: '', phone: '', source: '', company: '', interest: '' });
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to add lead');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Add New Lead</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required /><br/><br/>
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required /><br/><br/>
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} /><br/><br/>
        <input name="source" placeholder="Source" value={formData.source} onChange={handleChange} /><br/><br/>
        <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} /><br/><br/>
        <input name="interest" placeholder="Interest" value={formData.interest} onChange={handleChange} /><br/><br/>
        <button type="submit">Add Lead</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddLead;
