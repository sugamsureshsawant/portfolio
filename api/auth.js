function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const password = body && body.password;
    if (!process.env.ADMIN_PASSWORD) {
      return json(res, 500, { error: 'ADMIN_PASSWORD is not configured in Vercel' });
    }
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return json(res, 401, { error: 'Invalid password' });
    }
    return json(res, 200, { ok: true });
  } catch (error) {
    return json(res, 400, { error: 'Invalid request' });
  }
};
