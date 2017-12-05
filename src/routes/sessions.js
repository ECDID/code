import { Router } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ensureLoggedOut } from "connect-ensure-login";

import User from "../models/user";

passport.use(new LocalStrategy(async (username, password, done) => {
	try {
		const user = await User.query().findOne({ username });
		if (user instanceof User) {
			if (await user.verifyPassword(password)) {
				done(null, user);
			} else {
				done(null, null, { message: "Bad credentials" });
			}
		} else {
			done(null, null, { message: "Bad credentials" });
		}
	} catch (err) {
		/* istanbul ignore next */
		done(err);
	}
}));

passport.serializeUser((user, cb) => {
	cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
	try {
		const user = await User.query().findById(id);
		cb(null, user);
	} catch (err) {
		/* istanbul ignore next: remove this when adding actual authentication */
		cb(err);
	}
});

const sessions = Router();

sessions.get("/login", ensureLoggedOut(), (req, res) => {
	res.render("login");
});

sessions.post("/login", ensureLoggedOut(), passport.authenticate("local", {
	failureRedirect: "/login",
	successReturnToOrRedirect: "/"
}));

export { passport, sessions };
