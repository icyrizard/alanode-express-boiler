import { transformList } from "../lib/functions";
import { Media } from "@prisma/client";

export function MediaTransformer() {
    function transform<T>(media: Media) {
        return {
            id: media.id,
            fileName: media.fileName,
            mimeType: media.mimeType,
            originalFileName: media.originalFileName,
            size: media.size,
            src: `${process.env.CDN_URL}/${media.fullPath}`,
            url: `${process.env.CDN_URL}/url/${media.fullPath}`,
        }
    }

    return {
        transform,
        transformList: transformList(transform),
    }
}
