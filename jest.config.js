module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest" 
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  };
  