const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const router = require('express').Router();



router.get('/',  (req, res) => {
    jwt.verify(req.headers.token, process.env.JWT_SECRET, (err) => {
        if (err) {
            res.status(401).json('Unauthorized');
        } else {
            console.log('Success');
        }
    })
    

    
})

router.post('/register', async (req, res) => {
    try {
        const { adminName, adminEmail, adminPassword } = req.body
        
        const admin = await pool.query('SELECT * FROM ADMIN WHERE admin_email = $1', [adminEmail]);

        if (admin.rows.length !== 0) {
            return res.status(401).json('User already exists')
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds)

        const hashedAdminPassword = await bcrypt.hash(adminPassword, salt)
        
        const newAdmin = await pool.query('INSERT INTO admin (admin_name , admin_email , admin_password) VALUES ($1, $2, $3) RETURNING *', [adminName, adminEmail , hashedAdminPassword])
        
        const token = jwtGenerator(newAdmin.rows[0].admin_id)
        const adminData = newAdmin.rows[0]

        res.status(200).json({ token, adminData })
    } catch (error) {
        res.status(500).send('Server Error')
        console.log(error.message);
    }
})

router.post('/login', async (req, res) => {
    try {
        const { adminEmail, adminPassword } = req.body;
       

        const admin = await pool.query('SELECT * FROM admin WHERE admin_email = $1', [adminEmail])

        if (admin.rows.length === 0) {
            res.status(401).json('Invalid email or password')
            
        }

        const validPassword = await bcrypt.compare(adminPassword, admin.rows[0].admin_password)
        if (!validPassword) {
            return res.status(401).json('Invalid email or password');
            
        }

        const token = jwtGenerator(admin.rows[0].admin_id)
        const adminData = admin.rows[0]
        return res.json({ token, adminData })
        
        
    } catch (error) {
        res.status(500).send('Server Error');
        console.log(error.message);
    }
})

module.exports = router