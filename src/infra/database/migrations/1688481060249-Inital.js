const { QueryRunner } = require("typeorm");

module.exports = class InitialMigration1688481060249  {

    async up(queryRunner) {

        await queryRunner.query(`
            INSERT INTO public."Address" 
            (id, "createdAt", "updatedAt", "deletedAt", address, complement, number, district, cep, city, state) 
            VALUES 
            ('bd10abdf-91f5-4b63-b73d-dcd117d2f4da','2023-07-04 13:33:08.143','2023-07-04 16:33:08.146138',NULL,'root','root','0','root','00000000','root','RO');
        `);

        await queryRunner.query(`
            INSERT INTO public."Company" 
            (id, "createdAt", "updatedAt", "deletedAt", name, phone, phone2, phone3, whatsapp, cnpj, email, email2, email3, site, "addressID") 
            VALUES 
            ('0eae237f-86da-423f-a56d-5533ffb39fc5','2023-07-04 13:33:08.149','2023-07-04 16:33:08.152295',NULL,'root','3251-0284',NULL,NULL,NULL,NULL,'@service.com',NULL,NULL,NULL,'bd10abdf-91f5-4b63-b73d-dcd117d2f4da');
        `);

        await queryRunner.query(`
            INSERT INTO public."Member" 
            (id, "createdAt", "updatedAt", "deletedAt", name, email, password, type, "companyId", refresh_token) 
            VALUES 
            ('8c80fb14-0aa8-49d6-8dde-65273f52cbb5','2023-07-04 13:43:46.946','2023-07-04 16:43:46.976815',NULL,'root','root@root.com','$2b$10$4I3ByaNyaCHXTkU5Zfvxh.4Q5t069S/oNxiO3fDwxAB6YlVChYzFy','MANAGER','0eae237f-86da-423f-a56d-5533ffb39fc5',NULL);
        `);

    }
    

    async down(queryRunner) {
        await queryRunner.query(`
            DELETE FROM "Member" WHERE id = '8c80fb14-0aa8-49d6-8dde-65273f52cbb5';
            DELETE FROM "Company" WHERE id = '0eae237f-86da-423f-a56d-5533ffb39fc5';
            DELETE FROM "Address" WHERE id = 'bd10abdf-91f5-4b63-b73d-dcd117d2f4da';
        `);
    }
}
