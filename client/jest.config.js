module.exports = {
    "collectCoverage" : true,
    'collectCoverageFrom': [
      "src/**/*.{js,jsx}",
      "!src/index.js",
      "!src/serviceWorker.js",
      "!src/aws-exports.js",
    ],
}