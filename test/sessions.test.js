import test from "ava";
import request from "supertest";

import app from "../src/app";

test("/login", async t => {
	const res = await request(app).get("/login");
	t.is(res.status, 200);
});
