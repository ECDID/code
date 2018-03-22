import test from "ava";
import bcrypt from "bcrypt";

import setupDB from "../helpers";

import User, { generateHash } from "../../src/models/user";

const GOOD_LOGIN = { username: "mark", password: "1234" };
const { username, ...LOGIN_NO_USER } = GOOD_LOGIN;
const { password, ...LOGIN_NO_PASS } = GOOD_LOGIN;

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

test("User insert() no password", async t => {
	const props = LOGIN_NO_PASS;

	const err = await t.throws(User.query().insert(props));
	t.is(err.message, "Invalid password");
});

test("User insert() no username", async t => {
	const props = LOGIN_NO_USER;

	const err = await t.throws(User.query().insert(props));
	t.is(err.code, "SQLITE_CONSTRAINT");
});

test("User insert()", async t => {
	const props = GOOD_LOGIN;

	const insertedUser = await User.query().insert(props);

	const match = await bcrypt.compare(props.password, insertedUser.password);
	t.true(insertedUser instanceof User);
	t.is(insertedUser.username, props.username);
	t.true(match);
});

test("User update()", async t => {
	const props = GOOD_LOGIN;
	const newPassword = "12345";

	const insertedUser = await User.query().insert(props);
	insertedUser.password = newPassword;
	const updatedUser = await User.query().updateAndFetchById(insertedUser.id, insertedUser);

	const match = await bcrypt.compare(newPassword, updatedUser.password);
	t.is(updatedUser.username, insertedUser.username);
	t.true(match);
});

test("User.verifyPassword()", async t => {
	const props = GOOD_LOGIN;

	const insertedUser = await User.query().insert(props);

	const match = await insertedUser.verifyPassword(props.password);
	t.is(insertedUser.username, props.username);
	t.true(match);
});
