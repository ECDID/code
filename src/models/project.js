import * as path from "path";

import { Model } from "objection";

class Project extends Model {
	constructor() {
		super();
		this.id = null;
		this.owner = null;
		this.ownerId = null;
		this.batches = null;
		this.name = null;
	}

	static get tableName() {
		return "Project";
	}

	static get relationMappings() {
		return {
			owner: {
				relation: Model.BelongsToOneRelation,
				modelClass: path.join(__dirname, "user.js"),
				join: {
					from: "Project.ownerId",
					to: "User.id"
				}
			},
			batches: {
				relation: Model.HasManyRelation,
				modelClass: path.join(__dirname, "batch.js"),
				join: {
					from: "Project.id",
					to: "Batch.projectId"
				}
			}
		};
	}

	isOwnedBy(user) {
		return this.ownerId === user.id;
	}
}

export default Project;
