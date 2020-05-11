import { Router } from "express";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import { checkCompany } from "../../middleware/checkCompany";
import * as multer from "multer";
import { ClassSessionController } from "../../controller/v1/ClassSessionController";

var textForm = multer()

const router = Router();

//Get all data
router.get("/", [checkJwt, checkRole(["ADMIN", "OWNER"]), checkCompany()], ClassSessionController.all);

// Get one data
router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN", "OWNER"])],
    ClassSessionController.detail
);

//Create a new data
router.post("/", textForm.none(), [checkJwt, checkRole(["OWNER"]), checkCompany()], ClassSessionController.save);

//Edit one session
router.put(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    ClassSessionController.update
);

//Delete one data
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    ClassSessionController.delete
);

export default router;