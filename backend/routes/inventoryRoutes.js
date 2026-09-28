const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const supabase = require('../config/db');

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase.from('inventory_items').select('*');
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

router.post('/', auth, requireRole('admin'), async (req, res) => {
  const { data, error } = await supabase.from('inventory_items').insert([req.body]).select().single();
  if (error) return res.status(400).json({ message: error.message });
  res.status(201).json(data);
});

router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  const { data, error } = await supabase
    .from('inventory_items')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

module.exports = router;