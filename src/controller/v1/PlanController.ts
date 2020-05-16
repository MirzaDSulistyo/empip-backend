import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { validate } from "class-validator";
import { Plan } from "../../entity/Plan";
import { Product } from "../../entity/Product";

export class PlanController {
    
    static all = async (req: Request, res: Response) => {
        //Get data from database
        const repository = getRepository(Plan);

        // const array = await repository.find({ 
        //     company: { id: req.com.id }
        // });

        const array = await repository
            .createQueryBuilder("plan")
            .select("plan.id", "id")
            .addSelect("plan.name", "name")
            .addSelect("plan.descriptions", "descriptions")
            .addSelect("plan.periodic", "periodic")
            .addSelect("plan.type", "type")
            .addSelect("plan.days", "days")
            .addSelect("plan.startDate", "startDate")
            .addSelect("plan.endDate", "endDate")
            .addSelect("plan.time", "time")
            .addSelect("plan.notes", "notes")
            .addSelect("plan.address", "address")
            .addSelect("company.id", "com_id")
            .leftJoin("plan.company", "company")
            .where("company.id = :id", { id: req.com.id })
            .execute();

        console.log("Check COM ID " + req.com.id)
    
        if (array.length == 0) {
            res.send({status: 204, message: "No content."});
        } else {
            //Send the array object
            res.send({status: 200, data: array});
        }
    };

    static detail = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: string = req.params.id;
    
        //Get the plan from database
        const repository = getRepository(Plan);
        try {
          const data = await repository.findOneOrFail(id);
          res.send({status: 200, data: data});
        } catch (error) {
          res.status(404).send({status: 404, message: "Plan not found."});
        }
    };

    static save = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { name, descriptions, periodic, type, days, startDate, endDate, time, notes, address, products } = req.body;
        let plan = new Plan();
        plan.name = name;
        plan.descriptions = descriptions;
        plan.periodic = periodic;
        plan.type = type;
        plan.days = days;
        plan.startDate = startDate;
        plan.endDate = endDate;
        plan.time = time;
        plan.notes = notes;
        plan.address = address;
        plan.company = req.com;

        let orderProducts = new Array<Product>();
        if (products != undefined) {
            for (let p of products) {
                let product = p as Product;
                orderProducts.push(product);
            }
        }
        plan.products = orderProducts;

        //Validade if the parameters are ok
        const errors = await validate(plan);
        if (errors.length > 0) {
            res.status(400).send({status: 200, errors: errors});
            return;
        }
    
        //Try to save. If fails, the plan is already in use
        const repository = getRepository(Plan);
        try {
          await repository.save(plan);
        } catch (e) {
          res.status(400).send({status: 400, message: "Error on creating plan."});
          return;
        }
    
        //If all ok, send 201 response
        res.status(201).send({status: 201, message: "Plan created", data: plan});
    };

    static update = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        //Get values from the body
        let { name, descriptions, periodic, type, days, startDate, endDate, time, notes, address } = req.body;
    
        //Try to find plan on database
        const respository = getRepository(Plan);
        let plan: Plan;
        try {
            plan = await respository.findOneOrFail(id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send({status: 400, message: "Plan not found"});
          return;
        }
    
        //Validate the new values on model
        plan.name = name;
        plan.descriptions = descriptions;
        plan.periodic = periodic;
        plan.type = type;
        plan.days = days;
        plan.startDate = startDate;
        plan.endDate = endDate;
        plan.time = time;
        plan.notes = notes;
        plan.address = address;

        const errors = await validate(plan);
        if (errors.length > 0) {
          res.status(400).send({status: 400, message: "Error", errors: errors});
          return;
        }
    
        //Try to save, if fails, that means plan already in use
        try {
          await respository.save(plan);
        } catch (e) {
          res.status(409).send({status: 409, message: "plan already in use"});
          return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(201).send({status: 201, message: "Plan updated", data: plan});
    };

    static delete = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        const repository = getRepository(Plan);
        let plan: Plan;
        try {
            plan = await repository.findOneOrFail(id);
        } catch (error) {
          res.status(404).send({status: 404, message: "Plan not found"});
          return;
        }
        repository.delete(id);
    
        //After all send a 204 (no content, but accepted) response
        res.status(201).send({status: 201, message: "Plan deleted."});
    };
}