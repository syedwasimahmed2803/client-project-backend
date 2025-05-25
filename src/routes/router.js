// src/routes/router.js
const express = require('express');
const router = express.Router();

const ClientRouter = require('./ClientRouter');

router.use('/clients', ClientRouter);

module.exports = router;
