import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateSchemaPackage1588507710038 implements MigrationInterface {
    name = 'UpdateSchemaPackage1588507710038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package" ALTER COLUMN "specialPrice" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "specialPrice" SET NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "specialPrice" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "package" ALTER COLUMN "specialPrice" DROP NOT NULL`, undefined);
    }

}
