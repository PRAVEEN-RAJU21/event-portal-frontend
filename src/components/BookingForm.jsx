import React, { useState } from 'react';
import TicketView from './TicketView'; 
import PaymentModal from './PaymentModal';

// --- CLOUD CONFIGURATION ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const BookingForm = ({ event, onBookingSuccess }) => {
    // --- STATE MANAGEMENT ---
    const [members, setMembers] = useState(['']); 
    const [studentId, setStudentId] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [showPayment, setShowPayment] = useState(false); 
    const [confirmedBooking, setConfirmedBooking] = useState(null);

    // --- LOGIC BRIDGE ---
    const isGroup = event.isGroupEvent || event.groupEvent;
    const maxSize = event.maxGroupSize || event.max_group_size || 1;

    // --- DYNAMIC THEMING ---
    const isTechnical = event.category?.toLowerCase() === 'technical';
    const hubTitle = isTechnical ? "TECHNICAL HUB" : "NON-TECHNICAL HUB";
    const themeColor = isTechnical ? "#00f6ff" : "#ffcc00"; 

    // --- HELPER FUNCTIONS ---
    const triggerToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 4000);
    };

    const handlePhoneChange = (e) => {
        const val = e.target.value.replace(/\D/g, ''); 
        if (val.length <= 10) {
            setPhone(val);
        }
    };

    const addMember = () => {
        if (members.length < maxSize) {
            setMembers([...members, '']);
        } else {
            triggerToast(`Limit reached: Max ${maxSize} members allowed.`);
        }
    };

    const handleNameChange = (index, value) => {
        const updatedMembers = [...members];
        updatedMembers[index] = value;
        setMembers(updatedMembers);
    };

    const removeMember = (index) => {
        if (members.length > 1) {
            const updatedMembers = members.filter((_, i) => i !== index);
            setMembers(updatedMembers);
        }
    };

    const totalToPay = (event.ticketPrice * members.length).toFixed(2);

    // --- BACKEND INTEGRATION ---
    const handleFinalBooking = async () => {
        if (phone.length !== 10) {
            triggerToast("Please enter a valid 10-digit phone number.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            triggerToast("Please enter a valid official email address.");
            return;
        }

        setShowPayment(false);
        setLoading(true);

        const isFull = event.availableTickets < members.length;
        const bookingStatus = isFull ? 'WAITLISTED' : 'CONFIRMED';

        try {
            const bookingPayload = {
                eventId: event.id,
                userName: members.join(', '), 
                emailId: email,
                phoneNumber: phone,
                studentRollNo: studentId,
                userDepartment: event.department,
                ticketsBooked: members.length,
                totalAmount: parseFloat(totalToPay),
                status: bookingStatus 
            };

            // Using dynamic API_BASE_URL
            const response = await fetch(`${API_BASE_URL}/api/book`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingPayload)
            });

            if (response.ok) {
                const data = await response.json();
                setConfirmedBooking({ ...data, attendeeName: members.join(', ') });
                if (onBookingSuccess) onBookingSuccess();
            } else {
                triggerToast("ERROR: Server declined booking.");
            }
        } catch (error) {
            console.error("Technical Error Details:", error);
            triggerToast("CONNECTION ERROR: Is Backend running?");
        } finally {
            setLoading(false);
        }
    };

    if (confirmedBooking) {
        return (
            <div style={{ width: '100%', animation: 'fadeInUp 0.8s ease' }}>
                {toast && <div className="toast-container">✨ {toast}</div>}
                <h2 style={{ textAlign: 'center', color: themeColor, marginBottom: '20px', textTransform: 'uppercase' }}>
                    {confirmedBooking.status === 'WAITLISTED' ? "🕒 Waitlisted" : "🎟️ Registration Confirmed"}
                </h2>
                <TicketView booking={confirmedBooking} event={event} onBack={() => setConfirmedBooking(null)} />
            </div>
        );
    }

    return (
        <div style={{ width: '100%' }}>
            {toast && <div className="toast-container">🚀 {toast}</div>}

            <h1 style={{ textAlign: 'center', color: themeColor, fontSize: '2.8rem', fontWeight: '900', marginBottom: '40px', letterSpacing: '2px' }}>
                {hubTitle}
            </h1>

            <div className="layout-grid">
                <div className="card shadow-neon">
                    <h2 style={{ color: '#fff', fontSize: '1.8rem' }}>{event.eventName}</h2>
                    <p style={{ color: themeColor, fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '20px' }}>{event.category.toUpperCase()} MODULE</p>
                    <hr style={{ opacity: 0.1, margin: '20px 0' }} />
                    
                    <div style={{ lineHeight: '2', fontSize: '0.95rem' }}>
                        <p><strong>📍 VENUE:</strong> {event.venue}</p>
                        <p><strong>📅 DATE:</strong> {event.eventDate}</p>
                        <p><strong>🏢 DEPT:</strong> {event.department}</p>
                        <p><strong>👥 TYPE:</strong> {isGroup ? `Team (Max ${maxSize})` : "Solo Participation"}</p>
                        <p style={{ color: event.availableTickets > 0 ? '#00ff00' : '#ff4444', fontWeight: 'bold' }}>
                            ● {event.availableTickets > 0 ? `${event.availableTickets} Slots Available` : "Event Full"}
                        </p>
                    </div>

                    {event.instructions && (
                        <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: `4px solid ${themeColor}` }}>
                            <h4 style={{ color: themeColor, marginBottom: '8px', fontSize: '0.8rem' }}>📌 OFFICIAL GUIDELINES</h4>
                            <p style={{ fontSize: '0.8rem', opacity: 0.8, lineHeight: '1.6' }}>{event.instructions}</p>
                        </div>
                    )}
                </div>

                <div className="card shadow-neon">
                    <h3 style={{ color: themeColor, textAlign: 'center', marginBottom: '25px' }}>
                        {isGroup ? "TEAM ENTRY FORM" : "INDIVIDUAL PASS"}
                    </h3>
                    
                    <form onSubmit={(e) => { e.preventDefault(); setShowPayment(true); }}>
                        {members.map((name, index) => (
                            <div className="form-group" key={index} style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '0.7rem', color: '#888' }}>
                                    {index === 0 ? "LEAD PARTICIPANT" : `TEAM MEMBER ${index + 1}`}
                                </label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input 
                                        type="text" 
                                        value={name} 
                                        placeholder="Full Name"
                                        onChange={(e) => handleNameChange(index, e.target.value)} 
                                        required 
                                    />
                                    {index > 0 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeMember(index)}
                                            style={{ width: '45px', background: 'rgba(255,0,0,0.1)', color: '#ff4444', border: '1px solid #ff4444' }}
                                        >✕</button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isGroup && members.length < maxSize && (
                            <button 
                                type="button" 
                                onClick={addMember}
                                style={{ background: 'transparent', border: `1px dashed ${themeColor}`, color: themeColor, fontSize: '0.8rem', width: '100%', marginBottom: '20px' }}
                            >
                                + ADD MEMBER ({members.length}/{maxSize})
                            </button>
                        )}

                        <div className="form-group">
                            <label>REGISTRATION / ROLL NO</label>
                            <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>OFFICIAL EMAIL</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>CONTACT NUMBER</label>
                            <input 
                                type="tel" 
                                value={phone} 
                                onChange={handlePhoneChange} 
                                placeholder="10-digit mobile number"
                                required 
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ backgroundColor: themeColor, color: '#000', fontWeight: '900', marginTop: '10px', fontSize: '1rem' }}
                        >
                            {loading ? "INITIALIZING..." : `SECURE ${isGroup ? 'TEAM' : 'SOLO'} PASS (₹${totalToPay})`}
                        </button>
                    </form>
                </div>
            </div>

            {showPayment && (
                <PaymentModal 
                    amount={totalToPay} 
                    onPaymentSuccess={handleFinalBooking} 
                    onCancel={() => setShowPayment(false)} 
                />
            )}
        </div>
    );
};

export default BookingForm;