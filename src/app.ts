import express from "express";
import compression from "compression"; // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import lusca from "lusca";
import flash from "express-flash";
import { SESSION_SECRET } from "./util/secrets";
import apiRouter from "./routes/ApiRouter";
import "./services/BackgroundWorker";
import { DatabaseService } from "./services/DatabaseService";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
  })
);
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

// Connect & initialize db
DatabaseService.connect();
DatabaseService.initialize();

// main api router
app.use("/api", apiRouter);

export default app;
