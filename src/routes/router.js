const express = require('express');
const router = express.Router();

const ClientRouter = require('./ClientRouter');
const HospitalRouter = require('./HospitalRouter');
const ProviderRouter = require('./ProviderRouter');
const AuthRouter = require('./AuthRouter'); 

router.use('/clients', ClientRouter);
router.use('/providers', ProviderRouter);
router.use('/hospitals', HospitalRouter);
router.use('/auth', AuthRouter); 

module.exports = router;
