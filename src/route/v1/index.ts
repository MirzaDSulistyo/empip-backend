import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import product from "./product";
import com from "./company";
import box from "./package";
import asset from "./asset";
import classRoute from "./class";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/product", product)
routes.use("/company", com)
routes.use("/package", box)
routes.use("/asset", asset)
routes.use("/class", classRoute)

export default routes;