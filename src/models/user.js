import * as path from "path";

import { Model } from "objection";
import bcrypt from "bcrypt";

const generateHash = password => {
	if (typeof password !== "string" || password.length === 0) {
		throw new Error("Invalid password");
	}

	return bcrypt.hash(password, 12);
};

class User extends Model {
	constructor() {
		super();
		this.id = null;
		this.username = null;
		this.password = null;
		this.projects = null;
	}

	static get tableName() {
		return "User";
	}

	static get relationMappings() {
		return {
			projects: {
				relation: Model.HasManyRelation,
				modelClass: path.join(__dirname, "project.js"),
				join: {
					from: "User.id",
					to: "Project.ownerId"
				}
			}
		};
	}

	async $beforeInsert() {
		const hash = await generateHash(this.password);
		this.password = hash;
	}

	async $beforeUpdate() {
		const hash = await generateHash(this.password);
		this.password = hash;
	}

	verifyPassword(password) {
		return bcrypt.compare(password, this.password);
	}
}

export { User as default, generateHash };
