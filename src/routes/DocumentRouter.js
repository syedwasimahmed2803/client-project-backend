
const express = require('express');
const router = express.Router();
const multer = require('multer');
const DocumentService = require('../services/DocumentService');

const upload = multer({ dest: '/home/your-username/secure-documents' }); // temp path, managed in storage

router.post('/', upload.single('document'), DocumentService.uploadDocument);
router.get('/', DocumentService.listDocuments);
router.get('/:filename/download', DocumentService.downloadDocument);

module.exports = router;
