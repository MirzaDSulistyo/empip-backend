import { Router } from "express";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import { checkCompany } from "../../middleware/checkCompany";
import * as multer from "multer";
import { MembershipController } from "../../controller/v1/MembershipController";

var textForm = multer()

const router = Router();

//Get all products
router.get("/", [checkJwt, checkRole(["ADMIN", "OWNER"]), checkCompany()], MembershipController.all);

// Get one data
router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN", "OWNER"])],
    MembershipController.detail
);

//Create a new product
router.post("/", textForm.none(), [checkJwt, checkRole(["OWNER"]), checkCompany()], MembershipController.save);

//Edit one user
router.put(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    MembershipController.update
);

//Delete one user
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    MembershipController.delete
);

export default router;