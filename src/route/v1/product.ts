import { Router } from "express";
  import { checkJwt } from "../../middleware/checkJwt";
  import { checkRole } from "../../middleware/checkRole";
  import { checkCompany } from "../../middleware/checkCompany";
  import * as multer from "multer";
import { ProductController } from "../../controller/v1/ProductController";

  var textForm = multer()

  const router = Router();

  //Get all products
  router.get("/", [checkJwt, checkRole(["ADMIN", "OWNER"]), checkCompany()], ProductController.all);

  // Get one data
  router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN", "OWNER"])],
    ProductController.detail
  );

  //Create a new product
  router.post("/", textForm.none(), [checkJwt, checkRole(["OWNER"]), checkCompany()], ProductController.save);

  //Edit one user
  router.put(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    ProductController.update
  );

  //Delete one user
  router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    ProductController.delete
  );

  export default router;