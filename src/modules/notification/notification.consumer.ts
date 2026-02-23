import amqp from "amqplib";
import { NotificationService } from "./notification.service";
import { emitNotification } from "../../config/socket";
import { config } from "../../config/env";

export const startNotificationConsumer = async () => {
  try {
    const connection = await amqp.connect(config.rabbitmq_url);

    const channel = await connection.createChannel();

    const queueName = "enrollment.created";

    await channel.assertQueue(queueName, {
      durable: true,
    });

    console.log(`📥 Listening: ${queueName}`);

    channel.consume(queueName, async (msg) => {
      if (!msg) return;

      try {
        const data = JSON.parse(msg.content.toString());

        const notification = await NotificationService.createNotification({
          title: "Enrollment Successful",
          message: "You have successfully enrolled in the course.",
          type: "ENROLLMENT",
          userId: data.studentId,
        });

        // Real-time emit
        emitNotification(data.studentId, notification);

        channel.ack(msg);
      } catch (err) {
        console.error("❌ Message processing failed");
        // no ack → message will retry
      }
    });
  } catch (err) {
    console.error("❌ RabbitMQ connection failed");
  }
};
