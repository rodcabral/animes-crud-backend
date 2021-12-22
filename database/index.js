import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql";

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
})

export { db }