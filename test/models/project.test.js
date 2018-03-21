import test from "ava";

import setupDB from "../helpers";

import User from "../../src/models/user";
import Project from "../../src/models/project";

const USER_PROPS = { username: "mark", password: "1234" };
const USER_PROPS_OTHER = { username: "nick", password: "2345" };
const PROJECT_PROPS = { name: "project X" };

test.before(async () => {
	await setupDB();
});

test.beforeEach(async t => {
	t.context.user = await User.query().insert(USER_PROPS);
});

test("Project insert() standalone", async t => {
	const err = await t.throws(Project.query().insert(PROJECT_PROPS));
	t.is(err.code, "SQLITE_CONSTRAINT");
});

test("Project insert() empty", async t => {
	const err = await t.throws(Project.query().insert({}));
	t.is(err.code, "SQLITE_CONSTRAINT");
});

test("Project insert() proper", async t => {
	const { user } = t.context;

	const insertedProject = await user.$relatedQuery("projects").insert(PROJECT_PROPS);

	t.true(insertedProject instanceof Project);
	t.is(insertedProject.name, PROJECT_PROPS.name);
});

test("Project.isOwnedBy()", async t => {
	const { user } = t.context;

	const insertedProject = await user.$relatedQuery("projects").insert(PROJECT_PROPS);
	const otherUser = await User.query().insert(USER_PROPS_OTHER);

	t.true(insertedProject.isOwnedBy(user));
	t.false(insertedProject.isOwnedBy(otherUser));
});
