import test from "ava";
import request from "supertest";

import app from "../src/app";

test("404 handler", async t => {
	const get = await request(app).get("/fake");
	t.is(get.status, 404);

	const post = await request(app).post("/nonexistant");
	t.is(post.status, 404);
});
