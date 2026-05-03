import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const VerifyTicket = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verify = async () => {
            try {
                // Connecting to your Public API for mobile verification
                const response = await axios.get(`${API_BASE_URL}/api/public/verify/${id}`);
                setBooking(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Verification Error:", err);
                setError("Invalid Ticket or QR Code. Please check the attendee record.");
                setLoading(false);
            }
        };
        verify();
    }, [id]);

    if (loading) return (
        <div className="app-wrapper">
            <div className="glass-container" style={{ textAlign: 'center' }}>
                <p style={{ color: '#3b82f6' }}>🔍 AUTHENTICATING PASS...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="app-wrapper">
            <div className="glass-container" style={{ textAlign: 'center', padding: '50px', border: '2px solid #ff4444' }}>
                <h1 style={{ color: '#ff4444', fontSize: '3rem' }}>❌ INVALID</h1>
                <p style={{ color: '#ccc', marginTop: '10px' }}>{error}</p>
            </div>
        </div>
    );

    return (
        <div className="app-wrapper">
            <video autoPlay loop muted playsInline className="live-background">
                <source src="/videos/home.mp4" type="video/mp4" />
            </video>
            <div className="glass-container" style={{ textAlign: 'center', border: '2px solid #00ff00', animation: 'fadeIn 0.5s ease' }}>
                <h1 style={{ color: '#00ff00', fontSize: '3.5rem', fontWeight: '800' }}>VERIFIED ✅</h1>
                <h2 style={{ margin: '20px 0', color: '#fff', fontSize: '1.8rem' }}>{booking.eventName}</h2>
                
                <hr style={{ opacity: 0.1, margin: '20px 0' }} />
                
                <div style={{ textAlign: 'left', display: 'inline-block', fontSize: '16px', color: '#fff', lineHeight: '2' }}>
                    <p><strong>Attendee:</strong> {booking.userName}</p>
                    <p><strong>Email:</strong> {booking.emailId}</p>
                    <p><strong>Tickets:</strong> {booking.ticketsBooked}</p>
                    <p><strong>Status:</strong> <span style={{ color: '#00ff00', fontWeight: 'bold' }}>AUTHORIZED ENTRY</span></p>
                </div>
                
                <footer style={{ marginTop: '30px', opacity: 0.5, fontSize: '10px' }}>
                    VEL TECH UNIVERSITY EVENT PORTAL
                </footer>
            </div>
        </div>
    );
};

export default VerifyTicket;