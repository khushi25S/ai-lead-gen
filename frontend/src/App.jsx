import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddLead from './pages/AddLead';

function App() {
  return (
    <Router>
      <nav style={{ padding: '10px', background: '#f0f0f0' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Dashboard</Link>
        <Link to="/add">Add Lead</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddLead />} />
      </Routes>
    </Router>
  );
}

export default App;
