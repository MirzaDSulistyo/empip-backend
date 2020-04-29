import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import { Company } from "../entity/Company";
import { User } from "../entity/User";

export class CreateCompanyData1588167332303 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const userRepository = getRepository(User);
        let user: User = await userRepository.findOneOrFail(1);

        let company = new Company();
        company.email = "mirzadanu@ymail.com";
        company.name = "Havana";
        company.phone = "+6287885432955";
        company.address = "Jalan Besi-Jangkang";
        company.city = "Sleman";
        company.state = "DIY";
        company.country = "Indonesia";
        company.description = "Mantab";
        company.user = user
        const companyRepository = getRepository(Company);
        await companyRepository.save(company);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
