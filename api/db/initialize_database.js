//This file will generate the tables in the database and fill them with example data.

const db = require('./db');

db.createTables();
db.fillTables();