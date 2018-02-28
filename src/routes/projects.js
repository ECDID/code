import { Router } from "express";
import { ensureLoggedIn } from "connect-ensure-login";

const projects = Router();

projects.use("/api", ensureLoggedIn());

projects.param("project", (req, res, next, id) => {
	try {
		const projectId = parseInt(id, 10);
		const validProject = !req.user.projects.every(project => {
			return project.id !== projectId;
		});
		if (validProject) {
			next();
		} else {
			const err = new Error("Forbidden");
			Object.defineProperty(err, "status", {
				get: () => 403
			});
			next(err);
		}
	} catch (err) {
		Object.defineProperty(err, "status", {
			get: () => 404
		});
		next(err);
	}
});

projects.get("/", ensureLoggedIn(), (req, res) => {
	res.render("projects");
});

projects.get("/api/projects", async (req, res) => {
	await req.user.$loadRelated("projects");
	res.send(req.user);
});

projects.get("/api/projects/:project", async (req, res) => {
	const projectId = parseInt(req.params.project, 10);
	const project = req.user.projects.find(project => {
		return project.id === projectId;
	});
	await project.$loadRelated("batches");
	res.send(project);
});

export default projects;
