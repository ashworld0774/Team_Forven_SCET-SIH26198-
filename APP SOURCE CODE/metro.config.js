const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 3D Model Support
config.resolver.assetExts.push(
  'glb',
  'gltf',
  'obj',
  'mtl',
  'bin'
);

// Expo-three compatibility
config.resolver.unstable_enablePackageExports = false;

module.exports = config;