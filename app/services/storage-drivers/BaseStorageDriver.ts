import { UploadedFile } from "express-fileupload";

export default abstract class BaseStorageDriver {
    abstract put(destFilePath: string, File: UploadedFile);
    abstract get(fullPath);
    abstract getPath(destFilePath: string);
    abstract putBuffer(destFilePath: string, buffer);
    abstract moveFile(destFilePath: string, stream);
}
