import test from "ava";
import request from "supertest";

import setupDB from "../helpers";

import User from "../../src/models/user";
import app from "../../src/app";

const GOOD_LOGIN = { username: "mark", password: "1234" };
const GOOD_LOGIN_OTHER = { username: "nick", password: "2345" };
const PROJECTS = [
	{
		name: "project 1",
		batches: [{
			rfidTag: "1x"
		},
		{
			rfidTag: "2x"
		}]
	},
	{
		name: "project 2",
		batches: [{
			rfidTag: "3x"
		},
		{
			rfidTag: "4x"
		}]
	}
];

test.before(async () => {
	await setupDB();
});

let testIndex = 0;

test.beforeEach(async t => {
	const login = { ...GOOD_LOGIN, username: `${GOOD_LOGIN.username}${testIndex++}` };
	const user = {
		...login,
		projects: PROJECTS
	};
	t.context.login = login;
	t.context.user = await User.query().insertGraph(user).eager("projects.batches");
});

const authMacro = async (t, path) => {
	const res = await request(app).get(path);
	t.is(res.status, 302);
	t.is(res.header.location, "/login");
};

test("GET / unauthenticated", authMacro, "/");
test("GET /api/projects unauthenticated", authMacro, "/api/projects");
test("GET /api/projects/:project unauthenticated", authMacro, "/api/projects/0");

test("GET / authenticated", async t => {
	const { login } = t.context;
	const agent = request.agent(app);

	await agent.post("/login")
		.type("form")
		.send(login);

	const res = await agent.get("/");
	t.is(res.status, 200);
	t.is(res.type, "text/html");
});

test("GET /api/projects authenticated", async t => {
	const { login, user } = t.context;
	t.plan(2 + (2 * user.projects.length));
	const agent = request.agent(app);

	await agent.post("/login")
		.type("form")
		.send(login);

	const res = await agent.get("/api/projects");
	t.is(res.status, 200);
	t.is(res.type, "application/json");

	user.projects.forEach((project, i) => {
		t.is(res.body[i].id, project.id);
		t.is(res.body[i].name, project.name);
	});
});

test("GET /api/projects/:project authenticated", async t => {
	const { login, user } = t.context;
	const project = user.projects[0];

	t.plan(2 + (2 * (project.batches.length)));
	const agent = request.agent(app);

	await agent.post("/login")
		.type("form")
		.send(login);

	const res = await agent.get(`/api/projects/${project.id}`);
	t.is(res.status, 200);
	t.is(res.type, "application/json");

	project.batches.forEach((batch, i) => {
		t.is(res.body.batches[i].id, batch.id);
		t.is(res.body.batches[i].rfidTag, batch.rfidTag);
	});
});

test("GET /api/projects/:project bad parameter", async t => {
	const { login } = t.context;
	const agent = request.agent(app);

	await agent.post("/login")
		.type("form")
		.send(login);

	const res = await agent.get(`/api/projects/not-a-number`);
	t.is(res.status, 403);
});

test("GET /api/projects/:project bad user", async t => {
	const { user } = t.context;
	const agent = request.agent(app);
	await User.query().insertGraph(GOOD_LOGIN_OTHER);

	await agent.post("/login")
		.type("form")
		.send(GOOD_LOGIN_OTHER);

	const res = await agent.get(`/api/projects/${user.projects[0].id}`);
	t.is(res.status, 403);
});
