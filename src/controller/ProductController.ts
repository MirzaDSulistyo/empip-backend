import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { validate } from "class-validator";
import { Product } from "../entity/Product";

export class ProductController {
    
    static all = async (req: Request, res: Response) => {
        //Get users from database
        const productRepository = getRepository(Product);

        // const products = await productRepository.find({ 
        //     company: { id: req.com.id }
        // });

        const products = await productRepository
            .createQueryBuilder("product")
            //.select(["product.id", "product.name", "product.descriptions"])
            .select("product.id", "id")
            .addSelect("product.name", "name")
            .addSelect("product.descriptions", "descriptions")
            .addSelect("company.id", "com_id")
            .leftJoin("product.company", "company")
            .where("company.id = :id", { id: req.com.id })
            .execute();

        console.log("Check COM ID " + req.com.id)
    
        if (products.length == 0) {
            res.send({status: 204, message: "No content."});
        } else {
            //Send the users object
            res.send({status: 200, data: products});
        }
    };

    static detail = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: string = req.params.id;
    
        //Get the user from database
        const repository = getRepository(Product);
        try {
          const data = await repository.findOneOrFail(id);
          res.send({status: 200, data: data});
        } catch (error) {
          res.status(404).send({status: 404, message: "Product not found."});
        }
    };

    static save = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { name, descriptions, price, stock } = req.body;
        let product = new Product();
        product.name = name;
        product.descriptions = descriptions;
        product.price = price;
        product.stock = stock;
        product.company = req.com;

        //Validade if the parameters are ok
        const errors = await validate(product);
        if (errors.length > 0) {
            res.status(400).send({status: 200, errors: errors});
            return;
        }
    
        //Try to save. If fails, the username is already in use
        const repository = getRepository(Product);
        try {
          await repository.save(product);
        } catch (e) {
          res.status(400).send({status: 400, message: "product already added."});
          return;
        }
    
        //If all ok, send 201 response
        res.status(201).send({status: 201, message: "Product created", data: product});
    };

    static update = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        //Get values from the body
        const { name, descriptions, price, stock } = req.body;
    
        //Try to find user on database
        const respository = getRepository(Product);
        let product;
        try {
          product = await respository.findOneOrFail(id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send({status: 400, message: "User not found"});
          return;
        }
    
        //Validate the new values on model
        product.name = name;
        product.descriptions = descriptions;
        product.price = price;
        product.stock = stock;

        const errors = await validate(product);
        if (errors.length > 0) {
          res.status(400).send({status: 400, message: "Error", errors: errors});
          return;
        }
    
        //Try to save, if fails, that means username already in use
        try {
          await respository.save(product);
        } catch (e) {
          res.status(409).send({status: 409, message: "username already in use"});
          return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(201).send({status: 201, message: "Product updated", data: product});
    };

    static delete = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        const repository = getRepository(Product);
        let product: Product;
        try {
          product = await repository.findOneOrFail(id);
        } catch (error) {
          res.status(404).send({status: 404, message: "User not found"});
          return;
        }
        repository.delete(id);
    
        //After all send a 204 (no content, but accepted) response
        res.status(201).send({status: 201, message: "Product deleted."});
    };
}