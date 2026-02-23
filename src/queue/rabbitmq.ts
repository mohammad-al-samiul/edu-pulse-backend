import amqp from "amqplib";
import type { Channel, ChannelModel } from "amqplib"; // ChannelModel ইম্পোর্ট করতে হবে

let connectionModel: ChannelModel | null = null;
let channel: Channel | null = null;

export async function connectRabbitMQ(): Promise<Channel> {
  // যদি আগে থেকেই চ্যানেল থাকে তাহলে রিটার্ন
  if (channel) return channel;

  const url = process.env.RABBITMQ_URL;
  if (!url) {
    throw new Error("RABBITMQ_URL is missing in .env file");
  }

  try {
    connectionModel = await amqp.connect(url);

    channel = await connectionModel.createChannel();

    console.log("✅ RabbitMQ Connected");

    connectionModel.on("close", () => {
      console.error("❌ RabbitMQ connection closed. Resetting...");
      connectionModel = null;
      channel = null;
    });

    connectionModel.on("error", (err: Error) => {
      console.error("❌ RabbitMQ connection error:", err.message);
      connectionModel = null;
      channel = null;
    });

    channel.on("close", () => {
      console.warn("⚠️ RabbitMQ channel closed");
      channel = null;
    });

    channel.on("error", (err: Error) => {
      console.error("❌ RabbitMQ channel error:", err.message);
    });

    return channel;
  } catch (error) {
    console.error("❌ RabbitMQ Connection Failed:", error);
    throw error;
  }
}

export function getChannel(): Channel {
  if (!channel) {
    throw new Error(
      "RabbitMQ channel not initialized. Call connectRabbitMQ first.",
    );
  }
  return channel;
}
