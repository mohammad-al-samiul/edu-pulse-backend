import app from "../src/app";
import prisma from "../src/config/prisma";

let isConnected = false;

export default async function handler(req: any, res: any) {
  if (!isConnected) {
    await prisma.$connect();
    isConnected = true;
  }

  return app(req, res);
}
