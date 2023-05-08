import { prisma } from "../../database/PrismaClient";

export abstract class AppEvent {
    static className() {
        return 'AppEvent';
    }
}
