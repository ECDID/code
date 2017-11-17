import { Router } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ensureLoggedOut } from "connect-ensure-login";
import db from "../models"


// TODO: remove when actual user authentication

passport.use(new LocalStrategy(async (name, pass, done) => {
	try {
		const user = await db.logins.findOne({
			
			where: {
				username: name,
				password: pass
			}

		})

		if (user  === null || user == 'undefined'){
			done(null, null, {message: "Bad credentials" });
		}
		else{ // probably not the best way to do this, only for the demo, DEFINITELY CHANGE LATER
			done(null, user);
		}

		// TODO: use actual user authentication
		// Const user = await User.validateUser(username, password);
		// if (user) {

		// TODO: remove these next 2 lines when actual authentication
		/*const user = TEST_USER;
		if (user.username === username && user.password === password) {
			done(null, user);
		} else {
			done(null, null, { message: "Bad credentials" });
		}
	*/
	} catch (err) {
		/* istanbul ignore next: remove this when adding actual authentication */

		done(err);
	}
}));

passport.serializeUser((user, cb) => {
	cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
	try {
		const user = await db.logins.findOne({
			
			where: {
				id: id
			}

		})
		cb(null, user);
	} catch (err) {
		/* istanbul ignore next: remove this when adding actual authentication */
		cb(err);
	}
});

const sessions = Router();

sessions.get("/login", ensureLoggedOut(), (req, res) => {
	// TODO: render Taylor's login page
	res.type("html");
	res.end(`
	<form action="/login" method="post">
		<div>
			<label>Username:</label>
			<input type="text" name="username"/><br/>
		</div>
		<div>
			<label>Password:</label>
			<input type="password" name="password"/>
		</div>
		<div>
			<input type="submit" value="Submit"/>
		</div>
	</form>
	`);
});

sessions.post("/login", passport.authenticate("local", {
	failureRedirect: "/login",
	successReturnToOrRedirect: "/"
}));

export { passport, sessions };
