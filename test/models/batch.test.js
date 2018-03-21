import test from "ava";
import delay from "delay";

import setupDB from "../helpers";

import User from "../../src/models/user";
import Batch from "../../src/models/batch";

const USER_PROPS = {
	username: "mark",
	password: "1234",
	projects: [{
		name: "project 1"
	}]
};
const RFID_PROPS = { rfidTag: "0000-0000-0000-0000" };

test.before(async () => {
	await setupDB();
});

test.beforeEach(async t => {
	const user = await User.query().insertGraph(USER_PROPS).eager("projects");
	t.context.project = user.projects[0];
});

test("Batch insert() standalone", async t => {
	const err = await t.throws(Batch.query().insert(RFID_PROPS));
	t.is(err.code, "SQLITE_CONSTRAINT");
});

test("Batch insert() empty", async t => {
	const err = await t.throws(Batch.query().insert({}));
	t.is(err.code, "SQLITE_CONSTRAINT");
});

test("Batch insert() proper", async t => {
	const { project } = t.context;

	const insertedBatch = await project.$relatedQuery("batches").insert(RFID_PROPS);

	t.true(insertedBatch instanceof Batch);
	t.is(insertedBatch.rfidTag, RFID_PROPS.rfidTag);
	t.not(insertedBatch.createdAt, null);
});

test("Batch update()", async t => {
	const { project } = t.context;

	const insertedBatch = await project.$relatedQuery("batches").insert(RFID_PROPS);
	const { createdAt } = insertedBatch;
	await delay(1000);
	const updatedBatch = await Batch.query().updateAndFetchById(insertedBatch.id, insertedBatch);

	t.is(createdAt, updatedBatch.createdAt);
});
