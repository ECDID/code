/* eslint-disable unicorn/filename-case */
const up = async knex => {
	await knex.schema.createTableIfNotExists("Batch", table => {
		table.increments("id").primary();
		table.integer("projectId").unsigned().notNullable().references("id").inTable("Project");
		table.text("rfidTag").notNullable();
		table.dateTime("createdAt").notNullable();
		table.string("slumpPercentage");
		table.string("sandPercentage");
		table.string("mudPercentage");
		table.string("portlandRating");
		table.string("mixTemp");
		table.string("mixRatio");
	});
};

/* istanbul ignore next */
const down = async knex => {
	await knex.schema.dropTableIfExists("Batch");
};

export { up, down };
