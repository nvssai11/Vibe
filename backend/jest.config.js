export default {
  transform: {},
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!(.*)/)'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
};