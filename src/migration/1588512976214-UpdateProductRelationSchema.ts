import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateProductRelationSchema1588512976214 implements MigrationInterface {
    name = 'UpdateProductRelationSchema1588512976214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_9e31a1b53399e1ab1b5651447eb"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_9e31a1b53399e1ab1b5651447eb" FOREIGN KEY ("packageId") REFERENCES "package"("id") ON DELETE SET NULL ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_9e31a1b53399e1ab1b5651447eb"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_9e31a1b53399e1ab1b5651447eb" FOREIGN KEY ("packageId") REFERENCES "package"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

}
