/* eslint-disable unicorn/filename-case */
const up = async knex => {
	await knex.schema.createTableIfNotExists("Project", table => {
		table.increments("id").primary();
		table.integer("ownerId").unsigned().notNullable().references("id").inTable("User");
		table.string("name").notNullable();
	});
};

/* istanbul ignore next */
const down = async knex => {
	await knex.schema.dropTableIfExists("Project");
};

export { up, down };
