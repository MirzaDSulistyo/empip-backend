import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { Company } from "../entity/Company";

export const checkCompany = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const id = req.userId;

    //Get user role from the database
    const productRepository = getRepository(Company);
    let com: Company;
    try {
      com = await productRepository.findOneOrFail(id);
    } catch (id) {
      res.status(400).send({ status: 400, message: "You don't have a company"});
    }

    // if everything is good, save to request for use in other routes
    req.com = com;

    // //Check if array of authorized roles includes the user's role
    // if (com != null) next();
    // else res.status(400).send({ status: 400, message: "You don't have a company."});
    
    //Call the next middleware or controller
    next();
  };
};