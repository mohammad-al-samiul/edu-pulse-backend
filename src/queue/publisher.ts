import amqp from "amqplib";

let channel: any;

export const initRabbit = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  channel = await connection.createChannel();
};

export const publishEvent = async (queue: string, message: any) => {
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
};
