import test from "ava";
import request from "supertest";

import setupDB from "../helpers";

import User from "../../src/models/user";
import app from "../../src/app";

const GOOD_LOGIN = { username: "mark", password: "1234" };

test.before(async () => {
	await setupDB();
	await User.query().insert(GOOD_LOGIN);
});

test("GET / unauthenticated", async t => {
	const res = await request(app).get("/");
	t.is(res.status, 302);
	t.is(res.header.location, "/login");
});

test("GET / authenticated", async t => {
	const agent = request.agent(app);

	await agent.post("/login")
		.type("form")
		.send(GOOD_LOGIN);

	const res = await agent.get("/");
	t.is(res.status, 200);
	t.is(res.type, "text/html");
});
