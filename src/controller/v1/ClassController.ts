import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { validate } from "class-validator";
import { Class } from "../../entity/Class";
import { ClassSession } from "../../entity/ClassSession";

export class ClassController {
    
    static all = async (req: Request, res: Response) => {
        //Get users from database
        const classRepository = getRepository(Class);

        // const classes = await classRepository.find({
        //   select: ["id", "name", "descriptions", "available"],
        //   relations: ['sessions'],
        //   where: { company: { id: req.com.id } }
        // });

        const classes = await classRepository.createQueryBuilder('class')
          .select(['sessions.id', 'sessions.name', 'sessions.price', 'sessions.specialPrice', 'sessions.startDate', 'sessions.endDate', 'sessions.days', 'sessions.startTime', 'sessions.duration', 'sessions.blockingDates', 'class.id', 'class.name', 'class.descriptions', 'class.available'])
          .leftJoin("class.company", "company") // company is the joined table
          .leftJoin('class.sessions', 'sessions') // sessions is the joined table
          .where("company.id = :id", { id: req.com.id })
          .getMany();

        console.log("Check COM ID " + req.com.id)
    
        if (classes.length == 0) {
            res.send({status: 204, message: "No content."});
        } else {
            //Send the array object
            res.send({status: 200, data: classes});
        }
    };

    static detail = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: string = req.params.id;
    
        //Get the user from database
        const repository = getRepository(Class);
        try {
          const data = await repository.findOneOrFail(id, {
            relations: ['sessions']
          });
          res.send({status: 200, data: data});
        } catch (error) {
          res.status(404).send({status: 404, message: "Class not found."});
        }
    };

    static save = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { name, available, descriptions } = req.body;
        let classData = new Class();
        classData.name = name;
        classData.available = available;
        classData.descriptions = descriptions;

        const sessionRepository = getRepository(ClassSession);

        let sessions = new Array<ClassSession>();
        //console.log("save class log " + req.body.session.length + " " + name);
        for (let c of req.body.session) {
            let session = c as ClassSession;
            let newSession = new ClassSession();
            newSession.name = session.name;
            newSession.price = session.price;
            newSession.specialPrice = session.specialPrice;
            newSession.startDate = session.startDate;
            newSession.endDate = session.endDate;
            newSession.days = session.days;
            newSession.startTime = session.startTime;
            newSession.duration = session.duration;
            newSession.blockingDates = session.blockingDates;
            
            //console.log("save class log " + JSON.stringify(newSession));

            //Validade if the parameters are ok
            const errors = await validate(newSession);
            if (errors.length > 0) {
                res.status(400).send({status: 400, errors: errors});
                return;
            }

            try {
                await sessionRepository.save(newSession);
              } catch (e) {
                res.status(400).send({status: 400, message: "Error on creating sessions."});
                return;
            }

            sessions.push(newSession);
        }
        console.log("save class log " + sessions.length);
        classData.sessions = sessions;
        classData.company = req.com;

        //Validade if the parameters are ok
        const errors = await validate(classData);
        if (errors.length > 0) {
            res.status(400).send({status: 400, errors: errors});
            return;
        }
    
        //Try to save. If fails, the class is already in use
        const repository = getRepository(Class);
        try {
          await repository.save(classData);
        } catch (e) {
          res.status(400).send({status: 400, message: "Error on creating class."});
          return;
        }
    
        //If all ok, send 201 response
        res.status(201).send({status: 201, message: "Class created", data: classData});
    };

    static update = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        //Get values from the body
        let { name, available, descriptions } = req.body;
    
        //Try to find user on database
        const respository = getRepository(Class);
        let classData: Class;
        try {
          classData = await respository.findOneOrFail(id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send({status: 404, message: "Class not found"});
          return;
        }
    
        //Validate the new values on model
        classData.name = name;
        classData.available = available;
        classData.descriptions = descriptions;

        let sessionsBody = new Array<ClassSession>();
        if (req.body.session != undefined) {
          for (let c of req.body.session) {
            let session = c as ClassSession;
            sessionsBody.push(session);
          }
        }

        const sessionRepository = getRepository(ClassSession);

        const sessions = await sessionRepository.find({
          where: { class: { id: classData.id } }
        });

        for (let s of sessions) {
          let found = sessionsBody.find(data => data.id == s.id);

          //console.log("check found session " + found.id + " " + s.id)

          if (found != undefined) {
            try {
              await sessionRepository.save(s);
              console.log("on update session success " + s.id)
            } catch (e) {
              console.log("on update session error")
            }
          } else {
            sessionRepository.delete(s.id);
          }
        };

        for (let s of sessionsBody) {
          console.log("check new session " + s.id)
          if (s.id == undefined) {
            try {
              s.class = classData;
              await sessionRepository.save(s);
              console.log("on add session success " + s.id);
            } catch (e) {
              console.log("on add session error");
            }
          }
        };

        const errors = await validate(classData);
        if (errors.length > 0) {
          res.status(400).send({status: 400, message: "Error", errors: errors});
          return;
        }
    
        //Try to save, if fails, that means class already in use
        try {
          await respository.save(classData);
        } catch (e) {
          res.status(409).send({status: 409, message: "class already in use"});
          return;
        }
        //After all send a response
        //res.status(200).send({status: 200, message: "Class updated", data: classData, sessions: sessions});
        const data = await respository.findOneOrFail(classData.id, {
          relations: ['sessions']
        });

        res.send({status: 200, message: "Class updated", data: data});
    };

    static delete = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
    
        const repository = getRepository(Class);
        let classData: Class;
        try {
            classData = await repository.findOneOrFail(id);
        } catch (error) {
          res.status(404).send({status: 404, message: "Class not found"});
          return;
        }
        repository.delete(id);
    
        //After all send a response
        res.status(200).send({status: 200, message: "Class deleted."});
    };
}