import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    pending_loans: 0,
    pending_drivers: 0,
    pending_deliveries: 0,
  });
  const [loans, setLoans] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [users, setUsers] = useState([]);
  const [visitCount, setVisitCount] = useState(0);               // ← NEW
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('loans');
  const navigate = useNavigate();

  const token = localStorage.getItem('access_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAll();
    setLoading(false);
  }, [navigate]);

  const fetchAll = () => {
    fetchStats();
    fetchLoans();
    fetchDrivers();
    fetchDeliveries();
    fetchUsers();
    fetchVisitCount();                                            // ← NEW
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/dashboard/stats`,
        { headers }
      );
      if (res.ok) setStats(await res.json());
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  const fetchLoans = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/loans/pending`,
        { headers }
      );
      if (res.ok) setLoans(await res.json());
    } catch (err) {
      console.error('Loans fetch error:', err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/drivers/pending`,
        { headers }
      );
      if (res.ok) setDrivers(await res.json());
    } catch (err) {
      console.error('Drivers fetch error:', err);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/deliveries/pending`,
        { headers }
      );
      if (res.ok) setDeliveries(await res.json());
    } catch (err) {
      console.error('Deliveries fetch error:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/users`,
        { headers }
      );
      if (res.ok) setUsers(await res.json());
    } catch (err) {
      console.error('Users fetch error:', err);
    }
  };

  // NEW: fetch total site visits
  const fetchVisitCount = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/visits/count`,
        { headers }
      );
      if (res.ok) {
        const data = await res.json();
        setVisitCount(data.total_visits);
      }
    } catch (err) {
      console.error('Visit count fetch error:', err);
    }
  };

  const patchWithRetry = async (url) => {
    let lastError = '';
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(url, { method: 'PATCH', headers });
        if (res.ok) return;
        let errorDetail = `Server error ${res.status}`;
        try { const errorData = await res.json(); errorDetail = errorData.detail || errorDetail; } catch {}
        lastError = errorDetail;
        console.warn(`Attempt ${attempt} failed: ${errorDetail}`);
        if (attempt === 1) await new Promise(r => setTimeout(r, 1000));
      } catch (networkErr) {
        lastError = 'Network error. Ensure backend is running.';
        if (attempt === 1) await new Promise(r => setTimeout(r, 1000));
      }
    }
    throw new Error(lastError || 'Update failed after retries');
  };

  const handleLoanStatus = async (loanId, status) => {
    try {
      await patchWithRetry(`${process.env.REACT_APP_API_URL}/api/v1/admin/loans/${loanId}/status?status=${status}`);
      fetchLoans(); fetchStats();
    } catch (err) { alert(`Loan update failed: ${err.message}`); }
  };

  const handleVerifyDriver = async (driverId, approve) => {
    try {
      await patchWithRetry(`${process.env.REACT_APP_API_URL}/api/v1/admin/drivers/${driverId}/verify?approve=${approve}`);
      fetchDrivers(); fetchStats();
    } catch (err) { alert(`Driver verification failed: ${err.message}`); }
  };

  const handleDeliveryStatus = async (deliveryId, status) => {
    try {
      await patchWithRetry(`${process.env.REACT_APP_API_URL}/api/v1/admin/deliveries/${deliveryId}/status?status=${status}`);
      fetchDeliveries(); fetchStats();
    } catch (err) { alert(`Delivery update failed: ${err.message}`); }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats-cards">
        <div className="stat-card"><span className="stat-value">{stats.pending_loans}</span> <span className="stat-label">Pending Loans</span></div>
        <div className="stat-card"><span className="stat-value">{stats.pending_drivers}</span> <span className="stat-label">Pending Drivers</span></div>
        <div className="stat-card"><span className="stat-value">{stats.pending_deliveries}</span> <span className="stat-label">Pending Deliveries</span></div>
        <div className="stat-card"><span className="stat-value">{users.length}</span> <span className="stat-label">Total Users</span></div>
        <div className="stat-card"><span className="stat-value">{visitCount}</span> <span className="stat-label">Total Visits</span></div>
      </div>
      <div className="admin-tabs">
        <button className={`tab ${activeTab === 'loans' ? 'active' : ''}`} onClick={() => setActiveTab('loans')}>Loans</button>
        <button className={`tab ${activeTab === 'drivers' ? 'active' : ''}`} onClick={() => setActiveTab('drivers')}>Drivers</button>
        <button className={`tab ${activeTab === 'deliveries' ? 'active' : ''}`} onClick={() => setActiveTab('deliveries')}>Deliveries</button>
        <button className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
      </div>

      {/* Loans Tab */}
      {activeTab === 'loans' && (
        <section className="admin-section">
          <h2>Loan Applications</h2>
          {loans.length === 0 ? <p>No pending loans.</p> : (
            <div className="table-responsive"><table>
              <thead><tr><th>ID</th><th>User ID</th><th>Amount</th><th>Purpose</th><th>Created</th><th>Actions</th></tr></thead>
              <tbody>{loans.map(loan => (
                <tr key={loan.id}><td>{loan.id}</td><td>{loan.user_id}</td><td>M{loan.amount}</td><td>{loan.purpose}</td><td>{loan.created_at?.slice(0,10)}</td>
                  <td><button className="approve-btn" onClick={() => handleLoanStatus(loan.id, 'approved')}>Approve</button>
                    <button className="reject-btn" onClick={() => handleLoanStatus(loan.id, 'rejected')}>Reject</button></td></tr>))}</tbody></table></div>)}</section>)}

      {/* Drivers Tab */}
      {activeTab === 'drivers' && (
        <section className="admin-section">
          <h2>Driver Verification</h2>
          {drivers.length === 0 ? <p>No pending drivers.</p> : (
            <div className="table-responsive"><table>
              <thead><tr><th>ID</th><th>Full Name</th><th>Email</th><th>Vehicle</th><th>Area</th><th>Exp.</th><th>Actions</th></tr></thead>
              <tbody>{drivers.map(driver => (
                <tr key={driver.id}><td>{driver.id}</td><td>{driver.full_name}</td><td>{driver.email}</td><td>{driver.vehicle_type || 'N/A'}</td><td>{driver.area_covered || 'N/A'}</td><td>{driver.experience_years || '0'} yrs</td>
                  <td><button className="approve-btn" onClick={() => handleVerifyDriver(driver.id, true)}>Approve</button>
                    <button className="reject-btn" onClick={() => handleVerifyDriver(driver.id, false)}>Reject</button></td></tr>))}</tbody></table></div>)}</section>)}

      {/* Deliveries Tab */}
      {activeTab === 'deliveries' && (
        <section className="admin-section">
          <h2>Delivery Requests</h2>
          {deliveries.length === 0 ? <p>No pending deliveries.</p> : (
            <div className="table-responsive"><table>
              <thead><tr><th>ID</th><th>User ID</th><th>Pickup</th><th>Dropoff</th><th>Item</th><th>Weight</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>{deliveries.map(delivery => (
                <tr key={delivery.id}><td>{delivery.id}</td><td>{delivery.user_id}</td><td>{delivery.pickup_location || 'N/A'}</td><td>{delivery.dropoff_location || 'N/A'}</td><td>{delivery.item_description || 'N/A'}</td><td>{delivery.item_weight || 'N/A'}</td><td>{delivery.created_at?.slice(0,10)}</td>
                  <td><button className="approve-btn" onClick={() => handleDeliveryStatus(delivery.id, 'picked_up')}>Confirm</button>
                    <button className="reject-btn" onClick={() => handleDeliveryStatus(delivery.id, 'cancelled')}>Cancel</button></td></tr>))}</tbody></table></div>)}</section>)}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <section className="admin-section">
          <h2>Registered Users</h2>
          {users.length === 0 ? <p>No users found.</p> : (
            <div className="table-responsive"><table>
              <thead><tr><th>ID</th><th>Full Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Joined</th></tr></thead>
              <tbody>{users.map(user => (
                <tr key={user.id}><td>{user.id}</td><td>{user.full_name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.is_verified ? 'Yes' : 'No'}</td><td>{user.created_at?.slice(0,10)}</td></tr>))}</tbody></table></div>)}</section>)}
    </div>
  );
}

export default AdminDashboard;