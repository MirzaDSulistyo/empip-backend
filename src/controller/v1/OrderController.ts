import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { validate } from "class-validator";
import { Order } from "../../entity/Order";
import { Company } from "../../entity/Company";
import dateFormat = require("dateformat");
import { User } from "../../entity/User";
import { Product } from "../../entity/Product";
import { stat } from "fs";

export class OrderController {

    static all = async (req: Request, res: Response) => {
        //Get orders from database
        const repository = getRepository(Order);
        const array = await repository.find({
          relations: ["company", "products"]
        });
    
        if (array.length == 0) {
          res.send({status: 400, message: "No content."});
        } else {
          //Send the array object
          res.send({status: 200, data: array});
        }
    };

    static detail = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: string = req.params.id;
    
        //Get the order from database
        const repository = getRepository(Order);
        try {
          const data = await repository.findOneOrFail(id, {
            relations: ['company', 'products']
          });
          res.send({status: 200, data: data});
        } catch (error) {
          res.status(404).send({status: 404, message: "Order not found."});
        }
    };

    static save = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { name, descriptions, type, date, time, notes, address, isMembershipOrder, latitude, longitude, comId, products} = req.body;
        
        var invoiceNumber = makeInvoiceNumber(10);
        
        let order = new Order();
        order.name = name;
        order.invoiceNumber = invoiceNumber;
        order.descriptions = descriptions;
        order.type = type;
        order.date = date;
        order.time = time;
        order.notes = notes;
        order.address = address;
        order.latitude = latitude;
        order.longitude = longitude;
        order.status = "NEW"

        let user = new User();
        user.id = + req.userId;
        order.user = user;

        if (isMembershipOrder != undefined) {
            order.isMembershipOrder = isMembershipOrder;
        };

        if (comId != undefined) {
            let company = new Company();
            company.id = comId;
            order.company = company;
        };

        let orderProducts = new Array<Product>();
        if (products != undefined) {
            for (let p of products) {
                let product = p as Product;
                orderProducts.push(product);
            }
        }
        order.products = orderProducts;

        // Validade if the parameters are ok
        const errors = await validate(order);
        if (errors.length > 0) {
            res.status(400).send({status: 200, errors: errors});
            return;
        }
    
        // Try to save. If fails, the product is already in use
        const repository = getRepository(Order);
        try {
          await repository.save(order);
        } catch (e) {
          res.status(400).send({status: 400, message: "Error on creating order."});
          return;
        }
    
        //If all ok, send 201 response
        res.status(201).send({status: 201, message: "Order created", data: order});
    };

    static update = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        //Get values from the body
        const { status } = req.body;
    
        //Try to find order on database
        const respository = getRepository(Order);
        let order: Order;
        try {
          order = await respository.findOneOrFail(id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send({status: 400, message: "Order not found"});
          return;
        }
    
        //Validate the new values on model
        order.status = status;

        const errors = await validate(order);
        if (errors.length > 0) {
          res.status(400).send({status: 400, message: "Error", errors: errors});
          return;
        }
    
        //Try to save, if fails, that means order already in use
        try {
          await respository.save(order);
        } catch (e) {
          res.status(409).send({status: 409, message: "order already in use"});
          return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(201).send({status: 201, message: "Order updated", data: order});
    };

    static delete = async (req: Request, res: Response) => {
      //Get the ID from the url
      const id = req.params.id;
  
      const repository = getRepository(Order);
      let order: Order;
      try {
        order = await repository.findOneOrFail(id);
      } catch (error) {
        res.status(404).send({status: 404, message: "Order not found"});
        return;
      }
      repository.delete(id);
  
      //After all send a response
      res.status(200).send({status: 200, message: "Order deleted."});
    };
}

function makeInvoiceNumber(length: number): string {
    var dateNow = dateFormat(new Date(), "yymmdd");
    var result           = "" + dateNow;
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};