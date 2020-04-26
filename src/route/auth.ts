import { Router } from "express";
import AuthController from "../controller/AuthController";
import { checkJwt } from "../middleware/checkJwt";
import * as multer from "multer";

var textForm = multer()

const router = Router();
//Login route
router.post("/login", textForm.none(), AuthController.login);

//Change my password
router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;