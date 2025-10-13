# SplashWebapp

SplashWebapp is a lightweight Express server that serves the static assets in the `public/` directory, including the `splash.html` landing page.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (to provide native support for ES modules)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

## Installation

From the project root, install the dependencies:

```bash
npm install
```

## Running the app

Start the development server:

```bash
npm start
```

By default the server exposes both HTTP and HTTPS endpoints on ports 80 and 443 respectively. Visit <http://localhost> or <https://localhost> to view the splash page.

### Running with a Let's Encrypt certificate

If you have already issued a certificate with Certbot (for example under `/etc/letsencrypt/live/alfe.sh/`), use the provided helper script to start SplashWebapp with the production key and certificate on the standard HTTP/HTTPS ports:

```bash
./run_with_cert.sh
```

The script defaults to the `alfe.sh` certificate directory but you can supply an alternate domain as the first argument, or override any of the exported environment variables:

```bash
# Use a different domain folder under /etc/letsencrypt/live
./run_with_cert.sh example.com

# Override individual settings
HOST=127.0.0.1 HTTP_PORT=8080 HTTPS_PORT=8443 ./run_with_cert.sh example.com
```

`run_with_cert.sh` verifies that the expected certificate files exist before launching the server and automatically wires the correct environment variables (`HTTPS_KEY_PATH`, `HTTPS_CERT_PATH`, and optional `HTTPS_CA_PATH`).

## Environment variables

The server can be configured with the following environment variables:

```bash
HTTP_PORT=8080 \   # Defaults to 80
HTTPS_PORT=8443 \  # Defaults to 443
HTTPS_KEY_PATH=./certs/server.key \    # Optional: path to a private key file
HTTPS_CERT_PATH=./certs/server.crt \   # Optional: path to a certificate file
HTTPS_CA_PATH=./certs/ca.crt \         # Optional: path to a CA bundle
HTTPS_PASSPHRASE=secret \              # Optional: passphrase for the private key
SSL_COMMON_NAME=example.com \          # Optional: CN when generating a self-signed cert
SSL_VALID_DAYS=365 \                   # Optional: validity when generating a self-signed cert
npm start
```

- When `HTTPS_KEY_PATH` and `HTTPS_CERT_PATH` are not provided, the server automatically generates a temporary self-signed certificate using the supplied `SSL_*` values (or sensible defaults).
- If you prefer to run on alternate ports (for example, in local development), override `HTTP_PORT` and `HTTPS_PORT`.

### Binding to privileged ports without `sudo`

Unix-like systems require elevated privileges to bind to ports below 1024. To allow Node.js to listen on ports 80 and 443 without prefixing `sudo` each time, grant the Node.js binary the `cap_net_bind_service` capability once:

```bash
sudo setcap 'cap_net_bind_service=+ep' $(which node)
```

After running the command above you can start the server normally with `npm start` and it will continue to bind to ports 80 and 443 without requiring `sudo`.

## License

SplashWebapp is available under the [Alfe AI License](./LICENSE).
