import React from "react";
import { Link } from "react-router-dom";
import { playerData } from "../../data/semesterData";

const links = [
  { label: "Dashboard", icon: "📊" },
  { label: "My Stats", icon: "📈" },
  { label: "Inventory", icon: "🎒" },
  { label: "Goals", icon: "🎯" },
  { label: "Achievements", icon: "🏆" },
  { label: "LeSAH Services", icon: "🏠" },
  { label: "Settings", icon: "⚙️" },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay for mobile */}
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="player-avatar">
            <img src={playerData.avatar} alt="avatar" />
          </div>
          <h3>{playerData.name}</h3>
          <p>{playerData.faculty}</p>
          <div className="week-info">
            <span>📅 Week {playerData.week}</span>
            <span>📆 {playerData.day}</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {links.map((link) => (
            <Link key={link.label} to="#" className="sidebar-link">
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}