import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import { json, urlencoded } from "express";
import serverless from "serverless-http";
import express from "express";

let cachedHandler: ReturnType<typeof serverless> | null = null;

async function bootstrapServer() {
  const expressApp = express();
  expressApp.get("/", (_req, res) => {
    res.send({ status: "ok", message: "Backend is running" });
  });
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter, { logger: false });

  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Accept, Authorization, x-auth-token",
  });

  await app.init();
  return serverless(expressApp);
}

export default async function handler(req: any, res: any) {
  if (!cachedHandler) {
    cachedHandler = await bootstrapServer();
  }
  return cachedHandler(req, res);
}
