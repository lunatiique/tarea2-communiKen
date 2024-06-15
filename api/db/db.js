// src/db.js
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'communiken',
    password: '020202',
    port: 5432,
});

//function to create the tables in the database (execute create.sql which is in the folder database)
const createTables = () => {
    const createTables = fs.readFileSync('../../database/create.sql').toString();
    pool.query(createTables)
        .then((res) => {
            console.log(res);
            console.log('Tables created successfully');
        })
        .catch((err) => {
            console.log(err);
        });
};

//fill the tables with data (execute insert.sql which is in the folder database)
const fillTables = () => {
    const insertTables = fs.readFileSync('../../database/insert.sql').toString();
    pool.query(insertTables)
        .then((res) => {
            console.log(res);
            console.log('Tables filled successfully');
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports = {
    query: (text, params) => pool.query(text, params),
    createTables,
    fillTables
};


