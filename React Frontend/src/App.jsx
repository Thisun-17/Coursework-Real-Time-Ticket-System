import React, { useEffect, useState } from 'react';
import apiService from "./services/api";

// Component to test backend connection
const ConnectionTest = () => {
    const [connectionStatus, setConnectionStatus] = useState('Checking connection...');

    useEffect(() => {
        const testConnection = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/test`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setConnectionStatus('Backend connected successfully');
            } catch (err) {
                setConnectionStatus(`Connection error: ${err.message}`);
                console.error('Connection error:', err);
            }
        };

        testConnection();
    }, []);

    return (
        <div className="bg-gray-100 p-4 mb-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
            <p className={connectionStatus.includes('error') ? 'text-red-500' : 'text-green-500'}>
                {connectionStatus}
            </p>
        </div>
    );
};

function App() {
    // State management for tickets and errors
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch tickets when component mounts
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const data = await apiService.getAllTickets();
                setTickets(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    // Handler for adding new tickets
    const addTicket = async () => {
        try {
            const newTicket = {
                status: 'new',
                timestamp: new Date().toISOString()
            };
            const addedTicket = await apiService.createTicket(newTicket);
            setTickets(prevTickets => [...prevTickets, addedTicket]);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    // Format timestamp for better readability
    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="container mx-auto p-4">
            {/* Application Header */}
            <h1 className="text-3xl font-bold mb-6">Ticket Management System</h1>

            {/* Connection Test Component */}
            <ConnectionTest />

            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Add Ticket Button */}
            <button
                onClick={addTicket}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
                Add New Ticket
            </button>

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-4">Loading tickets...</div>
            ) : (
                /* Tickets List */
                <ul className="space-y-2">
                    {tickets.map(ticket => (
                        <li
                            key={ticket.id}
                            className="border p-4 rounded hover:bg-gray-50"
                        >
                            <span className="font-semibold">Status: </span>
                            <span className={`inline-block px-2 py-1 rounded ${
                                ticket.status === 'new' ? 'bg-green-200' : 'bg-gray-200'
                            }`}>
                                {ticket.status}
                            </span>
                            <span className="ml-4 text-gray-600">
                                Created: {formatTimestamp(ticket.timestamp)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;