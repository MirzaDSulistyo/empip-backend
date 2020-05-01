import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeSchema1588350963087 implements MigrationInterface {
    name = 'ChangeSchema1588350963087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" DROP NOT NULL`, undefined);
    }

}
