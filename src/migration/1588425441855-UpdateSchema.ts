import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateSchema1588425441855 implements MigrationInterface {
    name = 'UpdateSchema1588425441855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "package" ("id" SERIAL NOT NULL, "comId" integer NOT NULL, "name" character varying NOT NULL, "descriptions" character varying NOT NULL, "price" integer NOT NULL, "specialPrice" integer NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_308364c66df656295bc4ec467c2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "specialPrice" integer NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "packageId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_9e31a1b53399e1ab1b5651447eb" FOREIGN KEY ("packageId") REFERENCES "package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_9e31a1b53399e1ab1b5651447eb"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "packageId"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "specialPrice"`, undefined);
        await queryRunner.query(`DROP TABLE "package"`, undefined);
    }

}
