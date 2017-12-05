import test from "ava";
import bcrypt from "bcrypt";

import setupDB from "../helpers";

import User, { generateHash } from "../../src/models/user";

test.before(async () => {
	await setupDB();
});

test("generateHash() valid password", async t => {
	const password = "password";
	const hash = await generateHash(password);
	const match = await bcrypt.compare(password, hash);
	t.true(match);
});

test("generateHash() invalid password", t => {
	t.throws(() => generateHash(""));
	t.throws(() => generateHash(null));
	t.throws(() => generateHash(undefined));
});

test("User insert()", async t => {
	const props = { username: "mark", password: "1234" };

	const insertedUser = await User.query().insert(props);

	const match = await bcrypt.compare(props.password, insertedUser.password);
	t.is(insertedUser.username, props.username);
	t.true(match);
});

test("User update()", async t => {
	const props = { username: "mark", password: "1234" };
	const newPassword = "12345";

	const insertedUser = await User.query().insert(props);
	insertedUser.password = newPassword;
	await User.query().update(insertedUser).where("id", insertedUser.id);

	const match = await bcrypt.compare(newPassword, insertedUser.password);
	t.is(insertedUser.username, props.username);
	t.true(match);
});

test("User.verifyPassword()", async t => {
	const props = { username: "mark", password: "1234" };

	const insertedUser = await User.query().insert(props);

	const match = await insertedUser.verifyPassword(props.password);
	t.is(insertedUser.username, props.username);
	t.true(match);
});
