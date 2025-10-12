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

The server will start on <http://localhost:3000> by default. Visit that URL in your browser to see the splash page.

## Environment variables

You can override the default port by setting the `PORT` environment variable before starting the server. For example:

```bash
PORT=4000 npm start
```

This will serve the app at <http://localhost:4000>.

## License

SplashWebapp is available under the [Alfe AI License](./LICENSE).
