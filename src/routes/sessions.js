import { Router } from "express";

const sessions = Router();
sessions.get("/login", (req, res) => {
	res.end("login!");
});

export default sessions;
