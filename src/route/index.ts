import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import product from "./product";
import com from "./company";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/product", product)
routes.use("/company", com)

export default routes;