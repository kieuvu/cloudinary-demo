const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const upload = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      let resource_type = 'auto';

      if (file.mimetype.startsWith('image')) {
        resource_type = 'image';
      } else if (file.mimetype.startsWith('video')) {
        resource_type = 'video';
      }

      return {
        folder: 'uploads/',
        resource_type: resource_type,
        public_id: file.originalname.split('.')[0],
      };
    },
  })
});

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  res.json({ fileUrl: req.file.path, publicId: req.file.filename });
});

const port = process.env.APP_PORT;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
