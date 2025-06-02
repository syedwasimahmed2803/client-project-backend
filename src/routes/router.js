const express = require('express');
const router = express.Router();

const UtilityRouter = require('./UtilityRouter');
const ClientRouter = require('./ClientRouter');
const HospitalRouter = require('./HospitalRouter');
const ProviderRouter = require('./ProviderRouter');
const AuthRouter = require('./AuthRouter'); 
const CaseRouter = require('./CaseRouter');

router.use('/cases', CaseRouter);
router.use('/clients', ClientRouter);
router.use('/providers', ProviderRouter);
router.use('/hospitals', HospitalRouter);
router.use('/utils', UtilityRouter);
router.use('/auth', AuthRouter); 

module.exports = router;
