import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { validate } from "class-validator";
import { Product } from "../entity/Product";

export class ProductController {
    static listAll = async (req: Request, res: Response) => {
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

    static newProduct = async (req: Request, res: Response) => {
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
        res.status(201).send({status: 400, message: "User created", data: product});
    };
}