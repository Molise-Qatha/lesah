import React, { useState } from "react";
import Sidebar from "../components/SemesterSurvival/Sidebar";
import StatusBar from "../components/SemesterSurvival/StatusBar";
import WelcomeBanner from "../components/SemesterSurvival/WelcomeBanner";
import StatsCard from "../components/SemesterSurvival/StatsCard";
import ActionGrid from "../components/SemesterSurvival/ActionGrid";
import MoneyTip from "../components/SemesterSurvival/MoneyTip";
import EventModal from "../components/SemesterSurvival/EventModal";
import "../components/SemesterSurvival/LesahLife.css";

export default function LesahLifePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);

  return (
    <div className="lesah-life">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        {/* Mobile hamburger */}
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>

        <StatusBar />
        <WelcomeBanner />
        <StatsCard />
        <ActionGrid />
        <MoneyTip />

        {/* Trigger event modal for demonstration */}
        <button onClick={() => setEventOpen(true)} className="primary-btn">
          Trigger Random Event (Demo)
        </button>

        <EventModal open={eventOpen} onClose={() => setEventOpen(false)} />
      </div>
    </div>
  );
}