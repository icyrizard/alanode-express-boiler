import PgBoss from "pg-boss";
import logger from "../common/logger";
import { QueueEventHandler } from "../events/QueueEventHandler";
import { ScheduleEventHandler } from "../events/ScheduleEventHandler";

require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'local'}` })

export class Queue {
    private static instance: Queue;
    private boss: PgBoss;

    constructor() {
        this.boss = new PgBoss(process.env.DATABASE_URL);
        this.boss.on('error', error => logger.error(error));
    }

    async onComplete(job) {
        const { data } = job;
    }

    public static getInstance(): Queue {
        if (this.instance === undefined) {
            this.instance = new Queue();
        }

        return this.instance;
    }

    public async registerQueues<T>(eventHandlers: QueueEventHandler<T>[]) {
        for (const eventHandler of eventHandlers) {
            await this.registerJobHandler(
                eventHandler.getEventName(), eventHandler.jobHandler.bind(eventHandler)
            );
        }
    }

    public async resetSchedules<T>() {
        const schedules = await this.boss.getSchedules()

        for (const schedule of schedules) {
            await this.boss.unschedule(schedule.name)
        }
    }

    public async registerSchedules<T>(eventHandlers: ScheduleEventHandler<T>[]) {
        for (const eventHandler of eventHandlers) {
            await this.registerSchedule(
                eventHandler.getEventName(),
                eventHandler.cron,
            );
        }
    }

    public async registerSchedule(queueName: string, cron: string) {
        await this.boss.schedule(queueName, cron, null, { tz: 'Europe/Amsterdam' })
    }

    public async registerJobHandler(queueName, handler) {
        await this.boss.work(queueName, handler);
        await this.boss.onComplete(queueName, this.onComplete.bind(this));
    }

    async start() {
        await this.boss.start();
    }

    async send(queue: string, data: any) {
        return await this.boss.send(queue, data, {
            startAfter: 1,
            retryLimit: 2,
            onComplete: true,
        });
    }

    async doWork(job: PgBoss.Job, handler: (job: PgBoss.Job) => void) {
        try {
            handler(job);
        } catch (error) {
            logger.error(error, {
                job: job,
            });

            await this.boss.fail(job.id, error)
        }
    }

    async complete(jobId: string, data: any) {
        return await this.boss.complete(jobId, data);
    }

    async work(queue: string, handler: (job: PgBoss.Job) => void) {
        return await this.boss.work(
            queue,
            (job) => this.doWork(job, handler));
    }
}