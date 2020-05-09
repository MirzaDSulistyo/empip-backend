import {MigrationInterface, QueryRunner} from "typeorm";

export class NewPaymentAndUpdateCompanySchema1589029441358 implements MigrationInterface {
    name = 'NewPaymentAndUpdateCompanySchema1589029441358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "descriptions" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ADD "freeDeliveryFee" integer NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ADD "freeDeliveryRadius" integer NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ADD "freeDeliveryPerUnit" integer NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ADD "deliveryMeasurementUnit" character varying NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "deliveryMeasurementUnit"`, undefined);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "freeDeliveryPerUnit"`, undefined);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "freeDeliveryRadius"`, undefined);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "freeDeliveryFee"`, undefined);
        await queryRunner.query(`DROP TABLE "payment"`, undefined);
    }

}
