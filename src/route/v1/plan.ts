import { Router } from "express";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import { checkCompany } from "../../middleware/checkCompany";
import * as multer from "multer";
import { PlanController } from "../../controller/v1/PlanController";

var textForm = multer()

const router = Router();

//Get all products
router.get("/", [checkJwt, checkRole(["ADMIN", "OWNER"]), checkCompany()], PlanController.all);

// Get one data
router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN", "OWNER"])],
    PlanController.detail
);

//Create a new product
router.post("/", textForm.none(), [checkJwt, checkRole(["OWNER"]), checkCompany()], PlanController.save);

//Edit one user
router.put(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    PlanController.update
);

//Delete one user
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    PlanController.delete
);

export default router;