import test from "ava";

import setupDB from "../helpers";

import User from "../../src/models/user";
import Project from "../../src/models/project";

const userProps = { username: "mark", password: "1234" };
const userPropsOther = { username: "nick", password: "2345" };

test.before(async () => {
	await setupDB();
});

test.beforeEach(async t => {
	t.context.user = await User.query().insert(userProps);
});

test("Project insert() standalone", async t => {
	const props = { name: "project X" };

	const err = await t.throws(Project.query().insert(props));
	t.is(err.code, "SQLITE_CONSTRAINT");
});

test("Project insert() empty", async t => {
	const err = await t.throws(Project.query().insert({}));
	t.is(err.code, "SQLITE_CONSTRAINT");
});

test("Project insert() proper", async t => {
	const { user } = t.context;
	const props = { name: "project X" };

	const insertedProject = await user.$relatedQuery("projects").insert(props);

	t.true(insertedProject instanceof Project);
	t.is(insertedProject.name, props.name);
});

test("Project.isOwnedBy()", async t => {
	const { user } = t.context;
	const props = { name: "project X" };

	const insertedProject = await user.$relatedQuery("projects").insert(props);
	const otherUser = await User.query().insert(userPropsOther);

	t.true(insertedProject.isOwnedBy(user));
	t.false(insertedProject.isOwnedBy(otherUser));
});
