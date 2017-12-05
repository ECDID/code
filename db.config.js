module.exports = {
	development: {
		client: "sqlite3",
		useNullAsDefault: true,
		connection: {
			filename: "./dev.sqlite3"
		}
	},

	production: {
		client: "postgresql",
		useNullAsDefault: true,
		connection: process.env.DATABASE_URL,
		migrations: {
			tableName: "knex_migrations"
		}
	},

	test: {
		client: "sqlite3",
		useNullAsDefault: true,
		connection: {
			filename: ":memory:"
		}
	}
};
