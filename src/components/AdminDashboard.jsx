import React, { useState, useEffect } from 'react';

// --- CLOUD CONFIGURATION ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const AdminDashboard = ({ onBack }) => {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, totalStudents: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Using dynamic API_BASE_URL
                const [bookingsResponse, statsResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/admin/bookings`),
                    fetch(`${API_BASE_URL}/api/admin/stats`)
                ]);

                if (bookingsResponse.ok && statsResponse.ok) {
                    const bookingsData = await bookingsResponse.json();
                    const statsData = await statsResponse.json();
                    
                    setBookings(bookingsData);
                    setStats(statsData);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDashboardData();
    }, []);

    const handleExportCSV = async () => {
        try {
            // Using dynamic API_BASE_URL
            const response = await fetch(`${API_BASE_URL}/api/admin/export`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'campus_events_report.csv');
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                alert("Failed to export data.");
            }
        } catch (error) {
            console.error("Export failed:", error);
        }
    };

    const filteredBookings = bookings.filter(b => 
        b.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.studentRollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.userDepartment?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', animation: 'fadeInUp 0.8s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <button onClick={onBack} style={{ width: 'auto', padding: '10px 20px', background: 'rgba(255,255,255,0.1)' }}>
                    ← EXIT DASHBOARD
                </button>
                <h1 style={{ color: '#00f6ff', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
                    Admin Console
                </h1>
                
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button onClick={handleExportCSV} style={{ background: '#fff', color: '#000', padding: '10px 20px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', height: 'fit-content' }}>
                        📥 EXPORT CSV
                    </button>

                    <div style={{ textAlign: 'center', background: 'rgba(0, 246, 255, 0.1)', padding: '10px 20px', borderRadius: '12px', border: '1px solid #00f6ff' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#fff' }}>TOTAL STUDENTS</p>
                        <h2 style={{ margin: 0, color: '#00f6ff' }}>{stats.totalStudents}</h2>
                    </div>
                    <div style={{ textAlign: 'center', background: 'rgba(255, 204, 0, 0.1)', padding: '10px 20px', borderRadius: '12px', border: '1px solid #ffcc00' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#fff' }}>TOTAL REVENUE</p>
                        <h2 style={{ margin: 0, color: '#ffcc00' }}>₹{stats.totalRevenue}</h2>
                    </div>
                </div>
            </div>

            <div className="card" style={{ width: '100%', padding: '30px' }}>
                <div className="form-group" style={{ marginBottom: '25px', maxWidth: '400px' }}>
                    <input 
                        type="text" 
                        placeholder="Search by Name, Roll No, or Dept..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: 'rgba(0,0,0,0.5)' }}
                    />
                </div>

                {loading ? (
                    <h3 style={{ textAlign: 'center', color: '#fff' }}>Loading secure data...</h3>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.2)', color: '#00f6ff' }}>
                                    <th style={{ padding: '15px 10px' }}>ID</th>
                                    <th style={{ padding: '15px 10px' }}>Student Name</th>
                                    <th style={{ padding: '15px 10px' }}>Roll No</th>
                                    <th style={{ padding: '15px 10px' }}>Department</th>
                                    <th style={{ padding: '15px 10px' }}>Tickets</th>
                                    <th style={{ padding: '15px 10px' }}>Amount Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                                    <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px 10px', opacity: 0.7 }}>#{booking.id}</td>
                                        <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>{booking.userName}</td>
                                        <td style={{ padding: '15px 10px' }}>{booking.studentRollNo}</td>
                                        <td style={{ padding: '15px 10px' }}>{booking.userDepartment}</td>
                                        <td style={{ padding: '15px 10px' }}>
                                            <span className="available" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
                                                {booking.ticketsBooked}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px 10px', color: '#ffcc00', fontWeight: 'bold' }}>
                                            ₹{booking.totalAmount}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '30px', textAlign: 'center', opacity: 0.6 }}>
                                            No registrations found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;