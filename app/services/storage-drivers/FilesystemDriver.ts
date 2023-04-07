import * as fs from "fs";
import { writeFile } from "fs";
import path from 'path';
import BaseStorageDriver from "./BaseStorageDriver";

require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'local'}` })

export default class FilesystemDriver extends BaseStorageDriver {
    public async get(destFilePath: string) {
        return true;
    }

    public getPath(path: string) {
        return process.env.API_URL + '/storage/' + path;
    }

    public async moveFile(destFilePath:string, filePath) {
        const destUri = process.env.LOCAL_PATH_PREFIX + '/' + destFilePath;

        fs.mkdirSync(path.dirname(destUri), {recursive: true});

        await fs.rename(filePath, destUri, function (err) {
            if (err) {
                throw err
            }

            console.log('Successfully moved')
        })
    }

    public async putBuffer(destFilePath:string, buffer: Buffer) {
        const url = process.env.LOCAL_PATH_PREFIX + '/' + destFilePath;

        fs.mkdirSync(path.dirname(url), {recursive: true});

        return writeFile(url, buffer, function (err) {
            if (err) {
                throw err;
            }
        });
    }

    public async put(destFilePath:string, file) {
        const url = process.env.LOCAL_PATH_PREFIX + '/' + destFilePath;

        fs.mkdirSync(path.dirname(url), {recursive: true});

        // Use the mv() method to place the file somewhere on your server
        return file.mv(url, function (err) {
            if (err) {
                throw err;
            }
        });
    }

    public async remove(destFilePath:string) {
        return true;
    }

    public async exists(destFilePath:string) {
        return true;
    }

}