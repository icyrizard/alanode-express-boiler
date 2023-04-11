import { transformList } from "../lib/functions";
import { UserWithInclude } from "../types/DbTypes";

export function userTransformer() {
    const transform = (user: UserWithInclude) => {
        const conversions = user.profilePicture?.conversions;
        const thumbnail = conversions ? conversions.find(conversion => conversion.sizeName === 'thumbnail'): null;

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            lastActiveAt: user.lastActiveAt,
            profilePicture: user.profilePicture ? `${process.env.CDN_URL}/${user.profilePicture.fullPath}`: null,
            profilePictureThumbnail: thumbnail ? `${process.env.CDN_URL}/${thumbnail.fullPath}`: null,
        }
    }

    return {
        transform,
        transformList: transformList<UserWithInclude[]>(transform),
    }
}
