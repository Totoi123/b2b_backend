const pool = require('../db');

const router = require('express').Router();
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    try {
        const { id } = req.body;
        const clients = await pool.query('SELECT * FROM clients WHERE created_by = $1 ', [id]);
        console.log(clients.rows);
        return res.status(200).json(clients.rows);
        
        
    } catch (error) {
        res.status(500).json({ error : error.message });
    }
})

router.post('/register', async (req, res) => {

    try {
        const { firstName, lastName, email, phone, companyName, password, createdBy } = req.body;

    const client = await pool.query('SELECT * FROM clients WHERE email = $1', [email]);

    if (client.rows.length !== 0) {
        return res.status(401).json('User already exists');

        
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

        const newClient = await pool.query('INSERT INTO clients (first_name , last_name , company_name , email , password , created_by, phone) VALUES ($1, $2, $3, $4, $5 , $6, $7) returning *', [firstName, lastName, companyName, email, hashedPassword, createdBy, phone]);
        const response = newClient.rows[0];

    return res.status(200).json({message:"Client added successfully", response});
        
    } catch (error) {
        res.status(500).send('Server error');
        console.log(error.message);
    }
   
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const client = await pool.query('SELECT * FROM clients WHERE email= $1', [email]);

    if (client.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
        
    }
})

// router.delete('/delete', (req, res) => {
//     try {
        
        
//     } catch (error) {
//         res.status(500).send('Server error');
//         console.log(error.message);
//     }
// })


module.exports = router