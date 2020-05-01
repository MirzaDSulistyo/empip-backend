import { Router } from "express";
  import { checkJwt } from "../middleware/checkJwt";
  import { checkRole } from "../middleware/checkRole";
  import { checkCompany } from "../middleware/checkCompany";
  import * as multer from "multer";
import { ProductController } from "../controller/ProductController";

  var textForm = multer()

  const router = Router();

  //Get all products
  router.get("/", [checkJwt, checkRole(["ADMIN", "OWNER"]), checkCompany()], ProductController.listAll);

  //Create a new product
  router.post("/", textForm.none(), [checkJwt, checkRole(["OWNER"]), checkCompany()], ProductController.newProduct);

  export default router;