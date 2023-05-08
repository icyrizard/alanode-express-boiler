import * as Events from "./config/EventsRegistered";
import { EventBus } from "./services/EventBus";
import { Queue } from "./services/Queue";
import { AppEvent } from "./events/impl/AppEvent";
import { QueueEventHandlers, ScheduleEventHandlers } from "./config/EventsRegistered";

async function bootstrap() {
    EventBus.getInstance().registerEvents(Events.EventHandlers);

    await Queue.getInstance().start();

    await Queue.getInstance().registerQueues<AppEvent>(QueueEventHandlers)
    await Queue.getInstance().resetSchedules<AppEvent>()
    await Queue.getInstance().registerSchedules<AppEvent>(ScheduleEventHandlers)
}

bootstrap();