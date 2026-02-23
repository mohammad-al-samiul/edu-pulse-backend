import { getChannel } from "./rabbitmq";

export const publishEvent = async (queueName: string, payload: unknown) => {
  const channel = getChannel();

  await channel.assertQueue(queueName, {
    durable: true,
  });

  const sent = channel.sendToQueue(
    queueName,
    Buffer.from(JSON.stringify(payload)),
    {
      persistent: true,
    },
  );

  if (!sent) {
    console.warn(`Queue ${queueName} is full - message not sent`);
  }
};
