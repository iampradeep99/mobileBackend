
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;

if (!JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Using fallback secret. Set JWT_SECRET in .env for production.');
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET || 'change_this_secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
      );

    const userObj = user.toObject();
    delete userObj.password;
    return res.json({ user: userObj, token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

      const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ email, password: hashed, name });
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({ user: userObj });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = { login, register };




