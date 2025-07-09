
const express = require('express');
const router = express.Router();
const multer = require('multer');
const DocumentService = require('../services/DocumentService');
const path = require('path');

const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, '../storage/documents');

const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // optional: limit file size
});

router.post('/', upload.single('document'), DocumentService.uploadDocument);
router.get('/', DocumentService.listDocuments);
router.get('/:filename/download', DocumentService.downloadDocument);

module.exports = router;
