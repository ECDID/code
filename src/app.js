import express from "express";
import logger from "morgan";
import session from "express-session";
import bodyParser from "body-parser";

import { passport, sessions } from "./routes/sessions";
import projects from "./routes/projects";

// Create app
const app = express();

// Log requests
app.use(logger("dev", {
	skip: () => {
		return app.get("env") !== "development";
	}
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
		maxAge: (60 * 60 * 24)
	}
}));

// Set up authentication
app.use(passport.initialize());
app.use(passport.session());

// Set up routes
app.use("/", projects, sessions);

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
	res.status(err.status || 500);
	res.end(err.message);
});

export default app;
