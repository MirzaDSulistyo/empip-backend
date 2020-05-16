import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { validate } from "class-validator";
import { Membership } from "../../entity/Membership";

export class MembershipController {
    
    static all = async (req: Request, res: Response) => {
        //Get data from database
        const repository = getRepository(Membership);

        // const array = await repository.find({ 
        //     company: { id: req.com.id }
        // });

        const array = await repository
            .createQueryBuilder("membership")
            .select("membership.id", "id")
            .addSelect("membership.name", "name")
            .addSelect("membership.descriptions", "descriptions")
            .addSelect("membership.price", "price")
            .addSelect("membership.specialPrice", "specialPrice")
            .addSelect("membership.slot", "slot")
            .addSelect("membership.isUnlimited", "isUnlimited")
            .addSelect("company.id", "com_id")
            .leftJoin("membership.company", "company")
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
    
        //Get the membership from database
        const repository = getRepository(Membership);
        try {
          const data = await repository.findOneOrFail(id);
          res.send({status: 200, data: data});
        } catch (error) {
          res.status(404).send({status: 404, message: "Membership not found."});
        }
    };

    static save = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { name, descriptions, price, slot, specialPrice, isUnlimited } = req.body;
        let membership = new Membership();
        membership.name = name;
        membership.descriptions = descriptions;
        membership.price = price;
        membership.slot = slot;
        membership.specialPrice = specialPrice;
        membership.isUnlimited = isUnlimited;
        membership.company = req.com;

        //Validade if the parameters are ok
        const errors = await validate(membership);
        if (errors.length > 0) {
            res.status(400).send({status: 200, errors: errors});
            return;
        }
    
        //Try to save. If fails, the membership is already in use
        const repository = getRepository(Membership);
        try {
          await repository.save(membership);
        } catch (e) {
          res.status(400).send({status: 400, message: "Error on creating membership."});
          return;
        }
    
        //If all ok, send 201 response
        res.status(201).send({status: 201, message: "Membership created", data: membership});
    };

    static update = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        //Get values from the body
        let { name, descriptions, price, slot, specialPrice, isUnlimited } = req.body;
    
        //Try to find member on database
        const respository = getRepository(Membership);
        let membership: Membership;
        try {
            membership = await respository.findOneOrFail(id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send({status: 400, message: "Membership not found"});
          return;
        }
    
        //Validate the new values on model
        membership.name = name;
        membership.descriptions = descriptions;
        membership.price = price;
        membership.slot = slot;
        membership.specialPrice = specialPrice;
        membership.isUnlimited = isUnlimited;

        const errors = await validate(membership);
        if (errors.length > 0) {
          res.status(400).send({status: 400, message: "Error", errors: errors});
          return;
        }
    
        //Try to save, if fails, that means membership already in use
        try {
          await respository.save(membership);
        } catch (e) {
          res.status(409).send({status: 409, message: "membership already in use"});
          return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(201).send({status: 201, message: "Membership updated", data: membership});
    };

    static delete = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        const repository = getRepository(Membership);
        let membership: Membership;
        try {
            membership = await repository.findOneOrFail(id);
        } catch (error) {
          res.status(404).send({status: 404, message: "Membership not found"});
          return;
        }
        repository.delete(id);
    
        //After all send a 204 (no content, but accepted) response
        res.status(201).send({status: 201, message: "Membership deleted."});
    };
}