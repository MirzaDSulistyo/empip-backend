import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { validate } from "class-validator";
import { Asset } from "../../entity/Asset";

export class AssetController {
    
    static all = async (req: Request, res: Response) => {
        //Get users from database
        const productRepository = getRepository(Asset);

        // const products = await productRepository.find({ 
        //     company: { id: req.com.id }
        // });

        const products = await productRepository
            .createQueryBuilder("asset")
            .select("asset.id", "id")
            .addSelect("asset.name", "name")
            .addSelect("asset.descriptions", "descriptions")
            .addSelect("asset.price", "price")
            .addSelect("asset.specialPrice", "specialPrice")
            .addSelect("asset.stock", "stock")
            .addSelect("company.id", "com_id")
            .leftJoin("asset.company", "company")
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
        const repository = getRepository(Asset);
        try {
          const data = await repository.findOneOrFail(id);
          res.send({status: 200, data: data});
        } catch (error) {
          res.status(404).send({status: 404, message: "Product not found."});
        }
    };

    static save = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { name, descriptions, price, stock, specialPrice } = req.body;
        let asset = new Asset();
        asset.name = name;
        asset.descriptions = descriptions;
        asset.price = price;
        asset.stock = stock;
        asset.specialPrice = specialPrice;
        asset.company = req.com;

        //Validade if the parameters are ok
        const errors = await validate(asset);
        if (errors.length > 0) {
            res.status(400).send({status: 400, errors: errors});
            return;
        }
    
        //Try to save. If fails, the asset is already in use
        const repository = getRepository(Asset);
        try {
          await repository.save(asset);
        } catch (e) {
          res.status(400).send({status: 400, message: "Error on creating asset."});
          return;
        }
    
        //If all ok, send 201 response
        res.status(201).send({status: 201, message: "Asset created", data: asset});
    };

    static update = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        //Get values from the body
        const { name, descriptions, price, stock, specialPrice } = req.body;
    
        //Try to find user on database
        const respository = getRepository(Asset);
        let asset: Asset;
        try {
            asset = await respository.findOneOrFail(id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send({status: 404, message: "Asset not found"});
          return;
        }
    
        //Validate the new values on model
        asset.name = name;
        asset.descriptions = descriptions;
        asset.price = price;
        asset.stock = stock;
        asset.specialPrice = specialPrice;

        const errors = await validate(asset);
        if (errors.length > 0) {
          res.status(400).send({status: 400, message: "Error", errors: errors});
          return;
        }
    
        //Try to save, if fails, that means asset already in use
        try {
          await respository.save(asset);
        } catch (e) {
          res.status(409).send({status: 409, message: "asset already in use"});
          return;
        }
        //After all send a response
        res.status(200).send({status: 200, message: "Asset updated", data: asset});
    };

    static delete = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        const repository = getRepository(Asset);
        let asset: Asset;
        try {
            asset = await repository.findOneOrFail(id);
        } catch (error) {
          res.status(404).send({status: 404, message: "Asset not found"});
          return;
        }
        repository.delete(id);
    
        //After all send a response
        res.status(200).send({status: 200, message: "Asset deleted."});
    };
}