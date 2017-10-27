import test from "ava";
import request from "supertest";

import app from "../../src/app";

const BAD_LOGINS = [
	{ username: "noexists", password: "1234" },   // Incorrect username
	{ username: "mark", password: "badpass" },    // Incorrect password
	{ password: "1234" },                         // No username
	{ username: "mark" }                          // No password
];

const GOOD_LOGIN = { username: "mark", password: "1234" };

test("GET /login", async t => {
	const res = await request(app).get("/login");
	t.is(res.status, 200);
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
