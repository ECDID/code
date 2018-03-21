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

test.before(async () => {
	await setupDB();
});

test.beforeEach(async t => {
	const user = await User.query().insertGraph(USER_PROPS).eager("projects");
	t.context.project = user.projects[0];
});

test("Batch insert() standalone", async t => {
	const props = { rfidTag: "0000-0000-0000-0000" };

	const err = await t.throws(Batch.query().insert(props));
	t.is(err.code, "SQLITE_CONSTRAINT");
});

test("Batch insert() empty", async t => {
	const err = await t.throws(Batch.query().insert({}));
	t.is(err.code, "SQLITE_CONSTRAINT");
});

test("Batch insert() proper", async t => {
	const { project } = t.context;
	const props = { rfidTag: "0000-0000-0000-0000" };

	const insertedBatch = await project.$relatedQuery("batches").insert(props);

	t.true(insertedBatch instanceof Batch);
	t.is(insertedBatch.rfidTag, props.rfidTag);
	t.not(insertedBatch.createdAt, null);
});

test("Batch update()", async t => {
	const { project } = t.context;
	const props = { rfidTag: "0000-0000-0000-0000" };

	const insertedBatch = await project.$relatedQuery("batches").insert(props);
	const { createdAt } = insertedBatch;
	await delay(1000);
	const updatedBatch = await Batch.query().updateAndFetchById(insertedBatch.id, insertedBatch);

	t.is(createdAt, updatedBatch.createdAt);
});
