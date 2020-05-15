import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { validate } from "class-validator";
import { ServiceVariant } from "../../entity/ServiceVariant";
import { Service } from "../../entity/Service";

export class ServiceVariantController {
    static all = async (req: Request, res: Response) => {
        //Get users from database
        const variantRepository = getRepository(ServiceVariant);

        const variants = await variantRepository.find({
            relations: ["service"],
            order: {
                id: "DESC"
            }
        });

        console.log("Check COM ID " + req.com.id)
    
        if (variants.length == 0) {
            res.send({status: 204, message: "No content."});
        } else {
            //Send the array object
            res.send({status: 200, data: variants});
        }
    };

    static detail = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: string = req.params.id;
    
        //Get the user from database
        const repository = getRepository(ServiceVariant);
        try {
          const data = await repository.findOneOrFail(id, {
            relations: ['service']
          });
          res.send({status: 200, data: data});
        } catch (error) {
          res.status(404).send({status: 404, message: "Service Variant not found."});
        }
    };

    static save = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { name, price, specialPrice, serviceId } = req.body;
        let variant = new ServiceVariant();
        variant.name = name;
        variant.price = price;
        variant.specialPrice = specialPrice;

        if (serviceId != undefined) {
            let service = new Service();
            service.id = serviceId;
            variant.service = service;
        }

        //Validade if the parameters are ok
        const errors = await validate(variant);
        if (errors.length > 0) {
            res.status(400).send({status: 400, errors: errors});
            return;
        }
    
        //Try to save. If fails, the service is already in use
        const repository = getRepository(ServiceVariant);
        try {
          await repository.save(variant);
        } catch (e) {
          res.status(400).send({status: 400, message: "Error on creating service variant."});
          return;
        }
    
        //If all ok, send 201 response
        res.status(201).send({status: 201, message: "Service variant created", data: variant});
    };

    static update = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        //Get values from the body
        let { name, price, specialPrice, serviceId } = req.body;
    
        //Try to find user on database
        const respository = getRepository(ServiceVariant);
        let obj: ServiceVariant;
        try {
          obj = await respository.findOneOrFail(id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send({status: 404, message: "Service Variant not found"});
          return;
        }
    
        //Validate the new values on model
        if (name != undefined) { obj.name = name; };
        if (price != undefined) { obj.price = price; };
        if (specialPrice != undefined) { obj.specialPrice = specialPrice; };
        if (serviceId != undefined) {
            let service = new Service();
            service.id = serviceId;
            obj.service = service;
        }

        const errors = await validate(obj);
        if (errors.length > 0) {
          res.status(400).send({status: 400, message: "Error", errors: errors});
          return;
        }
    
        //Try to save, if fails, that means service already in use
        try {
          await respository.save(obj);
        } catch (e) {
          res.status(409).send({status: 409, message: "service variant already in use"});
          return;
        }
        //After all send a response
        res.status(200).send({status: 200, message: "Service variant updated", data: obj});
    };

    static delete = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        const repository = getRepository(ServiceVariant);
        let variant: ServiceVariant;
        try {
            variant = await repository.findOneOrFail(id);
        } catch (error) {
          res.status(404).send({status: 404, message: "Variant not found"});
          return;
        }
        repository.delete(id);
    
        //After all send a response
        res.status(200).send({status: 200, message: "Service variant deleted."});
    };
}