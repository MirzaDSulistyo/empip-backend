import { Router } from "express";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import { checkCompany } from "../../middleware/checkCompany";
import * as multer from "multer";
import { VoucherController } from "../../controller/v1/VoucherController";

var textForm = multer()

const router = Router();

//Get all products
router.get("/", [checkJwt, checkRole(["ADMIN", "OWNER"]), checkCompany()], VoucherController.all);

// Get one data
router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN", "OWNER"])],
    VoucherController.detail
);

//Create a new product
router.post("/", textForm.none(), [checkJwt, checkRole(["OWNER"]), checkCompany()], VoucherController.save);

//Edit one user
router.put(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    VoucherController.update
);

//Delete one user
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    VoucherController.delete
);

export default router;