// src/db.ts
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
export const createTables = () => {
    const createTables = fs.readFileSync('../database/create.sql').toString();
    pool.query(createTables)
        .then((res: any) => {
            console.log(res);
            console.log('Tables created successfully');
        })
        .catch((err: any) => {
            console.log(err);
        });
};

//fill the tables with data (execute insert.sql which is in the folder database)
export const fillTables = () => {
    const insertTables = fs.readFileSync('../database/insert.sql').toString();
    pool.query(insertTables)
        .then((res : any) => {
            console.log(res);
            console.log('Tables filled successfully');
        })
        .catch((err : any) => {
            console.log(err);
        });
};

//function to query the database
export const query = (text: any, params: any) => pool.query(text, params);

