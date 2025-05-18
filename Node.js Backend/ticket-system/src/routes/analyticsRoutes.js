// src/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
    res.json({ message: 'Analytics service is running' });
});

module.exports = router;