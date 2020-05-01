import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeSchema1588337744378 implements MigrationInterface {
    name = 'ChangeSchema1588337744378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "descriptions" character varying NOT NULL, "price" integer NOT NULL, "stock" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyId" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_a331e634b87a7dbba2e7fccce19" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_a331e634b87a7dbba2e7fccce19"`, undefined);
        await queryRunner.query(`DROP TABLE "product"`, undefined);
    }

}
