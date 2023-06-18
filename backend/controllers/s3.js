const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

dotenv.config();

const s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_ACCESS_SECRET,
  },
});

exports.getPresignedURL = async (req, res) => {
  try {
    const { filename } = req.query;
    // const { filetype } = req.query;
    const encodedFileName = `${uuidv4()}-${filename}`;
    // console.log(`${filetype}`);

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: 'public/'+encodedFileName,
    });

    const presignedUrl = await getSignedUrl(s3,command, {expiresIn: 3600});

    res.json({ presignedUrl, encodedFileName});
    // console.log(presignedUrl);

  } catch (error) {
    console.error('PresignedURL 생성 오류:', error);
    res.status(500).json({ error: 'PresignedURL 생성 오류' });
  }
};
