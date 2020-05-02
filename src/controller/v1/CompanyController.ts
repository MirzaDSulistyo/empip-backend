import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { validate } from "class-validator";
import { Company } from "../../entity/Company";
import { User } from "../../entity/User";

export class CompanyController {
    
    static all = async (req: Request, res: Response) => {
        //Get users from database
        const repository = getRepository(Company);
        const companies = await repository.find({
        //select: ["id", "name", "description", "role", "createdAt"], //We dont want to send the passwords on response
        relations: ["products", "user"]
        });

        if (companies.length == 0) {
        res.send({status: 400, message: "No content."});
        }
        //Send the companies object
        res.send({status: 200, data: companies});
    };

    static detail = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: string = req.params.id;
    
        //Get the user from database
        const repository = getRepository(Company);
        try {
          const data = await repository.findOneOrFail(id, {
            relations: ["products"]
          });
          res.send({status: 200, data: data});
        } catch (error) {
          res.status(404).send({status: 404, message: "Company not found."});
        }
    };

    static save = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { email, name, phone, address, city, state, country, description } = req.body;

        const userRepository = getRepository(User);
        let user: User = await userRepository.findOneOrFail(req.userId);

        let company = new Company();
        company.email = email;
        company.name = name;
        company.phone = phone;
        company.address = address;
        company.city = city;
        company.state = state;
        company.country = country;
        company.description = description;
        company.user = user

        //Validade if the parameters are ok
        const errors = await validate(company);
        if (errors.length > 0) {
            res.status(400).send({status: 200, errors: errors});
            return;
        }
    
        //Try to save. If fails, the username is already in use
        const repository = getRepository(Company);
        try {
          await repository.save(company);
        } catch (e) {
          res.status(400).send({status: 400, message: "Company already added."});
          return;
        }
    
        //If all ok, send 201 response
        res.status(201).send({status: 201, message: "Comapny created", data: company});
    };

    static update = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        //Get values from the body
        let { email, name, phone, address, city, state, country, description } = req.body;
    
        //Try to find user on database
        const respository = getRepository(Company);
        let company;
        try {
          company = await respository.findOneOrFail(id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send({status: 400, message: "Company not found"});
          return;
        }
    
        //Validate the new values on model
        company.email = email;
        company.name = name;
        company.phone = phone;
        company.address = address;
        company.city = city;
        company.state = state;
        company.country = country;
        company.description = description;
        //company.user = user

        const errors = await validate(company);
        if (errors.length > 0) {
          res.status(400).send({status: 400, message: "Error", errors: errors});
          return;
        }
    
        //Try to save, if fails, that means company already in use
        try {
          await respository.save(company);
        } catch (e) {
          res.status(409).send({status: 409, message: "company already in use"});
          return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(201).send({status: 201, message: "Company updated", data: company});
    };

    static delete = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        const repository = getRepository(Company);
        let company: Company;
        try {
            company = await repository.findOneOrFail(id);
        } catch (error) {
          res.status(404).send({status: 404, message: "Company not found"});
          return;
        }
        repository.delete(id);
    
        //After all send a 204 (no content, but accepted) response
        res.status(201).send({status: 201, message: "Company deleted."});
    };
}