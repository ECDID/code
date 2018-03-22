import path from "path";
import express from "express";
import logger from "morgan";
import session from "express-session";
import bodyParser from "body-parser";
import { mustache } from "consolidate";

import sessions, { passport } from "./routes/sessions";
import projects from "./routes/projects";

// Create app
const app = express();

// Log requests
const isTest = app.get("env") === "test";
const isDev = app.get("env") === "development";
const logType = isDev ? /* istanbul ignore next */ "dev" : "combined";
app.use(logger(logType, {
	skip: () => isTest
}));

// Parse incoming data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// TODO: use actual secret, use a real session store
app.use(session({
	secret: "memes only",
	resave: false,
	rolling: true,
	saveUninitialized: false,
	cookie: {
		maxAge: (60 * 60 * 24 * 1000)
	}
}));

// Set up authentication
app.use(passport.initialize());
app.use(passport.session());

// Set up views
app.engine("html", mustache);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "html");

// Set up routes
app.use("/", projects, sessions);
app.use("/css", express.static("views/css"));

// Catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error("Not Found");
	Object.defineProperty(err, "status", {
		get: () => 404
	});
	next(err);
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	// Render the error page
	res.status(err.status || /* istanbul ignore next */ 500);
	res.end(err.message);
});

export default app;
