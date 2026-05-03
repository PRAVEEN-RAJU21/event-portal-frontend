import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import BookingForm from './components/BookingForm'; 
import AdminDashboard from './components/AdminDashboard'; 
import AdminLogin from './components/AdminLogin';
import VerifyTicket from './components/VerifyTicket';
import './index.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// --- WRAPPER COMPONENT TO KEEP YOUR EXISTING LOGIC ---
const MainPortal = ({ allEvents, refreshData, error, showAdmin, setShowAdmin, isAdminAuth, setIsAdminAuth }) => {
    const [event, setEvent] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCategorySelect = (cat) => {
        setSelectedCategory(cat);
        setEvent(null); 
    };

    const getBackgroundVideo = () => {
        if (!selectedCategory) return "/videos/home.mp4";
        return selectedCategory === 'technical' ? "/videos/tech.mp4" : "/videos/sports.mp4";
    };

    if (showAdmin) {
        return (
            <div className="app-wrapper">
                <video autoPlay loop muted playsInline className="live-background">
                    <source src="/videos/home.mp4" type="video/mp4" />
                </video>
                <div className="glass-container">
                    {!isAdminAuth ? (
                        <AdminLogin 
                            onLoginSuccess={() => setIsAdminAuth(true)} 
                            onCancel={() => setShowAdmin(false)} 
                        />
                    ) : (
                        <AdminDashboard onBack={() => { 
                            setShowAdmin(false); 
                            setIsAdminAuth(false);
                        }} />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="app-wrapper">
            <video autoPlay loop muted playsInline className="live-background" key={selectedCategory || 'home'}>
                <source src={getBackgroundVideo()} type="video/mp4" />
            </video>

            <div className="glass-container">
                {!selectedCategory ? (
                    <div className="welcome-screen" style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '800' }}>WELCOME TO THE</h1>
                        <h2 style={{ color: '#3b82f6', fontSize: '2.2rem', marginBottom: '20px' }}>CAMPUS EVENT PORTAL</h2>
                        
                        {error && (
                            <div style={{ color: '#ff4444', marginBottom: '20px', background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '8px' }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <button 
                            onClick={() => setShowAdmin(true)} 
                            style={{ width: 'auto', padding: '10px 25px', background: 'rgba(0,0,0,0.5)', border: '1px solid #3b82f6', color: '#3b82f6', marginBottom: '40px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold' }}
                        >
                            🔒 ADMIN LOGIN
                        </button>

                        <div className="layout-grid">
                            <div className="card" onClick={() => handleCategorySelect('technical')} style={{ cursor: 'pointer' }}>
                                <div style={{ fontSize: '3.5rem' }}>💻</div>
                                <h3>TECHNICAL EVENTS</h3>
                                <p>Innovation & Coding Hub</p>
                            </div>
                            <div className="card" onClick={() => handleCategorySelect('non-technical')} style={{ cursor: 'pointer' }}>
                                <div style={{ fontSize: '3.5rem' }}>⚽</div>
                                <h3>NON-TECHNICAL</h3>
                                <p>Sports & Cultural Hub</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <button onClick={() => { setSelectedCategory(null); setEvent(null); }} style={{ width: 'auto', padding: '10px 25px' }}>
                                ← BACK TO HOME
                            </button>
                        </header>

                        <main className="main-content">
                            {selectedCategory && !event ? (
                                <div style={{ animation: 'fadeIn 0.5s ease' }}>
                                    <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#fff' }}>
                                        SELECT A {selectedCategory.toUpperCase()} EVENT
                                    </h2>
                                    <div className="layout-grid">
                                        {allEvents
                                            .filter(evt => evt.category?.toLowerCase() === selectedCategory.toLowerCase())
                                            .map(evt => (
                                                <div 
                                                    key={evt.id} 
                                                    className="card" 
                                                    onClick={() => setEvent(evt)} 
                                                    style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
                                                >
                                                    <h3 style={{ color: selectedCategory === 'technical' ? '#00f6ff' : '#ffcc00' }}>{evt.eventName}</h3>
                                                    <p>📍 {evt.venue}</p>
                                                    <p>💰 ₹{evt.ticketPrice}</p>
                                                    <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '10px' }}>Click to view instructions & register</p>
                                                    <button style={{ marginTop: '15px', pointerEvents: 'none' }}>Select Event</button>
                                                </div>
                                            ))
                                        }
                                        {allEvents.filter(evt => evt.category?.toLowerCase() === selectedCategory.toLowerCase()).length === 0 && (
                                            <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center' }}>
                                                <p>No events found in this category. Check your Cloud Database.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                                    <button 
                                        onClick={() => setEvent(null)} 
                                        style={{ marginBottom: '20px', width: 'auto', background: 'transparent', border: '1px solid #fff', fontSize: '0.8rem' }}
                                    >
                                        ← BACK TO {selectedCategory.toUpperCase()} LIST
                                    </button>
                                    <BookingForm event={event} onBookingSuccess={refreshData} />
                                </div>
                            )}
                        </main>
                    </>
                )}
            </div>
        </div>
    );
};

function App() {
    const [allEvents, setAllEvents] = useState([]);
    const [showAdmin, setShowAdmin] = useState(false); 
    const [isAdminAuth, setIsAdminAuth] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true; 
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/events`);
                if (response.ok) {
                    const data = await response.json();
                    if (isMounted) {
                        setAllEvents(data);
                        setError(null);
                    }
                } else {
                    if (isMounted) setError("Failed to load events.");
                }
            } catch (err) {
                // RECTIFIED: Logging the error to satisfy 'no-unused-vars'
                console.error("Fetch Error Details:", err);
                if (isMounted) setError("Connection Error: Backend Offline.");
            }
        };
        fetchData();
        return () => { isMounted = false; }; 
    }, []);

    const refreshData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/events`);
            const data = await response.json();
            setAllEvents(data);
        } catch (e) {
            // RECTIFIED: Using 'e' to satisfy ESLint
            console.error("Refresh failed:", e);
        }
    };

    return (
        <Router>
            <Routes>
                {/* Main Portal Route */}
                <Route path="/" element={
                    <MainPortal 
                        allEvents={allEvents} 
                        refreshData={refreshData} 
                        error={error}
                        showAdmin={showAdmin}
                        setShowAdmin={setShowAdmin}
                        isAdminAuth={isAdminAuth}
                        setIsAdminAuth={setIsAdminAuth}
                    />
                } />

                {/* Verification Route for QR Scans */}
                <Route path="/verify/:id" element={<VerifyTicket />} />
            </Routes>
        </Router>
    );
}

export default App;