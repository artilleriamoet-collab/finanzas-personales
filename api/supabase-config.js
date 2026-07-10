module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return res.status(503).json({ error: 'not_configured' });
  res.status(200).json({ url, key });
};
