const { QueryRunner } = require("typeorm");

module.exports = class InitialMigration1688481060249  {

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE company (
                id UUID PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(255) NOT NULL,
                phone2 VARCHAR(255),
                phone3 VARCHAR(255),
                email VARCHAR(255) NOT NULL,
                email2 VARCHAR(255),
                email3 VARCHAR(255),
                site VARCHAR(255),
                address VARCHAR(255) NOT NULL,
                createdat TIMESTAMP NOT NULL,
                updatedat TIMESTAMP,
                deletedat TIMESTAMP
            );
        `);

        await queryRunner.query(`
            CREATE TABLE member (
                id UUID PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL,
                companyid UUID,
                refresh_token VARCHAR(255),
                createdat TIMESTAMP NOT NULL,
                updatedat TIMESTAMP,
                deletedat TIMESTAMP,
                FOREIGN KEY (companyid) REFERENCES company(id) ON DELETE CASCADE
            );
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE member`);
        await queryRunner.query(`DROP TABLE company`);
    }
}
