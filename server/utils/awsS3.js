const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// S3 configuration
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;


/**
 * Generate a pre-signed URL for uploading a file directly from the frontend.
 * @param {string} key - Key (name) of the file in S3.
 * @returns {Object} - Object containing the pre-signed URL 
 */
const generateUploadLink = async (key) => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: 'application/pdf',
            
        };

        // Generate a signed URL valid for 15 minutes
        const signedUrl = await getSignedUrl(s3, new PutObjectCommand(params), { expiresIn: 900 });

        return {
            uploadUrl: signedUrl,
        };

    } catch (err) {
        console.error('Error generating upload URL:', err);
        throw err;
    }
};

/**
 * Get a file from S3.
 * @param {string} key - Key (name) of the file in S3.
 * @returns {string} - Signed URL to download the file.
 */
const getFileUrl = async (key) => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
        };

        // Generate a signed URL valid for 60 minutes
        const signedUrl = await getSignedUrl(s3, new GetObjectCommand(params), { expiresIn: 3600 });
        return signedUrl;

    } catch (err) {
        console.error('Error getting file:', err);
        throw err;
    }
};

/**
 * Delete a file from S3.
 * @param {string} key - Key (name) of the file in S3.
 * @returns {boolean} - True if the file was deleted successfully else false.
 */
const deleteFile = async (key) => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
        };

        const result = await s3.send(new DeleteObjectCommand(params));
        if (result.$metadata.httpStatusCode === 204) {
            return true;
        }else{
            return false;
        }

    } catch (err) {
        console.error('Error deleting file:', err);
        throw err;
    }
};

module.exports = { generateUploadLink, getFileUrl, deleteFile };
