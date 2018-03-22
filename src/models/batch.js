import * as path from "path";

import { Model } from "objection";

class Batch extends Model {
	constructor() {
		super();
		this.id = null;
		this.project = null;
		this.projectId = null;
		this.rfidTag = null;
		this.createdAt = null;
	}

	static get tableName() {
		return "Batch";
	}

	static get relationMappings() {
		return {
			project: {
				relation: Model.BelongsToOneRelation,
				modelClass: path.join(__dirname, "project.js"),
				join: {
					from: "Batch.projectId",
					to: "Project.id"
				}
			}
		};
	}

	async $beforeInsert() {
		/* istanbul ignore else */
		if (this.createdAt === null) {
			this.createdAt = new Date().toISOString();
		}
	}
}

export default Batch;
