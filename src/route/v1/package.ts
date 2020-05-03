import { Router } from "express";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import { checkCompany } from "../../middleware/checkCompany";
import * as multer from "multer";
import { PackageController } from "../../controller/v1/PackageController";

var textForm = multer()

const router = Router();

//Get all packages
router.get("/", [checkJwt, checkRole(["ADMIN", "OWNER"]), checkCompany()], PackageController.all);

//Create a new package
router.post("/", textForm.none(), [checkJwt, checkRole(["OWNER"]), checkCompany()], PackageController.save);

// Get one data
router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN", "OWNER"])],
    PackageController.detail
);

//Edit one data
router.put(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"]), checkCompany()],
    PackageController.update
);

//Delete one data
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    PackageController.delete
);

export default router;