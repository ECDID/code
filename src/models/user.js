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
	}

	static get tableName() {
		return "User";
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
