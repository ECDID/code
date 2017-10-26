import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import sessions from "./routes/sessions";

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
app.use(cookieParser());

// Set up routes
app.use("/", sessions /* , others... */);

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
