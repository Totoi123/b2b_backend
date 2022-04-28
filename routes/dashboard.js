const router = require("express").Router();
const authorize = require("../middlewares/authorize");
const pool = require("../db");

router.get("/", authorize, async (req, res) => {
  try {
    const admin = await pool.query(
      "SELECT * FROM admin WHERE admin_id = $1",
      [req.admin.id] 
    ); 
    
 
    
    res.json(admin.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;