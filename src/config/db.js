// src/config/db.js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

module.exports = {
  mongoose,
  connection: mongoose.connection
};
