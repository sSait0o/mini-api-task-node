import User from '../models/userSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'change-this-secret';

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
      const existing = await User.findOne({ email }).lean();
      if (existing) return res.status(409).json({ error: 'User already exists' });
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hash, name });
  const userId = user._id.toString();
  const token = jwt.sign({ userId, email: user.email }, SECRET, { expiresIn: '7d' });
  return res.status(201).json({ token, user: { id: userId, email: user.email, name: user.name } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const userId = user._id.toString();
  const token = jwt.sign({ userId, email: user.email }, SECRET, { expiresIn: '7d' });
  return res.json({ token, user: { id: userId, email: user.email, name: user.name } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
}

export default AuthController;
