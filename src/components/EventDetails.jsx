import React from 'react';

const EventDetails = ({ event }) => {
    if (!event) return <div className="loading">Loading event details...</div>;

    return (
        <div className="card event-details">
            <h2>{event.eventName}</h2>
            <p><strong>Name:</strong> {event.Name}</p>
            <p><strong>Department:</strong> {event.department}</p>
            <p><strong>Date & Time:</strong> {new Date(event.eventDate).toLocaleString()}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Ticket Price:</strong> ₹{event.ticketPrice}</p>
            <p>
                <strong>Status: </strong> 
                <span className={event.availableTickets > 0 ? "available" : "sold-out"}>
                    {event.availableTickets > 0 ? `${event.availableTickets} Tickets Available` : "Sold Out"}
                </span>
            </p>
        </div>
    );
};

export default EventDetails;