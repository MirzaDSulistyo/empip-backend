import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateOrder1589636297486 implements MigrationInterface {
    name = 'UpdateOrder1589636297486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "invoiceNumber" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "isMembershipOrder" boolean NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "orderTotal" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "subTotal" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "latitude" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "longitude" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "status" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "deliveryFee" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "userId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "userId"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryFee"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "status"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "longitude"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "latitude"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "subTotal"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "orderTotal"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "isMembershipOrder"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "invoiceNumber"`, undefined);
    }

}
