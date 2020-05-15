import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { validate } from "class-validator";
import { Service } from "../../entity/Service";
import { ServiceVariant } from "../../entity/ServiceVariant";

export class ServiceController {
    
    static all = async (req: Request, res: Response) => {
        //Get users from database
        const repository = getRepository(Service);

        const services = await repository.createQueryBuilder('service')
          .select(['variants.id', 'variants.name', 'variants.price', 'variants.specialPrice', 'service.id', 'service.name', 'service.descriptions', 'service.available'])
          .leftJoin("service.company", "company") // company is the joined table
          .leftJoin('service.variants', 'variants') // variants is the joined table
          .where("company.id = :id", { id: req.com.id })
          .getMany();

        console.log("Check COM ID " + req.com.id)
    
        if (services.length == 0) {
            res.send({status: 204, message: "No content."});
        } else {
            //Send the array object
            res.send({status: 200, data: services});
        }
    };

    static detail = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: string = req.params.id;
    
        //Get the user from database
        const repository = getRepository(Service);
        try {
          const data = await repository.findOneOrFail(id, {
            relations: ['variants']
          });
          res.send({status: 200, data: data});
        } catch (error) {
          res.status(404).send({status: 404, message: "Service not found."});
        }
    };

    static save = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { name, available, descriptions } = req.body;
        let data = new Service();
        data.name = name;
        data.available = available;
        data.descriptions = descriptions;

        const variantRepository = getRepository(ServiceVariant);

        let variants = new Array<ServiceVariant>();
        //console.log("save service log " + req.body.variants.length + " " + name);
        if (req.body.variants != undefined) {
            for (let c of req.body.variants) {
                let variant = c as ServiceVariant;
                let newVariant = new ServiceVariant();
                newVariant.name = variant.name;
                newVariant.price = variant.price;
                newVariant.specialPrice = variant.specialPrice;
    
                //Validade if the parameters are ok
                const errors = await validate(newVariant);
                if (errors.length > 0) {
                    res.status(400).send({status: 400, errors: errors});
                    return;
                }
    
                try {
                    await variantRepository.save(newVariant);
                  } catch (e) {
                    res.status(400).send({status: 400, message: "Error on creating variants."});
                    return;
                }
    
                variants.push(newVariant);
            }
        }
        console.log("save service log " + variants.length);
        data.variants = variants;
        data.company = req.com;

        //Validade if the parameters are ok
        const errors = await validate(data);
        if (errors.length > 0) {
            res.status(400).send({status: 400, errors: errors});
            return;
        }
    
        //Try to save. If fails, the service is already in use
        const repository = getRepository(Service);
        try {
          await repository.save(data);
        } catch (e) {
          res.status(400).send({status: 400, message: "Error on creating service."});
          return;
        }
    
        //If all ok, send 201 response
        res.status(201).send({status: 201, message: "Service created", data: data});
    };

    static update = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        //Get values from the body
        let { name, available, descriptions } = req.body;
    
        //Try to find user on database
        const respository = getRepository(Service);
        let service: Service;
        try {
            service = await respository.findOneOrFail(id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send({status: 404, message: "Service not found"});
          return;
        }
    
        //Validate the new values on model
        service.name = name;
        service.available = available;
        service.descriptions = descriptions;

        let variantsBody = new Array<ServiceVariant>();
        if (req.body.variants != undefined) {
          for (let c of req.body.variants) {
            let variant = c as ServiceVariant;
            variantsBody.push(variant);
          }
        }

        const variantRepository = getRepository(ServiceVariant);

        const variants = await variantRepository.find({
          where: { service: { id: service.id } }
        });

        for (let s of variants) {
          let found = variantsBody.find(data => data.id == s.id);

          //console.log("check found variant " + found.id + " " + s.id)

          if (found != undefined) {
            try {
              await variantRepository.save(s);
              console.log("on update variant success " + s.id)
            } catch (e) {
              console.log("on update variant error")
            }
          } else {
            variantRepository.delete(s.id);
          }
        };

        for (let s of variantsBody) {
          console.log("check new variant " + s.id)
          if (s.id == undefined) {
            try {
              s.service = service;
              await variantRepository.save(s);
              console.log("on add variant success " + s.id);
            } catch (e) {
              console.log("on add variant error");
            }
          }
        };

        const errors = await validate(service);
        if (errors.length > 0) {
          res.status(400).send({status: 400, message: "Error", errors: errors});
          return;
        }
    
        //Try to save, if fails, that means service already in use
        try {
          await respository.save(service);
        } catch (e) {
          res.status(409).send({status: 409, message: "service already in use"});
          return;
        }
        //After all send a response
        //res.status(200).send({status: 200, message: "Service updated", data: service, variants: variants});
        const data = await respository.findOneOrFail(service.id, {
          relations: ['variants']
        });

        res.send({status: 200, message: "Service updated", data: data});
    };

    static delete = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        const repository = getRepository(Service);
        let service: Service;
        try {
            service = await repository.findOneOrFail(id);
        } catch (error) {
          res.status(404).send({status: 404, message: "Service not found"});
          return;
        }
        repository.delete(id);
    
        //After all send a response
        res.status(200).send({status: 200, message: "Service deleted."});
    };
}