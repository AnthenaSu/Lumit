module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Transpile private class fields (#field) for Hermes compatibility.
      // babel-preset-expo 54 omits these for native, but react-native-reanimated
      // 4.x ships pre-compiled JS that uses them.
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-transform-private-property-in-object', { loose: true }],
      // Reanimated plugin must be last
      'react-native-reanimated/plugin',
    ],
  }
}
