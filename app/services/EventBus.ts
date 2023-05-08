import EventEmitter from "node:events";
import { AppEvent } from "../events/impl/AppEvent";
import { EventHandler } from "../events/EventHandler";

export class EventBus {
    private static instance: EventBus;
    private eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    public static getInstance(): EventBus {
        if (this.instance === undefined) {
            this.instance = new EventBus();
        }

        return this.instance;
    }

    public emit<T>(event: AppEvent) {
        const key = event.constructor.name

        this.eventEmitter.emit(key, event);
    }

    public registerEvents(events: EventHandler<any>[]): void {
        events.forEach((event) => {
            this.registerEvent(event);
        });
    }
    public registerEvent(event: EventHandler<any>): void {
        const key = event.getEventName();

        if (this.eventEmitter.listenerCount(key) > 0) {
            return;
        }

        this.eventEmitter.on(key, (input) => {
            event.execute(input)
        });
    }

    public deRegisterEvent(event): void {
        const key = event.constructor.name

        this.eventEmitter.removeListener(key, event.execute.bind(event));
    }
}