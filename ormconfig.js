const {  DataSource } = require('typeorm');
require('dotenv').config();

const connection = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    "dist/src/infra/database/entities/*{.ts,.js}" 
  ],
  synchronize: false, 
  logging: false,
  migrations: [
    'src/infra/database/migrations/*.js',
  ],
  cli: {
    migrationsDir: 'src/infra/database/migrations',
  }
});

module.exports = {connection};