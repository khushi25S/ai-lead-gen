import React from "react";
import ScoreBadge from "./ScoreBadge";

export default function LeadTable({ leads }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Name</th><th>Email</th><th>Score</th><th>Source</th><th>Created</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead._id} style={{ borderTop: "1px solid #ddd" }}>
            <td>{lead.name}</td>
            <td>{lead.email}</td>
            <td><ScoreBadge score={lead.score || 0} /></td>
            <td>{lead.source}</td>
            <td>{new Date(lead.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
