const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Authority = require('../models/authority');
const Citizen = require('../models/citizen');

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, password are required' });
    }
    const existing = await Authority.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Authority with this email already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const created = await Authority.create({ name, email, password: hashed });
    return res.status(201).json({ id: created._id, name: created.name, email: created.email });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to register authority' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }
    const found = await Authority.findOne({ email });
    if (!found) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, found.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }
    const token = jwt.sign({ sub: found._id.toString(), role: 'authority', email: found.email }, secret, { expiresIn: '7d' });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to login' });
  }
}

module.exports = { register, login };

// Authority-only: Create citizen directly without OTP
async function addCitizenDirect(req, res) {
  try {
    const role = req.user?.role;
    if (role !== 'authority') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const {
      name,
      reg_no,
      NID_no,
      Birth_Certificate_no,
      NID_or_Birth,
      gender,
      DOB,
      phone_number,
      vaccine_taken,
      vaccine_certificate_qr,
    } = req.body || {};

    if (!reg_no) {
      return res.status(400).json({ message: 'reg_no is required' });
    }

    const existing = await Citizen.findOne({ reg_no });
    if (existing) {
      return res.status(409).json({ message: 'Citizen with this reg_no already exists' });
    }

    const payload = {
      name,
      reg_no,
      NID_no,
      Birth_Certificate_no,
      NID_or_Birth,
      gender,
      DOB: DOB ? new Date(DOB) : undefined,
      phone_number,
      vaccine_certificate_qr,
    };

    if (Array.isArray(vaccine_taken)) {
      payload.vaccine_taken = vaccine_taken.map((v) => ({
        vaccine_id: v?.vaccine_id,
        vaccine_name: v?.vaccine_name,
        time_stamp: v?.time_stamp ? new Date(v.time_stamp) : undefined,
      })).filter((v) => v.vaccine_id && v.vaccine_name);
    }

    const created = await Citizen.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create citizen' });
  }
}

module.exports.addCitizenDirect = addCitizenDirect;