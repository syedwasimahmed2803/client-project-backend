const fs = require('fs');
const path = require('path');
const secureDir = '/home/your-username/secure-documents';

class DocumentStorage {
  static saveFile(file) {
    return new Promise((resolve, reject) => {
      const targetPath = path.join(secureDir, file.originalname);
      fs.rename(file.path, targetPath, (err) => {
        if (err) return reject(err);
        resolve(file.originalname);
      });
    });
  }

  static listFiles() {
    return new Promise((resolve, reject) => {
      fs.readdir(secureDir, (err, files) => {
        if (err) return reject(err);
        resolve(files);
      });
    });
  }

  static getFileStream(filename) {
    const filePath = path.join(secureDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }
    return fs.createReadStream(filePath);
  }
}

module.exports = DocumentStorage;
