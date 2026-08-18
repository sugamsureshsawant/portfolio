const { put, list, del } = require('@vercel/blob');

const DATA_PATH = 'certificates/data.json';

async function readData() {
  const result = await list({ prefix: DATA_PATH, limit: 1 });
  if (!result.blobs.length) return [];
  const response = await fetch(result.blobs[0].url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to read certificate data');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

async function writeData(certs) {
  await put(DATA_PATH, JSON.stringify(certs), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
    cacheControlMaxAge: 0,
  });
}

function authorized(req) {
  const expected = process.env.ADMIN_PASSWORD;
  const supplied = req.headers['x-admin-password'];
  return Boolean(expected && supplied && supplied === expected);
}

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const certs = await readData();
      return json(res, 200, certs);
    }

    if (!authorized(req)) {
      return json(res, 401, { error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body || !body.name || !body.issuer || !/^\d{4}$/.test(String(body.year))) {
        return json(res, 400, { error: 'Name, issuer and 4-digit year are required' });
      }

      const cert = {
        id: body.id || Date.now() + '_' + Math.random().toString(36).slice(2),
        name: String(body.name),
        issuer: String(body.issuer),
        year: String(body.year),
        category: String(body.category || 'Security'),
        url: body.url || null,
        fileData: null,
      };

      if (body.file && body.file.data) {
        const match = String(body.file.data).match(/^data:([^;]+);base64,(.+)$/);
        if (!match) return json(res, 400, { error: 'Invalid file data' });
        const mime = match[1];
        const base64 = match[2];
        const bytes = Buffer.from(base64, 'base64');
        if (bytes.length > 3.5 * 1024 * 1024) {
          return json(res, 413, { error: 'Certificate file is too large. Keep it under 3.5 MB.' });
        }
        const safeName = (body.file.name || 'certificate').replace(/[^a-zA-Z0-9._-]/g, '_');
        const blob = await put(`certificates/files/${cert.id}-${safeName}`, bytes, {
          access: 'public',
          addRandomSuffix: false,
          contentType: mime,
        });
        cert.fileData = blob.url;
      }

      const certs = await readData();
      certs.push(cert);
      await writeData(certs);
      return json(res, 201, cert);
    }

    if (req.method === 'DELETE') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const certs = await readData();

      if (body && body.all === true) {
        for (const cert of certs) {
          if (cert.fileData) {
            try { await del(cert.fileData); } catch (_) {}
          }
        }
        await writeData([]);
        return json(res, 200, { ok: true });
      }

      if (!body || !body.id) return json(res, 400, { error: 'Certificate id is required' });
      const cert = certs.find(c => c.id === body.id);
      if (!cert) return json(res, 404, { error: 'Certificate not found' });

      if (cert.fileData) {
        try { await del(cert.fileData); } catch (_) {}
      }

      await writeData(certs.filter(c => c.id !== body.id));
      return json(res, 200, { ok: true });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: error.message || 'Server error' });
  }
};
