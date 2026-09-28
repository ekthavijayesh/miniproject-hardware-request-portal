const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const requestLimit = role === 'staff' ? 5 : 2;

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashed, role, department, request_limit: requestLimit }])
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json({ message: 'User registered', userId: data.id });
  } catch (err) {
    res.status(400).json({ message: err.message });
}
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};