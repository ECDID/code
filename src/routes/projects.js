import { Router } from "express";
import { ensureLoggedIn } from "connect-ensure-login";

const projects = Router();

projects.get("/", ensureLoggedIn(), (req, res) => {
	res.render("projects");
});

export default projects;
