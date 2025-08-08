import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1754689338068 implements MigrationInterface {
  name = 'CreateUsers1754689338068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
