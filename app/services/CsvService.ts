import base32 from "base32";
import crypto from "crypto";
import path from "path";
import * as fs from "fs";

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'local'}` })

export default class CsvService {
    constructor() {}

    async writeFile(header, records) {
        const tmpFileName = base32.encode(crypto.randomBytes(15)).toUpperCase();
        const tmpFilePath = (process.env.TMP_STORAGE ?? 'storage/tmp') + `/${tmpFileName}.csv`

        fs.mkdirSync(path.dirname(tmpFilePath), {recursive: true});

        const csvWriter = createCsvWriter({
            path: tmpFilePath,
            header: header,
        });

        await csvWriter.writeRecords(records);

        return tmpFilePath;
    }
}