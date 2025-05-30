const express = require('express');
const router = express.Router();

const ClientRouter = require('./ClientRouter');
const AuthRouter = require('./AuthRouter'); // New: auth routes

router.use('/clients', ClientRouter);
router.use('/auth', AuthRouter); // New: /auth/register, /auth/login

module.exports = router;
