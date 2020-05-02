import { Router, Request, Response } from "express";
import auth from "./v1/auth";
import user from "./v1/user";
import product from "./v1/product";
import com from "./v1/company";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/product", product)
routes.use("/company", com)

export default routes;