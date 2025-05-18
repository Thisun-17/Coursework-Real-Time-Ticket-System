// Essential imports for server functionality
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ticketRoutes from './src/routes/ticketRoutes.js';
import mysql from 'mysql2/promise';

// Load environment variables with explicit error checking
const envResult = dotenv.config();
if (envResult.error) {
    console.error('Failed to load environment variables:', envResult.error);
    process.exit(1); // Exit if we can't load essential configuration
}

// Verify required environment variables are present
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    process.exit(1);
}

// Create Express application
const app = express();

// Create database connection pool with explicit configuration logging
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

console.log('Initializing database connection with configuration:', {
    ...dbConfig,
    password: '[HIDDEN]' // Don't log the actual password
});

const pool = mysql.createPool(dbConfig);

// Enhanced CORS configuration for security
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to handle database connection errors
const dbConnectionCheck = async (req, res, next) => {
    try {
        await pool.query('SELECT 1');
        next();
    } catch (error) {
        console.error('Database connection check failed:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Database connection error',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Apply database connection check to all routes
app.use(dbConnectionCheck);

// Enhanced test route with comprehensive checking
app.get('/api/test', async (req, res) => {
    try {
        // Test database connection with a simple query
        const [result] = await pool.query('SELECT 1');

        // Send successful response with detailed information
        res.json({
            status: 'success',
            message: 'Connection successful!',
            serverTime: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            database: {
                connected: true,
                message: 'Database connection successful'
            }
        });
    } catch (error) {
        // Log detailed error information server-side
        console.error('Test route error:', error);

        // Send sanitized error response to client
        res.status(500).json({
            status: 'error',
            message: 'Server is running but database connection failed',
            serverTime: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            database: {
                connected: false,
                error: process.env.NODE_ENV === 'development' ? error.message : 'Database connection error'
            }
        });
    }
});

// Routes for ticket management
app.use('/api/tickets', ticketRoutes);

// Error handling middleware for unhandled routes
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.path
    });
});

// Enhanced global error handling middleware
app.use((error, req, res, next) => {
    // Log the full error for debugging
    console.error('Server error:', error);

    // Send an appropriate response based on environment
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
    });
});

// Start the server with comprehensive initialization checks
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
    console.log('\n=== Server Initialization ===');
    console.log(`Server is running on port ${PORT}`);
    console.log(`Accepting requests from: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

    // Test database connection on startup
    try {
        await pool.query('SELECT 1');
        console.log('✓ Database connection successful');
    } catch (error) {
        console.error('✗ Database connection failed:', error.message);
        console.log('Current database configuration:', {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            hasPassword: !!process.env.DB_PASSWORD
        });
    }
    console.log('=== Initialization Complete ===\n');
});

// Graceful shutdown handling
const gracefulShutdown = async () => {
    console.log('\nInitiating graceful shutdown...');

    try {
        await pool.end();
        console.log('Database connections closed');
        server.close(() => {
            console.log('Server shut down successfully');
            process.exit(0);
        });
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
};

// Handle various shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);