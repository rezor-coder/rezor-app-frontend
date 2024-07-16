const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    resolver: {
      sourceExts: ['js', 'json', 'ts', 'tsx', 'cjs'],
      extraNodeModules: {
        //   stream: require.resolve('readable-stream'),
        //   crypto: require.resolve('react-native-crypto-js'),
        //   http: require.resolve('@tradle/react-native-http'),
        //   https: require.resolve('https-browserify'),
        zlib: require.resolve('browserify-zlib'),
        //   _stream_transform: require.resolve('readable-stream/transform'),
      },
    },
  };

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
