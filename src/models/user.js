import { Model } from "objection";
import Password from "objection-password";

export default class User extends Password()(Model) {
	static get tableName() {
		return "User";
	}
}
