import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { validate } from "class-validator";
import { Voucher } from "../../entity/Voucher";

export class VoucherController {
    
    static all = async (req: Request, res: Response) => {
        //Get vouchers from database
        const respository = getRepository(Voucher);

        const array = await respository
            .createQueryBuilder("voucher")
            .select("voucher.id", "id")
            .addSelect("voucher.name", "name")
            .addSelect("voucher.descriptions", "descriptions")
            .addSelect("voucher.price", "price")
            .addSelect("voucher.startDate", "startDate")
            .addSelect("voucher.endDate", "endDate")
            .addSelect("voucher.messages", "messages")
            .addSelect("company.id", "com_id")
            .leftJoin("voucher.company", "company")
            .where("company.id = :id", { id: req.com.id })
            .execute();

        console.log("Check COM ID " + req.com.id)
    
        if (array.length == 0) {
            res.send({status: 204, message: "No content."});
        } else {
            //Send the vouchers object
            res.send({status: 200, data: array});
        }
    };

    static detail = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: string = req.params.id;
    
        //Get the voucher from database
        const repository = getRepository(Voucher);
        try {
          const data = await repository.findOneOrFail(id);
          res.send({status: 200, data: data});
        } catch (error) {
          res.status(404).send({status: 404, message: "Voucher not found."});
        }
    };

    static save = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { name, descriptions, price, startDate, endDate, messages } = req.body;
        let voucher = new Voucher();
        voucher.name = name;
        voucher.descriptions = descriptions;
        voucher.price = price;
        voucher.startDate = startDate;
        voucher.endDate = endDate;
        voucher.messages = messages;
        voucher.company = req.com;

        //Validade if the parameters are ok
        const errors = await validate(voucher);
        if (errors.length > 0) {
            res.status(400).send({status: 200, errors: errors});
            return;
        }
    
        //Try to save. If fails, the voucher is already in use
        const repository = getRepository(Voucher);
        try {
          await repository.save(voucher);
        } catch (e) {
          res.status(400).send({status: 400, message: "Error on creating voucher."});
          return;
        }
    
        //If all ok, send 201 response
        res.status(201).send({status: 201, message: "Voucher created", data: voucher});
    };

    static update = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        //Get values from the body
        let { name, descriptions, price, startDate, endDate, messages } = req.body;
    
        //Try to find voucher on database
        const respository = getRepository(Voucher);
        let voucher: Voucher;
        try {
            voucher = await respository.findOneOrFail(id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send({status: 400, message: "Voucher not found"});
          return;
        }
    
        //Validate the new values on model
        voucher.name = name;
        voucher.descriptions = descriptions;
        voucher.price = price;
        voucher.startDate = startDate;
        voucher.endDate = endDate;
        voucher.messages = messages;

        const errors = await validate(voucher);
        if (errors.length > 0) {
          res.status(400).send({status: 400, message: "Error", errors: errors});
          return;
        }
    
        //Try to save, if fails, that means voucher already in use
        try {
          await respository.save(voucher);
        } catch (e) {
          res.status(409).send({status: 409, message: "voucher already in use"});
          return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(201).send({status: 201, message: "Voucher updated", data: voucher});
    };

    static delete = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        const repository = getRepository(Voucher);
        let voucher: Voucher;
        try {
            voucher = await repository.findOneOrFail(id);
        } catch (error) {
          res.status(404).send({status: 404, message: "Voucher not found"});
          return;
        }
        repository.delete(id);
    
        //After all send a 204 (no content, but accepted) response
        res.status(201).send({status: 201, message: "Voucher deleted."});
    };
}