import { s3 } from '../config/awsConfig.js';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Upload to S3 using Multer
export const uploadFile = (folder) =>
    multer({
        storage: multerS3({
            s3: s3,
            bucket: process.env.S3_BUCKET_NAME,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function (req, file, cb) {
                const fileName = `${Date.now()}-${file.originalname}`;
                cb(null, `${folder}/${fileName}`);
            }
        }),
        fileFilter: function (req, file, cb) {
            const allowedMimeTypes = {
                documents: ['application/pdf'],
                images: ['image/jpeg', 'image/png', 'image/jpg']
            };

            if (
                (folder === 'documents' && allowedMimeTypes.documents.includes(file.mimetype)) ||
                (folder === 'images' && allowedMimeTypes.images.includes(file.mimetype))
            ) {
                cb(null, true);
            } else {
                cb(new Error(`Invalid file type for ${folder}. Allowed: ${allowedMimeTypes[folder].join(', ')}`), false);
            }
        },
        limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file size
    });
