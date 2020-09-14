const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const signIn = (id) =>
  jwt.sign({ id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '10d' });

// @ dec signUp page
// POST /signup
router.post('/register', async (req, res) => {
  try {
    const { email, userName, password } = req.body;

    // Check if the User exist
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ status: 'error', message: 'This User is all ready exist!' });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({ email, userName, password: hash }, (err, user) => {
      if (err)
        return res.status(500).json({
          status: 'error',
          message: err.message,
        });
      // Create Token
      let token = signIn(user.id);
      res.cookie('token', token, { httpOnly: true });
      res.status(200).json({
        status: 'success',
        auth: true,
        token,
      });
    });
  } catch (err) {
    console.error('💣💣💣', err.message);
  }
});

// @ dec Login page
// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw Error('Incorrect email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw Error('Incorrect email or password');
    }

    // Create Token
    let token = signIn(user.id);

    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({
      status: 'success',
      auth: true,
      token,
    });
  } catch (err) {
    console.error('💣💣💣', err.message);
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

// @ dec Dasboard page
// GET /dasboard
router.get('/dashboard', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({
        status: 'error',
        auth: false,
        message: 'Anauthorized, Please /login',
      });

    await jwt.verify(
      token,
      process.env.TOKEN_SECRET_KEY,
      async (err, decode) => {
        if (err)
          return res.status(500).json({
            auth: false,
            message: `Failed to authenticate token, ${err.message}`,
          });
        console.log(decode.id);
        const user = await await User.findById(decode.id, { password: 0 });
        return res.status(200).json({ status: 'success', auth: true, user });
      }
    );
  } catch (err) {
    console.error('💣💣💣', err.message);
  }
});

// @ dec Logout page
// GET /Logout
router.get('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true });
  res.status(200).json({ status: 'success', token: null });
});

module.exports = router;
