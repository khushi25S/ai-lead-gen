import React from "react";

export default function ScoreBadge({ score }) {
  let bg = "#ef4444"; // red
  if (score > 75) bg = "#16a34a"; // green
  else if (score > 40) bg = "#f59e0b"; // yellow

  return (
    <span style={{ padding: "4px 8px", borderRadius: "6px", color: "white", background: bg }}>
      {score}
    </span>
  );
}
