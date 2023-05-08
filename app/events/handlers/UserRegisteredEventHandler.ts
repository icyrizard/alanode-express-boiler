import { prisma } from "../../database/PrismaClient";
import EmailService from "../../services/EmailService";
import { Queue } from "../../services/Queue";
import { QueueEventHandler } from "../QueueEventHandler";
import { UserRegisteredEvent } from "../impl/UserRegisteredEvent";
import { WelcomeUserTemplate } from "../../templates/emails/WelcomeUserTemplate";
import { renderToStaticMarkup } from "react-dom/server";

export class UserRegisteredEventHandler extends QueueEventHandler<UserRegisteredEvent> {
  emailService: EmailService;
  queue: Queue;

  constructor() {
    super();

    this.emailService = new EmailService();
    this.queue = Queue.getInstance();
  }

  getEventName(): string {
    return UserRegisteredEvent.className();
  }

  async jobHandler(job) {
    const { userId } = job.data;

    const user = await prisma().user.findFirst({
      where: {
        id: userId,
      },
    });

    const html = renderToStaticMarkup(WelcomeUserTemplate({
      user,
    }))

    const emailTo = user.email;
    const emailFrom = "info@alanode.com";

    const subject = 'Welcome aboard!';

    await this.emailService.send({
      to: emailTo,
      from: emailFrom,
      subject: subject,
      html: html,
    });
  }

  async execute(input: UserRegisteredEvent) {
    const { user, context } = input;

    const jobId = await this.queue.send(this.getEventName(), {
      event: this.getEventName(),
      userId: user.id,
    });

    await this.queue.complete(jobId, {});
  }
}