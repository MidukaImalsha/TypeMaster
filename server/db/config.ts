import { createPool } from "mysql2/promise";
require('dotenv').config();

const pool = createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER, // Replace with your MySQL username
    password: process.env.MYSQLPASSWORD, // Replace with your MySQL password
    database: process.env.MYSQLDATABASE,
    port: parseInt(process.env.MYSQLPORT || "3306"), // Default MySQL port is 3306
    waitForConnections: true,
    connectionLimit: 10, // Adjust as needed
    queueLimit: 0,
});

export default pool;
