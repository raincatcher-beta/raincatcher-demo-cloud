var storageConfig = {
  s3: {
    s3Options: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_ACCESS_KEY_SECRET,
      region: process.env.AWS_S3_REGION
    },
    bucket: "raincatcher-files"
  }
};

module.exports = storageConfig;
