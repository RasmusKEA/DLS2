import dotenv from 'dotenv';

const envFound = dotenv.config();

if (!envFound) {
    // This error should crash whole process
    throw new Error("Couldn't find .env file");
}

export default {
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
};
