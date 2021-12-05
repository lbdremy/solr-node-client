module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      {
        pattern: 'test/**/*.ts',
        type: 'js'  // to silence the warning. Means load with <script> tag
      },
    ],
    reporters: ['progress'],
    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    autoWatch: false,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity,
  });
};
