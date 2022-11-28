const express = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

// SIGN UP
authRouter.post('/api/signup', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    
    const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email telah terdaftar' });
      }
      
    const hashedPassword = await bcryptjs.hash(password, 8);
    let user = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// SIGN IN
authRouter.post('/api/signin', async (req, res) => {
  try{
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    
    // CHECK EMAIL
    if(!user) {
      return res.status(400).json({msg: 'Akun dengan email ini tidak terdaftar'});
    }

    // CHECK PASSWORD
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({msg: 'Password yang Anda masukkan salah'});
    }

    const token = jwt.sign({id: user._id}, 'passwordKeyChangedLater');
    res.json({
      token, ...user._doc
    });
  } catch (e) {
    res.status(500).json({error: e.message});
  }
});

// CHECK VALIDITY OF TOKEN
authRouter.post('/api/tokenIsValid', async (req, res) => {
  try{
   const token = req.header('x-auth-token');
   if (!token) return res.json(false);
   const verified = jwt.verify(token, 'passwordKeyChangedLater');
   if (!verified) return res.json(false);

  //  CHECK IF USER EXIST OR NOT
  const user = await User.findById(verified.id);
  if(!user) return res.json(false);

  res.json(true);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
});

// GET USER DATA
authRouter.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({...user._doc, token: req.token});
});

module.exports = authRouter;