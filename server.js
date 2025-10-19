import fs from 'fs';
import http from 'http';
import https from 'https';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import selfsigned from 'selfsigned';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const publicDir = path.join(__dirname, 'public');

app.use((req, res, next) => {
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    return next();
  }

  const host = (req.headers.host || '').replace(/:\d+$/, '');
  if (host === 'alfe.sh') {
    return res.redirect(301, `https://alfe.sh${req.originalUrl}`);
  }

  return next();
});

app.use(express.static(publicDir));

app.get('/', (_req, res) => {
  res.sendFile(path.join(publicDir, 'splash.html'));
});

function resolvePort(value, fallback) {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

const httpPort = resolvePort(process.env.HTTP_PORT ?? process.env.PORT, 80);
const httpsPort = resolvePort(process.env.HTTPS_PORT, 443);
const host = process.env.HOST || '0.0.0.0';

function loadHttpsCredentials() {
  const keyPath = process.env.HTTPS_KEY_PATH;
  const certPath = process.env.HTTPS_CERT_PATH;
  const caPath = process.env.HTTPS_CA_PATH;
  const passphrase = process.env.HTTPS_PASSPHRASE;

  if (keyPath && certPath) {
    const credentials = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };

    if (caPath) {
      credentials.ca = fs.readFileSync(caPath);
    }

    if (passphrase) {
      credentials.passphrase = passphrase;
    }

    return credentials;
  }

  const attrs = [{ name: 'commonName', value: process.env.SSL_COMMON_NAME || 'localhost' }];
  const pems = selfsigned.generate(attrs, {
    days: Number(process.env.SSL_VALID_DAYS || 30),
    keySize: 2048,
  });

  console.warn('HTTPS_KEY_PATH and HTTPS_CERT_PATH were not provided. Using a self-signed certificate.');

  return { key: pems.private, cert: pems.cert };
}

function handleServerError(serverName, port) {
  return (error) => {
    if (error.code === 'EACCES') {
      console.error(`${serverName} failed to start on port ${port}: permission denied.`);
      if (port < 1024) {
        console.error(
          'Ports below 1024 require elevated privileges. Consider granting the Node.js binary the `cap_net_bind_service` capability using:\n' +
            "sudo setcap 'cap_net_bind_service=+ep' $(which node)"
        );
      }
      process.exit(1);
    }

    if (error.code === 'EADDRINUSE') {
      console.error(`${serverName} failed to start on port ${port}: address already in use.`);
      process.exit(1);
    }

    throw error;
  };
}

const httpServer = http.createServer(app);
httpServer.on('error', handleServerError('HTTP server', httpPort));

httpServer.listen(httpPort, host, () => {
  console.log(`SplashWebapp HTTP server listening on port ${httpPort}`);
});

const httpsCredentials = loadHttpsCredentials();
const httpsServer = https.createServer(httpsCredentials, app);
httpsServer.on('error', handleServerError('HTTPS server', httpsPort));

httpsServer.listen(httpsPort, host, () => {
  console.log(`SplashWebapp HTTPS server listening on port ${httpsPort}`);
});
