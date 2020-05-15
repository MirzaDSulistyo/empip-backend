import { Router } from "express";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import { checkCompany } from "../../middleware/checkCompany";
import * as multer from "multer";
import { ServiceController } from "../../controller/v1/ServiceController";

var textForm = multer()

const router = Router();

//Get all data
router.get("/", [checkJwt, checkRole(["ADMIN", "OWNER"]), checkCompany()], ServiceController.all);

// Get one data
router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN", "OWNER"])],
    ServiceController.detail
);

//Create a new data
router.post("/", textForm.none(), [checkJwt, checkRole(["OWNER"]), checkCompany()], ServiceController.save);

//Edit one user
router.put(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    ServiceController.update
);

//Delete one data
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    ServiceController.delete
);

export default router;