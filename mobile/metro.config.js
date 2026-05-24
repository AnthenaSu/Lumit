const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// Ensure react-native-reanimated is NOT excluded from Babel transforms,
// so our babel.config.js private-field plugins can run on its source.
const { transformIgnorePatterns } = config.transformer
config.transformer.transformIgnorePatterns = [
  'node_modules/(?!(' +
    'react-native' +
    '|react-native-reanimated' +
    '|@react-native' +
    '|expo' +
    '|@expo' +
    '|@unimodules' +
    '|sentry-expo' +
    '|native-base' +
    ')/)',
]

module.exports = config
