const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express();

// midllewares

app.use(express.json());
app.use(cors());

app.use('/admin', require('./routes/auth'))
app.use('/client', require('./routes/client_auth'));
app.use('/dashboard', require('./routes/dashboard'))

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
    console.log(`Server started at http://192.168.29.30:${port}`);
})
