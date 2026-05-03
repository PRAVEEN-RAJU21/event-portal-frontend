import React, { useState } from 'react';
import { jsPDF } from "jspdf"; 

const TicketView = ({ booking, event, onBack }) => {
    const [ticketNo] = useState(() => {
        const timePart = Date.now().toString().slice(-5);
        const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
        return `TKT-${timePart}-${randomPart}`;
    });

    const isTechnical = event.category?.toLowerCase() === 'technical';
    const hubLabel = isTechnical ? "TECHNICAL HUB" : "NON-TECHNICAL HUB";
    const accentColor = isTechnical ? "#00f6ff" : "#ffcc00";

    // RECTIFIED: This link connects the physical ticket to your live Verification UI
    const verificationUrl = `https://event-portal-frontend-six.vercel.app/verify/${booking.id}`;

    const downloadPDF = () => {
        const doc = new jsPDF();
        
        doc.setTextColor(0, 0, 0);

        // 1. Header
        doc.setFontSize(22);
        doc.text("CAMPUS EVENT PORTAL", 105, 20, { align: "center" });

        // 2. Official Branding
        doc.setFontSize(14);
        doc.text("OFFICIAL ENTRY PASS", 105, 30, { align: "center" });
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        // 3. Ticket Data
        doc.setFontSize(12);
        doc.text(`TICKET NO: ${String(ticketNo)}`, 20, 50);
        doc.text(`EVENT: ${String(event.eventName || 'N/A')}`, 20, 60);
        doc.text(`ATTENDEE: ${String(booking.attendeeName || 'N/A')}`, 20, 70);
        doc.text(`VENUE: ${String(event.venue || 'TBA')}`, 20, 80);
        doc.text(`DATE: ${String(event.eventDate || 'N/A')}`, 20, 90);
        doc.text(`CATEGORY: ${String(hubLabel)}`, 20, 100);

        // 4. Instructions Section
        doc.line(20, 110, 190, 110);
        doc.setFontSize(14);
        doc.text("INSTRUCTIONS:", 20, 120);
        
        doc.setFontSize(10);
        const instr = event.instructions || "Please report to the venue 15 minutes early.";
        const splitInstr = doc.splitTextToSize(instr, 170);
        doc.text(splitInstr, 20, 130);

        // 5. Footer
        doc.setFontSize(8);
        doc.text(`Developed by Raju Praveen Kumar Reddy`, 105, 280, { align: "center" });
        doc.text(`VEL TECH UNIVERSITY - ${hubLabel}`, 105, 285, { align: "center" });

        // 6. Save
        doc.save(`${event.eventName || 'Event'}_Ticket.pdf`);
    };

    return (
        <div className="card ticket-container" style={{ padding: '30px', textAlign: 'left', animation: 'fadeIn 0.8s ease-out' }}>
            <h3 style={{ color: '#00ff00' }}>🎉 Booking Confirmed!</h3>
            <hr style={{ opacity: 0.2, margin: '20px 0' }} />
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                <div style={{ lineHeight: '2.2', color: '#fff', fontSize: '15px', flex: '1 1 250px' }}>
                    <p><strong>Ticket No:</strong> <span style={{color: accentColor}}>{ticketNo}</span></p>
                    <p><strong>Attendee:</strong> {booking.attendeeName}</p>
                    <p><strong>Event:</strong> {event.eventName}</p>
                    <p><strong>Venue:</strong> {event.venue}</p>
                </div>

                <div className="qr-section">
                    <img 
                        // RECTIFIED: The QR code now points to the live verification link
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`} 
                        alt="Verification QR Code" 
                        style={{ border: `3px solid ${accentColor}`, borderRadius: '10px', padding: '5px', background: '#fff' }}
                    />
                    <p style={{ fontSize: '10px', color: '#666', marginTop: '5px', textAlign: 'center' }}>Scan to Verify</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                <button onClick={downloadPDF} style={{ flex: 1, background: '#00ff00', color: '#000', fontWeight: 'bold' }}>
                    ⬇️ DOWNLOAD PDF
                </button>
                <button onClick={onBack} style={{ flex: 1, background: 'transparent', color: '#fff', border: '1px solid #fff' }}>
                    BACK
                </button>
            </div>

            <footer style={{ marginTop: '40px', textAlign: 'center', opacity: 0.5, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                <p style={{ fontSize: '12px' }}>Developed by <strong>Raju Praveen Kumar Reddy</strong></p>
                <p style={{ fontSize: '10px', color: accentColor }}>{hubLabel} | UNIVERSITY EVENT MANAGEMENT</p>
            </footer>
        </div>
    );
};

export default TicketView;