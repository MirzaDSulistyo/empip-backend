import { Router } from "express";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import { checkCompany } from "../../middleware/checkCompany";
import * as multer from "multer";
import { ServiceVariantController } from "../../controller/v1/ServiceVariantController";

var textForm = multer()

const router = Router();

//Get all data
router.get("/", [checkJwt, checkRole(["ADMIN", "OWNER"]), checkCompany()], ServiceVariantController.all);

// Get one data
router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN", "OWNER"])],
    ServiceVariantController.detail
);

//Create a new data
router.post("/", textForm.none(), [checkJwt, checkRole(["OWNER"]), checkCompany()], ServiceVariantController.save);

//Edit one session
router.put(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    ServiceVariantController.update
);

//Delete one data
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    ServiceVariantController.delete
);

export default router;