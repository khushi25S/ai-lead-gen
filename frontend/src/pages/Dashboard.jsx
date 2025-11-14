import React, { useEffect, useState } from "react";
import axios from "axios";
import LeadTable from "../components/LeadTable";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [query, setQuery] = useState("");

  async function fetchLeads() {
    const base = process.env.REACT_APP_API_BASE || "http://localhost:5000";
    const res = await axios.get(`${base}/api/leads?q=${query}`);
    setLeads(res.data.leads);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Search leads"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={fetchLeads}>Search</button>
      </div>
      <LeadTable leads={leads} />
    </div>
  );
}
