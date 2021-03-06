/* eslint-disable unicorn/filename-case */
const up = async knex => {
	await knex.schema.createTableIfNotExists("User", table => {
		table.increments("id").primary();
		table.string("username").notNullable();
		table.string("password").notNullable();
	});
};

/* istanbul ignore next */
const down = async knex => {
	await knex.schema.dropTableIfExists("User");
};

export { up, down };
