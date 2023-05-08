import { AppEvent } from "./AppEvent";
import { ApiContext } from "../../types/Requests";
import { User } from "@prisma/client";

export class UserRegisteredEvent extends AppEvent {
    constructor(public user: User, public context: ApiContext) {
        super();
    }

    static className(): string {
        return this.name;
    }
}