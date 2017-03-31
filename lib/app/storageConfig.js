// Configuration for AWS S3
// var storageConfig = {
//   s3: {
//     s3Options: {
//       accessKeyId: process.env.AWS_S3_ACCESS_KEY,
//       secretAccessKey: process.env.AWS_S3_ACCESS_KEY_SECRET,
//       region: process.env.AWS_S3_REGION
//     },
//     bucket: "raincatcher-files"
//   }
// };

// Configuration for gridFss
var storageConfig = {
  gridFs: {
    mongoUrl: "mongodb://localhost:27017/files"
  }
};

module.exports = storageConfig;
