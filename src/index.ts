import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./route/v1";
import { Company } from "./entity/Company";

declare global {
    namespace Express {
        interface Request {
            userId?: string,
            com?: Company
        }
    }
}

createConnection().then(async connection => {

    // create express app
    const app = express();

    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    //Set all routes from routes folder
    app.use("/api/v1", routes);

    // start express server
    app.listen(3000);

    console.log("Express server has started on port 3000. Open http://localhost:3000/api/v1/user to see results");

}).catch(error => console.log(error));
