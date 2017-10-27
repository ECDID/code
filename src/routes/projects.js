import { Router } from "express";
import { ensureLoggedIn } from "connect-ensure-login";

const projects = Router();

projects.get("/", ensureLoggedIn(), (req, res) => {
	res.end("your projects! (you should be logged in)");
});

export default projects;
