import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateUserTable1588166837947 implements MigrationInterface {
    name = 'UpdateUserTable1588166837947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`, undefined);
    }

}
