const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const router = express.Router();

// @ dec signUp page
// POST /signup
router.post('/register', async (req, res) => {
  try {
    const { email, userName, password } = req.body;

    // Check if the User exist
    const user = await User.findOne({ email });
    if (user) {
      throw new Error('This User is all ready exist!');
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({ email, userName, password: hash }, (err, user) => {
      if (err)
        return res.status(500).json({
          status: 'error',
          message: 'There was a problem registering the user.',
        });
      // Create Token
      res.status(200).json({
        status: 'success',
        auth: true,
        token: '',
      });
    });
  } catch (err) {
    console.error('💣💣💣', err.message);
  }
  // res.json({ message: 'success' });
});

// @ dec Login page
// GET /login
// router.get('/login', (req, res) => {});

module.exports = router;
