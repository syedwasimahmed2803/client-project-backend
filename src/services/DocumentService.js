const DocumentStorage = require('../storage/DocumentStorage');

class DocumentService {
  static async uploadDocument(req, res) {
    try {
      const filename = await DocumentStorage.saveFile(req.file);
      res.json({ message: 'File uploaded successfully', filename });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  }

  static async listDocuments(req, res) {
    try {
      const files = await DocumentStorage.listFiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: 'Unable to list documents' });
    }
  }

  static async downloadDocument(req, res) {
    try {
      const fileStream = await DocumentStorage.getFileStream(req.params.filename);
      res.setHeader('Content-Disposition', `attachment; filename="${req.params.filename}"`);
      fileStream.pipe(res);
    } catch (error) {
      res.status(404).json({ error: 'Document not found' });
    }
  }
}

module.exports = DocumentService;
