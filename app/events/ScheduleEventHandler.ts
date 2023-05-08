import { QueueEventHandler } from "./QueueEventHandler";

export abstract class ScheduleEventHandler<T> extends QueueEventHandler<T>{
  private readonly _cron: string;

  constructor(cron: string) {
    super();
    this._cron = cron;
  }

  get cron(): string {
    return this._cron;
  }

  abstract jobHandler(job: any);

}