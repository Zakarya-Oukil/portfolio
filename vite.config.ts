import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function portfolioApiPlugin(): Plugin {
  const serverDir = path.resolve('server');
  const dataFile = path.join(serverDir, 'data.json');
  const messagesFile = path.join(serverDir, 'messages.json');
  const uploadsDir = path.resolve('public/uploads');

  if (!fs.existsSync(serverDir)) fs.mkdirSync(serverDir, { recursive: true });
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const readBody = (req: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (chunk: any) => { data += chunk; });
      req.on('end', () => resolve(data));
      req.on('error', reject);
    });
  };

  const sendJson = (res: any, data: any, status = 200) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end(JSON.stringify(data));
  };

  return {
    name: 'portfolio-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.end();
          return;
        }

        // POST /api/admin/login
        if (url.startsWith('/api/admin/login') && req.method === 'POST') {
          try {
            const bodyStr = await readBody(req);
            const { username, password } = JSON.parse(bodyStr);
            if (username === 'Zakarya2003' && password === 'Oukil26072003@') {
              return sendJson(res, {
                success: true,
                token: 'zakos_admin_token_' + Date.now(),
                user: { name: 'Zakarya Oukil', role: 'Superadmin' }
              });
            }
            return sendJson(res, { success: false, error: 'Invalid username or password. Access denied.' }, 401);
          } catch (err: any) {
            return sendJson(res, { error: err.message }, 500);
          }
        }

        // GET /api/portfolio-data
        if (url.startsWith('/api/portfolio-data') && req.method === 'GET') {
          try {
            if (fs.existsSync(dataFile)) {
              const content = fs.readFileSync(dataFile, 'utf8');
              return sendJson(res, JSON.parse(content));
            }
            return sendJson(res, { error: 'No data file found' }, 404);
          } catch (err: any) {
            return sendJson(res, { error: err.message }, 500);
          }
        }

        // POST /api/portfolio-data
        if (url.startsWith('/api/portfolio-data') && req.method === 'POST') {
          try {
            const bodyStr = await readBody(req);
            const parsed = JSON.parse(bodyStr);
            parsed.lastUpdated = new Date().toISOString();
            fs.writeFileSync(dataFile, JSON.stringify(parsed, null, 2), 'utf8');
            return sendJson(res, { success: true, message: 'Portfolio data updated successfully' });
          } catch (err: any) {
            return sendJson(res, { error: err.message }, 500);
          }
        }

        // POST /api/upload
        if (url.startsWith('/api/upload') && req.method === 'POST') {
          try {
            const bodyStr = await readBody(req);
            const { filename, base64, data } = JSON.parse(bodyStr);
            const rawBase64 = base64 || data;
            if (!filename || !rawBase64) {
              return sendJson(res, { error: 'Missing filename or base64 data' }, 400);
            }
            const cleanName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const buffer = Buffer.from(rawBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            fs.writeFileSync(path.join(uploadsDir, cleanName), buffer);
            return sendJson(res, { success: true, url: `/uploads/${cleanName}`, filename: cleanName });
          } catch (err: any) {
            return sendJson(res, { error: err.message }, 500);
          }
        }

        // GET /api/messages
        if (url.startsWith('/api/messages') && req.method === 'GET') {
          try {
            if (fs.existsSync(messagesFile)) {
              const content = fs.readFileSync(messagesFile, 'utf8');
              return sendJson(res, JSON.parse(content));
            }
            return sendJson(res, []);
          } catch (err: any) {
            return sendJson(res, { error: err.message }, 500);
          }
        }

        // POST /api/mail
        if (url.startsWith('/api/mail') && req.method === 'POST') {
          try {
            const bodyStr = await readBody(req);
            const { name, email, subject, message } = JSON.parse(bodyStr);
            let messages: any[] = [];
            if (fs.existsSync(messagesFile)) {
              messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
            }
            const newMsg = {
              id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              name: name || 'Anonymous',
              email: email || '',
              subject: subject || 'No Subject',
              message: message || '',
              timestamp: new Date().toISOString(),
              read: false,
            };
            messages.unshift(newMsg);
            fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');
            return sendJson(res, { success: true, message: 'Message sent successfully to Zakarya', id: newMsg.id });
          } catch (err: any) {
            return sendJson(res, { error: err.message }, 500);
          }
        }

        // POST /api/messages/delete
        if (url.startsWith('/api/messages/delete') && req.method === 'POST') {
          try {
            const bodyStr = await readBody(req);
            const { id } = JSON.parse(bodyStr);
            if (fs.existsSync(messagesFile)) {
              let messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
              messages = messages.filter((m: any) => m.id !== id);
              fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');
            }
            return sendJson(res, { success: true });
          } catch (err: any) {
            return sendJson(res, { error: err.message }, 500);
          }
        }

        // For /admin or client-side routes, pass through to SPA handler
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), portfolioApiPlugin()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
    ],
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    global: 'window',
  },
  server: {
    port: 3000,
    host: true,
  },
});
