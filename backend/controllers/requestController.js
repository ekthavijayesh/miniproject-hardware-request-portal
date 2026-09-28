const supabase = require('../config/db');

exports.createRequest = async (req, res) => {
  try {
    const { item, quantity, reason, urgency } = req.body;
    const userId = req.user.id;

    const { data: user } = await supabase
      .from('users')
      .select('request_limit')
      .eq('id', userId)
      .single();

    const { count: activeCount } = await supabase
      .from('requests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('status', ['pending', 'approved']);

    if (activeCount >= user.request_limit) {
      return res.status(400).json({ message: `Request limit (${user.request_limit}) reached` });
    }

    const { data: newRequest, error } = await supabase
      .from('requests')
      .insert([{ user_id: userId, item_id: item, quantity, reason, urgency }])
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  const { data, error } = await supabase
    .from('requests')
    .select('*, inventory_items(*)')
    .eq('user_id', req.user.id);

  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
};

exports.getAllRequests = async (req, res) => {
  const { data, error } = await supabase
    .from('requests')
    .select('*, users(*), inventory_items(*)');

  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
};

exports.approveRequest = async (req, res) => {
  const { data: request, error: reqErr } = await supabase
    .from('requests')
    .select('*, inventory_items(*)')
    .eq('id', req.params.id)
    .single();

  if (reqErr || !request) return res.status(404).json({ message: 'Not found' });

  if (request.inventory_items.available_stock < request.quantity) {
    return res.status(400).json({ message: 'Insufficient stock' });
  }

  await supabase
    .from('inventory_items')
    .update({ available_stock: request.inventory_items.available_stock - request.quantity })
    .eq('id', request.item_id);

  const { data: updated, error } = await supabase
    .from('requests')
    .update({ status: 'approved', decision_at: new Date() })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ message: error.message });
  res.json(updated);
};

exports.rejectRequest = async (req, res) => {
  const { remarks } = req.body;
  const { data, error } = await supabase
    .from('requests')
    .update({ status: 'rejected', admin_remarks: remarks, decision_at: new Date() })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
};