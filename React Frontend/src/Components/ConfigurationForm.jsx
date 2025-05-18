import React, { useState } from 'react';

const ConfigurationForm = ({ onSubmit }) => {
    const [config, setConfig] = useState({
        totalTickets: 100,
        ticketReleaseRate: 1000,  // in milliseconds
        customerRetrievalRate: 2000,  // in milliseconds
        maxTicketCapacity: 500
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(config);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-bold mb-4">Configuration Settings</h2>
            <form onSubmit={handleSubmit}>
                <div className="space-y-3">
                    <div className="flex flex-col">
                        <label htmlFor="totalTickets" className="mb-1">Total Tickets</label>
                        <input
                            type="number"
                            id="totalTickets"
                            name="totalTickets"
                            value={config.totalTickets}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            min="1"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="ticketReleaseRate" className="mb-1">Ticket Release Rate (ms)</label>
                        <input
                            type="number"
                            id="ticketReleaseRate"
                            name="ticketReleaseRate"
                            value={config.ticketReleaseRate}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            min="100"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="customerRetrievalRate" className="mb-1">Customer Retrieval Rate (ms)</label>
                        <input
                            type="number"
                            id="customerRetrievalRate"
                            name="customerRetrievalRate"
                            value={config.customerRetrievalRate}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            min="100"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="maxTicketCapacity" className="mb-1">Max Ticket Capacity</label>
                        <input
                            type="number"
                            id="maxTicketCapacity"
                            name="maxTicketCapacity"
                            value={config.maxTicketCapacity}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            min="1"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Apply Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConfigurationForm;