import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import product from "./product";
import com from "./company";
import box from "./package";
import asset from "./asset";
import classRoute from "./class";
import classSessionRoute from "./classSession";
import service from "./service";
import serviceVariant from "./serviceVariant";
import voucher from "./voucher";
import order from "./order";
import membership from "./membership";
import plan from "./plan";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/product", product)
routes.use("/company", com)
routes.use("/package", box)
routes.use("/asset", asset)
routes.use("/class", classRoute)
routes.use("/session", classSessionRoute)
routes.use("/service", service)
routes.use("/servicevariant", serviceVariant)
routes.use("/voucher", voucher)
routes.use("/order", order)
routes.use("/membership", membership)
routes.use("/plan", plan)

export default routes;