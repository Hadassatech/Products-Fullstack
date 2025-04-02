const mysql = require('mysql2/promise');
require('dotenv').config();
let pool;

//connection pool to MySQL
async function connectDB() {
    pool = await mysql.createPool({
        host: process.env.DB_HOST || 'mysql', 
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'productdb',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    console.log('MySQL connected');
}

// Return active connection pool
function getDB() {
    if (!pool) throw new Error('DB not connected');
    return pool;
}

module.exports = { connectDB, getDB };
