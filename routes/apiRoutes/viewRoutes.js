const express = require('express');
const connection = require('../../db/connection');
const router = express.Router();
require("console.table");



router.get('/departments', (req, res) => {
    const sql = `SELECT * FROM departments ORDER BY department_name`;

    connection.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Departments:',
            data: rows,
        });
    });
});


module.exports = router;