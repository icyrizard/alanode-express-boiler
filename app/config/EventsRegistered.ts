import { QueueEventHandler } from "../events/QueueEventHandler";
import { ScheduleEventHandler } from "../events/ScheduleEventHandler";
import { UserRegisteredEvent } from "../events/impl/UserRegisteredEvent";
import { UserRegisteredEventHandler } from "../events/handlers/UserRegisteredEventHandler";

export const ScheduleEventHandlers: Array<ScheduleEventHandler<any>> = [
    // new AvailabilityScheduleHandler('0 10 * * 4'),
];

export const EventHandlers = [
    new UserRegisteredEventHandler(),
];

export const QueueEventHandlers: Array<QueueEventHandler<any>> = [
    ...EventHandlers,
    ...ScheduleEventHandlers,
];
