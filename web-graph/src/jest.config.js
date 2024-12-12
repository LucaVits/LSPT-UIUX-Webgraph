module.exports = {
    transform: {
      "^.+\\.[tj]sx?$": "babel-jest"
    },
    transformIgnorePatterns: [
      "node_modules/(?!(d3|d3-array|d3-force|react-router-dom)/)"
    ],
  };
  