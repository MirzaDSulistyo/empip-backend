import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { validate } from "class-validator";
import { Package } from "../../entity/Package";
import { Product } from "../../entity/Product";

export class PackageController {

    static all = async (req: Request, res: Response) => {
        //Get users from database
        const repository = getRepository(Package);

        const array = await repository.find({ 
            where: { comId: req.com.id},
            relations: ["products"]
        });

        console.log("Check COM ID " + req.com.id)
    
        if (array.length == 0) {
            res.send({status: 204, message: "No content."});
        } else {
            //Send the array
            res.send({status: 200, data: array});
        }
    };

    static save = async (req: Request, res: Response) => {
        const productRepository = getRepository(Product);

        console.log("check productIds " + req.body.products);

        if(!(req.body.products instanceof Array)){
            if(typeof req.body.products==='undefined') {
              console.log("new box undefined");
              req.body.products=[];
            }
            else {
              console.log("new box defined");
              req.body.products=new Array(req.body.products);
            }
        }
        
        let productIds: string = req.body.products + "";
        let ids = productIds.split(",");
        let array = new Array<Product>();
        for (let p of ids) {
            let product = new Product();
            product.id = Number(p);
            array.push(product);
        }

        //Get parameters from the body
        let { name, descriptions, price, specialPrice } = req.body;
        let box = new Package();
        box.name = name;
        box.descriptions = descriptions;
        box.price = price;
        box.specialPrice = specialPrice;
        box.comId = req.com.id;
        box.products = array;

        //Validade if the parameters are ok
        const errors = await validate(box);
        if (errors.length > 0) {
            res.status(400).send({status: 400, errors: errors});
            return;
        }
    
        //Try to save. If fails, the username is already in use
        const repository = getRepository(Package);
        try {
          await repository.save(box);
        } catch (e) {
          res.status(400).send({status: 400, message: "Package already added."});
          return;
        }
    
        //If all ok, send 201 response
        res.status(201).send({status: 201, message: "Package created", data: box});

        //res.status(201).send({status: 201, message: "Debugging", data: box, products: array});
    };

    static detail = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: string = req.params.id;
    
        //Get the user from database
        const repository = getRepository(Package);
        try {
          const data = await repository.findOneOrFail(id, {
            relations: ["products"]
          });
          res.send({status: 200, data: data});
        } catch (error) {
          res.status(404).send({status: 404, message: "Package not found."});
        }
    };

    static update = async (req: Request, res: Response) => {
      //Get the ID from the url
      const id = req.params.id;
  
      let { name, descriptions, price, specialPrice } = req.body;

      let productIds: string = req.body.products + "";
      let ids = productIds.split(",");
      let array = new Array<Product>();
      for (let p of ids) {
        let product = new Product();
        product.id = Number(p);
        array.push(product);
      }

      //Try to find user on database
      const respository = getRepository(Package);
      let box: Package;
      try {
        box = await respository.findOneOrFail(id);
      } catch (error) {
        //If not found, send a 404 response
        res.status(404).send({status: 400, message: "Package not found"});
        return;
      }
  
      //Validate the new values on model
      box.name = name;
      box.descriptions = descriptions;
      box.price = price;
      box.specialPrice = specialPrice;
      box.comId = req.com.id;
      box.products = array;

      const errors = await validate(box);
      if (errors.length > 0) {
        res.status(400).send({status: 400, message: "Error", errors: errors});
        return;
      }
  
      //Try to save, if fails, that means package already in use
      try {
        await respository.save(box);
      } catch (e) {
        res.status(409).send({status: 409, message: "package already in use"});
        return;
      }
      //After all send a 204 (no content, but accepted) response
      res.status(201).send({status: 201, message: "Package updated", data: box});
  };

    static delete = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        const repository = getRepository(Package);
        let box: Package;
        try {
            box = await repository.findOneOrFail(id);
        } catch (error) {
          res.status(404).send({status: 404, message: "Package not found"});
          return;
        }
        repository.delete(id);
    
        //After all send a 204 (no content, but accepted) response
        res.status(201).send({status: 201, message: "Package deleted."});
    };

}