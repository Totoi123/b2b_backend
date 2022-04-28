const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtGenerator = (admin_id) => {
    const payload = {
        admin: {
            id: admin_id,
        }
    }

    return jwt.sign(payload , process.env.JWT_SECRET, {expiresIn: "1h"})
}

module.exports = jwtGenerator