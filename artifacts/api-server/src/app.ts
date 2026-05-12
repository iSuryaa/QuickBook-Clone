import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { seedDatabase } from "./lib/seed";

const DB_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";
if (!DB_URL) logger.warn("DATABASE_URL is not set — DB operations will fail");
if (!process.env.JWT_SECRET) logger.warn("JWT_SECRET not set — using insecure default");

const app: Express = express();

app.set("trust proxy", 1);

app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = /localhost|127\.0\.0\.1|\.replit\.app|\.replit\.dev|\.repl\.co/;
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.test(origin)) cb(null, true);
      else cb(new Error("CORS: origin not allowed"));
    },
    credentials: true,
  }),
);

const authLimiter = rateLimit({
  windowMs: 60_000, max: 5,
  standardHeaders: true, legacyHeaders: false,
  message: { error: "Too many requests on auth. Try again in 1 minute." },
});
const bookingLimiter = rateLimit({
  windowMs: 60_000, max: 20,
  standardHeaders: true, legacyHeaders: false,
  message: { error: "Too many booking requests. Slow down." },
});
const globalLimiter = rateLimit({
  windowMs: 60_000, max: 100,
  standardHeaders: true, legacyHeaders: false,
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) { return { id: req.id, method: req.method, url: req.url?.split("?")[0] }; },
      res(res) { return { statusCode: res.statusCode }; },
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authLimiter);
app.use("/api/bookings", bookingLimiter);
app.use("/api", globalLimiter);
app.use("/api", router);

seedDatabase().catch(err => logger.error({ err }, "Seed failed"));

export default app;
