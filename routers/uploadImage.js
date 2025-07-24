const multer = require("multer");
const path = require("path");
const { MulterAzureStorage } = require("multer-azure-blob-storage");
require("dotenv").config();

const resolveBlobName = (req, file) => {
  return new Promise((resolve, reject) => {
    const ext = path.extname(file.originalname);
    // 파일 이름 unique ( name + date + ext)
    const blobName = path.basename(file.originalname, ext) + Date.now() + ext;
    req.filename = blobName;
    resolve(blobName);
  });
};

const azureStoreage = new MulterAzureStorage({
  connectionString: process.env.SA_CONNECTION_STRING,
  accessKey: process.env.SA_KEY,
  // .env로 설정해도 됌. 컨테이너 이름
  containerName: "yangpa",
  blobName: resolveBlobName,
  containerAccessLevel: "blob",
});

const upload = multer({
  storage: azureStoreage,
  limits: { fileSize: 1024 * 1024 * 100 },
});

module.exports = upload;
