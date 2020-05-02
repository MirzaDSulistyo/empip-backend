import { Router } from "express";
  import { checkJwt } from "../middleware/checkJwt";
  import { checkRole } from "../middleware/checkRole";
  import * as multer from "multer";
import { CompanyController } from "../controller/CompanyController";

  var textForm = multer()

  const router = Router();

  //Get all data
  router.get("/", [checkJwt, checkRole(["ADMIN", "OWNER"])], CompanyController.all);

  // Get one data
  router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN", "OWNER"])],
    CompanyController.detail
  );

  //Create a new company
  router.post("/", textForm.none(), [checkJwt, checkRole(["OWNER"])], CompanyController.save);

  //Edit one user
  router.put(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    CompanyController.update
  );

  //Delete one user
  router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    CompanyController.delete
  );

  export default router;