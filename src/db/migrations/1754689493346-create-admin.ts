import { MigrationInterface, QueryRunner } from 'typeorm';
import { encodePassword } from '../../helpers/system';

export class CreateAdmin1754689493346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = await encodePassword('asdfasdf');
    await queryRunner.query(
      `INSERT INTO "users" ("id", "password", "name", "email") VALUES (default, '${password}', 'admin', 'admin@test.com')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "users" WHERE "email" = 'admin@test.com'`,
    );
  }
}
