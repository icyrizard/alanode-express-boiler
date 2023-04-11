import AWS from "aws-sdk";
import BaseStorageDriver from "./BaseStorageDriver";
import { UploadedFile } from "express-fileupload";
import * as fs from "fs";

export default class S3Driver extends BaseStorageDriver {
    private s3: AWS.S3;

    constructor() {
        super();

        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            sslEnabled: true,
            s3ForcePathStyle: false,
            signatureVersion: 'v4',
            region: "eu-central-1",
        });
    }

    public async getPath(path: string) {
        return this.getPresignedUrl(path);
    }

    public async getPresignedUrl(fullPath: string) {
        return this.s3.getSignedUrl('getObject', {
            Bucket: process.env.AWS_BUCKET,
            Key: fullPath,
            Expires: 60, // seconds
        });
    }

    async moveFile(destFilePath:string, filePath) {
        const buffer = fs.readFileSync(filePath);

        const result = await this.s3.putObject({
            Bucket: process.env.AWS_BUCKET,
            Key: destFilePath,
            Body: buffer,
        }, function(error) {
            if (error) {
                console.log('Failed uploading file: ', error)
                throw error;
            }
        });

        await fs.unlink(filePath, (err) => {
            if (err) {
                throw err;
            }

            console.log('Delete tmp file');
        });

        return result;
    }

    async putBuffer(destFilePath:string, buffer: Buffer) {
        return this.s3.putObject({
            Bucket: process.env.AWS_BUCKET,
            Key: destFilePath,
            Body: buffer,
        }, function(error) {
            if (error) {
                console.log('Failed uploading file: ', error)
                throw error;
            }
        });
    }

    async put(destFilePath:string, file: UploadedFile) {
        return this.s3.putObject({
            Bucket: process.env.AWS_BUCKET,
            Key: destFilePath,
            Body: file.data,
        }, function(error) {
            console.log('Failed uploading file: ', error)
        });
    }
}