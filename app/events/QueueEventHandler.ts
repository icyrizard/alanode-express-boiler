import { prisma } from "../database/PrismaClient";
import { EventHandler } from "./EventHandler";
import { Queue } from "../services/Queue";

export abstract class QueueEventHandler<T> extends EventHandler<T>{
  protected queue: Queue;

  constructor() {
    super();
    this.queue = Queue.getInstance();
  }

  abstract jobHandler(job: any);

}