import test from "ava";
import request from "supertest";
import Knex from "knex";
import { Model } from "objection";

import User from "../../src/models/user";
import app from "../../src/app";

const BAD_LOGINS = [
	{ username: "noexists", password: "1234" },   // Incorrect username
	{ username: "mark", password: "badpass" },    // Incorrect password
	{ password: "1234" },                         // No username
	{ username: "mark" }                          // No password
];

const GOOD_LOGIN = { username: "mark", password: "1234" };

test.before(async () => {
	const knex = Knex(config[process.env.NODE_ENV]);
	await knex.migrate.latest();
	Model.knex(knex);
	await User.query().insert(GOOD_LOGIN);
});

test("GET /login", async t => {
	const res = await request(app).get("/login");
	t.is(res.status, 200);
	t.is(res.type, "text/html");
});

test("POST /login failure", async t => {
	t.plan(BAD_LOGINS.length * 2);

	const responses = await Promise.all(BAD_LOGINS.map(async info => {
		return request(app).post("/login")
			.type("form")
			.send(info);
	}));

	responses.forEach(res => {
		t.is(res.status, 302);
		t.is(res.header.location, "/login");
	});
});

test("POST /login success", async t => {
	const res = await request(app).post("/login")
		.type("form")
		.send(GOOD_LOGIN);
	t.is(res.status, 302);
	t.is(res.header.location, "/");
});

test("GET /login already logged in", async t => {
	const agent = request.agent(app);

	await agent.post("/login")
		.type("form")
		.send(GOOD_LOGIN);

	const res = await agent.get("/login");
	t.is(res.status, 302);
	t.is(res.header.location, "/");
});

test("POST /login already logged in", async t => {
	const agent = request.agent(app);

	await agent.post("/login")
		.type("form")
		.send(GOOD_LOGIN);

	const res = await agent.post("/login")
		.type("form")
		.send(GOOD_LOGIN);
	t.is(res.status, 302);
	t.is(res.header.location, "/");
});
