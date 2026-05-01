const path = require('path');
const rnResolver = require('react-native/jest/resolver');

const emptyModule = path.join(__dirname, '__mocks__', 'emptyModule.js');

module.exports = (request, options) => {
  // expo/src/winter/index.ts does `import './runtime'`, which Haste resolves to
  // runtime.native.ts because defaultPlatform is 'ios'. That file installs lazy
  // getters that call require() outside jest-runtime's active module context,
  // which throws "outside of scope". Redirect it to a no-op.
  if (request === './runtime' && options.basedir && options.basedir.includes('expo/src/winter')) {
    return emptyModule;
  }
  return rnResolver(request, options);
};
