import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// eslint-disable-next-line import/extensions
import config from './config/index.js';

// const s3 = new S3Client({ params: { Bucket: config.S3_BUCKET_NAME } });
const s3 = new S3Client({ region: 'eu-central-1' });

const uploadFile = async (fileContent, key) => {
    // Setting up S3 upload parameters
    const params = {
        Bucket: config.S3_BUCKET_NAME,
        Key: key, // File name you want to save as in S3
        Body: fileContent,
        ContentType: 'application/pdf',
    };

    // Uploading files to the bucket
    await s3.send(new PutObjectCommand(params));
    const fileUrl = `https://${config.S3_BUCKET_NAME}.s3.amazonaws.com/${encodeURIComponent(key)}`;
    return fileUrl;
};

// eslint-disable-next-line import/prefer-default-export
export { uploadFile };
