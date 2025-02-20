module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/app/$1", // Adjust based on your actual structure
    },
    moduleDirectories: ["node_modules", "<rootDir>/"], // Helps Jest resolve modules
  };
  