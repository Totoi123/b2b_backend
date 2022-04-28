const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    password: 'autodesk234',
    host: 'localhost',
    port: 5432,
    database: 'b2b',
    
})

module.exports = pool;