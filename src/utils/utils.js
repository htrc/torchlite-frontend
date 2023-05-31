// Simplified from:
// https://github.com/andrewmclagan/react-env/blob/master/packages/node/src/index.js

function isBrowser() {
  return Boolean(typeof window !== "undefined" && (window.__env || window.__appenv));
}

export function env(key = '') {
  if (!key.length) {
    throw new Error('No env key provided');
  }

  if (isBrowser()) {
    if (key in window.__appenv)
      return window.__appenv[key];

    return window.__env[key];
  }

  return process.env[key];
}