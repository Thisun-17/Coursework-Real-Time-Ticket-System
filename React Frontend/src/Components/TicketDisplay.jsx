import React, { useEffect, useState } from 'react';
import apiService from '../services/api';

const TicketDisplay = () => {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const data = await apiService.getAllTickets();
                setTickets(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchTickets();
    }, []);

    if (error) {
        return <div>Error fetching tickets: {error}</div>;
    }

    if (!tickets.length) {
        return <div>Loading tickets...</div>;
    }

    return (
        <div>
            <h1>Tickets</h1>
            <ul>
                {tickets.map((ticket) => (
                    <li key={ticket.id}>
                        <strong>ID:</strong> {ticket.id} <strong>Status:</strong> {ticket.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TicketDisplay;
