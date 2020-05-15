import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { validate } from "class-validator";
import { Class } from "../../entity/Class";
import { ClassSession } from "../../entity/ClassSession";

export class ClassSessionController {
    static all = async (req: Request, res: Response) => {
        //Get users from database
        const sessionRepository = getRepository(ClassSession);

        const sessions = await sessionRepository.find({
            relations: ["class"],
            order: {
                id: "DESC"
            }
        });

        /*const classes = await classRepository.createQueryBuilder('class')
          .select(['sessions.id', 'sessions.name', 'sessions.price', 'class.id', 'class.name', 'class.descriptions', 'class.available'])
          .leftJoin("class.company", "company") // company is the joined table
          .leftJoin('class.sessions', 'sessions') // sessions is the joined table
          .where("company.id = :id", { id: req.com.id })
          .getMany();*/

        console.log("Check COM ID " + req.com.id)
    
        if (sessions.length == 0) {
            res.send({status: 204, message: "No content."});
        } else {
            //Send the array object
            res.send({status: 200, data: sessions});
        }
    };

    static detail = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: string = req.params.id;
    
        //Get the user from database
        const repository = getRepository(ClassSession);
        try {
          const data = await repository.findOneOrFail(id, {
            relations: ['class']
          });
          res.send({status: 200, data: data});
        } catch (error) {
          res.status(404).send({status: 404, message: "Class Session not found."});
        }
    };

    static save = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { name, price, specialPrice, startDate, endDate, days, startTime, duration, blockingDates, classId } = req.body;
        let session = new ClassSession();
        session.name = name;
        session.price = price;
        session.specialPrice = specialPrice;
        session.startDate = startDate;
        session.endDate = endDate;
        session.days = days;
        session.startTime = startTime;
        session.duration = duration;
        session.blockingDates = blockingDates;

        if (classId != undefined) {
            let classData = new Class();
            classData.id = classId;
            session.class = classData;
        }

        //Validade if the parameters are ok
        const errors = await validate(session);
        if (errors.length > 0) {
            res.status(400).send({status: 400, errors: errors});
            return;
        }
    
        //Try to save. If fails, the class is already in use
        const repository = getRepository(ClassSession);
        try {
          await repository.save(session);
        } catch (e) {
          res.status(400).send({status: 400, message: "Error on creating class session."});
          return;
        }
    
        //If all ok, send 201 response
        res.status(201).send({status: 201, message: "Class session created", data: session});
    };

    static update = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        //Get values from the body
        let { name, price, specialPrice, startDate, endDate, days, startTime, duration, blockingDates, classId } = req.body;
    
        //Try to find user on database
        const respository = getRepository(ClassSession);
        let obj: ClassSession;
        try {
          obj = await respository.findOneOrFail(id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send({status: 404, message: "Class Session not found"});
          return;
        }
    
        //Validate the new values on model
        if (name != undefined) { obj.name = name; };
        if (price != undefined) { obj.price = price; };
        if (specialPrice != undefined) { obj.specialPrice = specialPrice; };
        if (startDate != undefined) { obj.startDate = startDate; };
        if (endDate != undefined) { obj.endDate = endDate; };
        if (days != undefined) { obj.days = days; };
        if (startTime != undefined) { obj.startTime = startTime; };
        if (duration != undefined) { obj.duration = duration; };
        if (blockingDates != undefined) { obj.blockingDates = blockingDates; };
        if (classId != undefined) {
            let classData = new Class();
            classData.id = classId;
            obj.class = classData;
        }

        const errors = await validate(obj);
        if (errors.length > 0) {
          res.status(400).send({status: 400, message: "Error", errors: errors});
          return;
        }
    
        //Try to save, if fails, that means class already in use
        try {
          await respository.save(obj);
        } catch (e) {
          res.status(409).send({status: 409, message: "class session already in use"});
          return;
        }
        //After all send a response
        res.status(200).send({status: 200, message: "Class session updated", data: obj});
    };

    static delete = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        const repository = getRepository(ClassSession);
        let session: ClassSession;
        try {
            session = await repository.findOneOrFail(id);
        } catch (error) {
          res.status(404).send({status: 404, message: "Session not found"});
          return;
        }
        repository.delete(id);
    
        //After all send a response
        res.status(200).send({status: 200, message: "Class session deleted."});
    };
}