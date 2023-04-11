import FilesystemDriver from "./storage-drivers/FilesystemDriver";
import S3Driver from "./storage-drivers/S3Driver";
import { UploadedFile } from "express-fileupload";

require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'local'}` })

export default class StorageDriver {
    private driver: S3Driver | FilesystemDriver;

    constructor() {
        if (!process.env.FILESYSTEM_DRIVER) {
            throw Error('No filesystem driver specified');
        }

        if (process.env.FILESYSTEM_DRIVER === 's3') {
            this.driver = new S3Driver();
        }

        if (process.env.FILESYSTEM_DRIVER === 'local') {
            this.driver = new FilesystemDriver();
        }
    }

    public putBuffer(destPath: string, buffer: Buffer) {
        return this.driver.putBuffer(destPath, buffer)
    }

    public moveFile(destPath: string, stream) {
        return this.driver.moveFile(destPath, stream)
    }

    public put(destPath: string, file: UploadedFile) {
        return this.driver.put(destPath, file)
    }

    public getPath(destPath: string) {
        return this.driver.getPath(destPath)
    }
}

// application/pdf
//filesystem