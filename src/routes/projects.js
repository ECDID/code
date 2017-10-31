import { Router } from "express";
import { ensureLoggedIn } from "connect-ensure-login";

const projects = Router();

projects.get("/", ensureLoggedIn(), (req, res) => {
	res.type("html");
	res.end("<h1>your projects!</h1> (you should be logged in)");
});

export default projects;
