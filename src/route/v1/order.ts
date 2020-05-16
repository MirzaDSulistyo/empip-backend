import { Router } from "express";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import { checkCompany } from "../../middleware/checkCompany";
import * as multer from "multer";
import { OrderController } from "../../controller/v1/OrderController";

var textForm = multer()

const router = Router();

//Get all data
router.get("/", [checkJwt, checkRole(["ADMIN", "OWNER"]), checkCompany()], OrderController.all);

// Get one data
router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN", "OWNER"])],
    OrderController.detail
);

//Create a new data
router.post("/", textForm.none(), [checkJwt, checkRole(["OWNER"]), checkCompany()], OrderController.save);

//Edit one data
router.put(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    OrderController.update
);

//Delete one data
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    OrderController.delete
);

export default router;