module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
  try {
    const r = await fetch('https://criptoya.com/api/binance/usdt/ars');
    const data = await r.json().catch(() => null);
    if (!r.ok || !data) return res.status(r.status || 502).json({ error: 'upstream_error' });
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
