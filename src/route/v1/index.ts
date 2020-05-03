import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import product from "./product";
import com from "./company";
import box from "./package";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/product", product)
routes.use("/company", com)
routes.use("/package", box)

export default routes;