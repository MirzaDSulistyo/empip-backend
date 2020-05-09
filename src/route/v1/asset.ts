import { Router } from "express";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import { checkCompany } from "../../middleware/checkCompany";
import * as multer from "multer";
import { AssetController } from "../../controller/v1/AssetController";

var textForm = multer()

const router = Router();

//Get all data
router.get("/", [checkJwt, checkRole(["ADMIN", "OWNER"]), checkCompany()], AssetController.all);

// Get one data
router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN", "OWNER"])],
    AssetController.detail
);

//Create a new data
router.post("/", textForm.none(), [checkJwt, checkRole(["OWNER"]), checkCompany()], AssetController.save);

//Edit one user
router.put(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    AssetController.update
);

//Delete one data
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    AssetController.delete
);

export default router;