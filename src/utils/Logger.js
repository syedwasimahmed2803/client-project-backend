// src/utils/logger.js
const Log = require('../models/Log');

const logIssue = async (message, ip, data = {}) => {
  try {
    await Log.create({ message, ip, data });
  } catch (err) {
    console.error('Failed to log issue:', err.message);
  }
};

module.exports = logIssue;
