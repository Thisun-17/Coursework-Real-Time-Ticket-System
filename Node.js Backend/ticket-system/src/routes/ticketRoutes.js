import express from 'express';
import pool from '../database/database.js';

const router = express.Router();

// Route to get all tickets
// This endpoint retrieves all tickets from the database, sorted by newest first
router.get('/', async (req, res) => {
    try {
        // Using a formatted SELECT query to ensure consistent date formatting
        const [rows] = await pool.execute(`
            SELECT 
                id,
                status,
                DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') as timestamp,
                title,
                description,
                DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
            FROM tickets 
            ORDER BY timestamp DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching tickets:', error.message);
        // Send appropriate error response based on environment
        res.status(500).json({
            message: 'Error fetching tickets',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Route to create a new ticket
router.post('/', async (req, res) => {
    const { status, title, description } = req.body;

    // Enhanced input validation to check for both required fields
    if (!status || !title) {
        return res.status(400).json({
            message: 'Both status and title are required',
            missingFields: {
                status: !status,
                title: !title
            }
        });
    }

    try {
        // Insert the new ticket with proper validation
        const [result] = await pool.execute(
            'INSERT INTO tickets (status, title, description) VALUES (?, ?, ?)',
            [
                status,
                title,
                description || null
            ]
        );

        // Fetch and return the newly created ticket
        const [newTicket] = await pool.execute(`
            SELECT 
                id,
                status,
                title,
                description,
                DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') as timestamp,
                DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
            FROM tickets 
            WHERE id = ?
        `, [result.insertId]);

        // Return the new ticket with 201 Created status
        res.status(201).json(newTicket[0]);
    } catch (error) {
        console.error('Error adding ticket:', error.message);
        res.status(500).json({
            message: 'Error adding ticket',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Route to get a single ticket by ID
// This endpoint retrieves a specific ticket using its ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.execute(`
            SELECT 
                id,
                status,
                DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') as timestamp,
                title,
                description,
                DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
            FROM tickets 
            WHERE id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching ticket:', error.message);
        res.status(500).json({
            message: 'Error fetching ticket',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Route to update a ticket
// This endpoint handles updating ticket information with proper validation
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status, title, description } = req.body;

    // Validate that at least one field is being updated
    if (!status && !title && !description) {
        return res.status(400).json({
            message: 'At least one field (status, title, or description) is required for update'
        });
    }

    try {
        // Dynamically build the update query based on provided fields
        const updates = [];
        const values = [];

        if (status) {
            updates.push('status = ?');
            values.push(status);
        }
        if (title) {
            updates.push('title = ?');
            values.push(title);
        }
        if (description) {
            updates.push('description = ?');
            values.push(description);
        }

        values.push(id); // Add the ID for the WHERE clause

        // Execute the update query
        const [result] = await pool.execute(
            `UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Fetch and return the updated ticket
        const [updatedTicket] = await pool.execute(`
            SELECT 
                id,
                status,
                DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') as timestamp,
                title,
                description,
                DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
            FROM tickets 
            WHERE id = ?
        `, [id]);

        res.json(updatedTicket[0]);
    } catch (error) {
        console.error('Error updating ticket:', error.message);
        res.status(500).json({
            message: 'Error updating ticket',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Route to delete a ticket
// This endpoint handles the deletion of tickets
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute('DELETE FROM tickets WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        console.error('Error deleting ticket:', error.message);
        res.status(500).json({
            message: 'Error deleting ticket',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

export default router;
