const path = require('path');
const { override, addWebpackAlias } = require('customize-cra');

module.exports = override(
  addWebpackAlias({
    shared: path.resolve(__dirname, 'shared'),
  }),
  (config) => {
    config.resolve.symlinks = true; // Ensure symlinked directories are resolved
    return config;
  }
);
