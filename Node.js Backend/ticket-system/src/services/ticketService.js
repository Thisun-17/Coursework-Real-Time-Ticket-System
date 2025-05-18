// ticketService.js
import pool from './db.config.js';

const ticketService = {
    // Create a new ticket
    createTicket: async (ticketData) => {
        try {
            const [result] = await pool.execute(
                'INSERT INTO tickets (status, timestamp) VALUES (?, ?)',
                [ticketData.status, ticketData.timestamp]
            );

            // Fetch the created ticket
            const [ticket] = await pool.execute(
                'SELECT * FROM tickets WHERE id = ?',
                [result.insertId]
            );

            return ticket[0];
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw new Error('Failed to create ticket');
        }
    },

    // Get all tickets
    getAllTickets: async () => {
        try {
            const [rows] = await pool.execute('SELECT * FROM tickets ORDER BY timestamp DESC');
            return rows;
        } catch (error) {
            console.error('Error fetching tickets:', error);
            throw new Error('Failed to fetch tickets');
        }
    },

    // Get a single ticket by ID
    getTicketById: async (id) => {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM tickets WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('Error fetching ticket:', error);
            throw new Error('Failed to fetch ticket');
        }
    },

    // Update a ticket
    updateTicket: async (id, ticketData) => {
        try {
            await pool.execute(
                'UPDATE tickets SET status = ? WHERE id = ?',
                [ticketData.status, id]
            );

            // Fetch the updated ticket
            const [rows] = await pool.execute(
                'SELECT * FROM tickets WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('Error updating ticket:', error);
            throw new Error('Failed to update ticket');
        }
    },

    // Delete a ticket
    deleteTicket: async (id) => {
        try {
            const [result] = await pool.execute(
                'DELETE FROM tickets WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting ticket:', error);
            throw new Error('Failed to delete ticket');
        }
    },

    // Get ticket statistics
    getTicketStats: async () => {
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
                FROM tickets
            `);
            return rows[0];
        } catch (error) {
            console.error('Error fetching ticket stats:', error);
            throw new Error('Failed to fetch ticket statistics');
        }
    }
};

export default ticketService;