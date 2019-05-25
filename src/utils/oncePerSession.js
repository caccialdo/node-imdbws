const SESSION_MS = 300e3; // 300 seconds

module.exports = (fn) => {
  let lastOutput;
  let lastTimestamp = 0;

  return (...args) => {
    if (lastTimestamp && Date.now() - lastTimestamp < SESSION_MS) {
      return lastOutput;
    }
    lastTimestamp = Date.now();
    lastOutput = fn(...args);
    return lastOutput;
  };
};
