const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API to get all table names and their row counts
app.get('/tables', async (req, res) => {
    try {
        const tables = [
            'Users', 'Orders', 'Drones', 'Warehouses', 'Routes', 'Deliveries',
            'Payments', 'Feedback', 'MaintenanceLogs', 'Analytics', 'Notifications', 'OrderItems'
        ];
        const tableData = [];
        for (const table of tables) {
            const result = await pool.query(`SELECT COUNT(*) FROM "${table}"`);
            tableData.push({ name: table, count: parseInt(result.rows[0].count) });
        }
        res.json(tableData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// API to get data from a specific table
app.get('/table/:name', async (req, res) => {
    const tableName = req.params.name;
    const validTables = [
        'Users', 'Orders', 'Drones', 'Warehouses', 'Routes', 'Deliveries',
        'Payments', 'Feedback', 'MaintenanceLogs', 'Analytics', 'Notifications', 'OrderItems'
    ];
    if (!validTables.includes(tableName)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }
    try {
        const result = await pool.query(`SELECT * FROM "${tableName}"`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});