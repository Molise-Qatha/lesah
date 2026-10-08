import React, { useEffect, useState } from 'react';
import { fetchStats } from '../data/analytics';
import AdminNav from '../components/AdminNav';
import './AdminAnalytics.css';

function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await fetchStats(30);
        if (mounted) setEvents(data);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="adm-analytics">
        <AdminNav />
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="adm-analytics">
        <AdminNav />
        <p>Error: {error}</p>
      </div>
    );
  }

  const now = Date.now();
  const ts = (v) => new Date(v).getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  const today = events.filter((e) => ts(e.created_at) >= now - dayMs);
  const week = events.filter((e) => ts(e.created_at) >= now - 7 * dayMs);
  const month = events;

  const uniqueSessions = (arr) =>
    new Set(arr.map((e) => e.metadata && e.metadata.session_id).filter(Boolean)).size;

  // Daily chart (last 14 days)
  const daily = {};
  for (let i = 13; i >= 0; i--) {
    const key = new Date(now - i * dayMs).toISOString().slice(0, 10);
    daily[key] = { views: 0, ai: 0, scams: 0 };
  }
  events.forEach((e) => {
    const key = e.created_at.slice(0, 10);
    if (daily[key]) {
      if (e.event_type === 'page_view') daily[key].views += 1;
      else if (e.event_type === 'ai_question') daily[key].ai += 1;
      else if (e.event_type === 'scam_detected') daily[key].scams += 1;
    }
  });
  const dailyMax = Math.max(1, ...Object.values(daily).map((d) => d.views + d.ai));

  // Top pages
  const pageCounts = {};
  month
    .filter((e) => e.event_type === 'page_view' && e.page)
    .forEach((e) => {
      pageCounts[e.page] = (pageCounts[e.page] || 0) + 1;
    });
  const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  // Devices
  const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
  month.forEach((e) => {
    const d = e.metadata && e.metadata.device;
    if (deviceCounts[d] !== undefined) deviceCounts[d] += 1;
  });
  const deviceTotal = Object.values(deviceCounts).reduce((a, b) => a + b, 0) || 1;

  // AI
  const aiQuestions = month.filter((e) => e.event_type === 'ai_question');
  const scamDetections = month.filter((e) => e.event_type === 'scam_detected');

  const questionCounts = {};
  aiQuestions.forEach((e) => {
    const q = e.metadata && e.metadata.question;
    if (q) {
      const key = q.toLowerCase().trim().slice(0, 80);
      questionCounts[key] = (questionCounts[key] || 0) + 1;
    }
  });
  const topQuestions = Object.entries(questionCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <div className="adm-analytics">
      <AdminNav />

      <h1>Platform Analytics</h1>
      <p className="adm-sub">Last {events.length} events · 30-day window</p>

      <div className="adm-cards">
        <div className="adm-card">
          <div className="adm-card-label">Visits today</div>
          <div className="adm-card-value">{today.filter((e) => e.event_type === 'page_view').length}</div>
          <div className="adm-card-sub">{uniqueSessions(today)} unique sessions</div>
        </div>
        <div className="adm-card">
          <div className="adm-card-label">This week</div>
          <div className="adm-card-value">{week.filter((e) => e.event_type === 'page_view').length}</div>
          <div className="adm-card-sub">{uniqueSessions(week)} unique sessions</div>
        </div>
        <div className="adm-card">
          <div className="adm-card-label">AI questions</div>
          <div className="adm-card-value">{aiQuestions.length}</div>
          <div className="adm-card-sub">last 30 days</div>
        </div>
        <div className="adm-card adm-card-alert">
          <div className="adm-card-label">Scams detected</div>
          <div className="adm-card-value">{scamDetections.length}</div>
          <div className="adm-card-sub">last 30 days</div>
        </div>
      </div>

      <h2>Daily activity (14 days)</h2>
      <div className="adm-chart">
        {Object.entries(daily).map(([day, counts]) => {
          const total = counts.views + counts.ai;
          return (
            <div
              key={day}
              className="adm-bar-wrap"
              title={`${day}: ${counts.views} views · ${counts.ai} AI`}
            >
              <div className="adm-bar" style={{ height: `${(total / dailyMax) * 100}%` }} />
              <div className="adm-bar-label">{day.slice(5)}</div>
            </div>
          );
        })}
      </div>

      <div className="adm-grid">
        <div>
          <h2>Top pages (30 days)</h2>
          <table className="adm-table">
            <thead><tr><th>Path</th><th>Visits</th></tr></thead>
            <tbody>
              {topPages.length === 0 && <tr><td colSpan="2">No data yet</td></tr>}
              {topPages.map(([path, count]) => (
                <tr key={path}><td>{path}</td><td>{count}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h2>Devices (30 days)</h2>
          <table className="adm-table">
            <thead><tr><th>Device</th><th>Count</th><th>%</th></tr></thead>
            <tbody>
              {Object.entries(deviceCounts).map(([dev, count]) => (
                <tr key={dev}>
                  <td>{dev}</td>
                  <td>{count}</td>
                  <td>{Math.round((count / deviceTotal) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2>Top AI questions (30 days)</h2>
      <table className="adm-table">
        <thead><tr><th>Question</th><th>Times asked</th></tr></thead>
        <tbody>
          {topQuestions.length === 0 && <tr><td colSpan="2">No AI questions logged yet</td></tr>}
          {topQuestions.map(([q, count]) => (
            <tr key={q}><td>{q}</td><td>{count}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Recent events</h2>
      <table className="adm-table">
        <thead>
          <tr><th>Time</th><th>Type</th><th>Page / Question</th><th>Device</th></tr>
        </thead>
        <tbody>
          {events.slice(0, 30).map((e) => (
            <tr key={e.id}>
              <td>{new Date(e.created_at).toLocaleString()}</td>
              <td>{e.event_type}</td>
              <td>{(e.page || (e.metadata && e.metadata.question) || '—').slice(0, 60)}</td>
              <td>{(e.metadata && e.metadata.device) || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminAnalytics;