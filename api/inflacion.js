module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');
  try {
    // IPC Nacional Mensual (índice base diciembre 2016 = 100) — INDEC via datos.gob.ar
    const r = await fetch(
      'https://apis.datos.gob.ar/series/api/series/?ids=148.3_INUCLEADOS0_DICI_M_26&limit=60&format=json'
    );
    const data = await r.json().catch(() => null);
    if (!r.ok || !data) return res.status(r.status || 502).json({ error: 'upstream_error' });
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
