import { Router } from "express";
  import UserController from "../controller/UserController";
  import { checkJwt } from "../middleware/checkJwt";
  import { checkRole } from "../middleware/checkRole";
  import * as multer from "multer";

  var textForm = multer()

  const router = Router();

  //Get all users
  router.get("/", [checkJwt, checkRole(["ADMIN", "OWNER"])], UserController.listAll);

  // Get one user
  router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN", "OWNER"])],
    UserController.getOneById
  );

  //Create a new user
  router.post("/", textForm.none(), [checkJwt, checkRole(["OWNER"])], UserController.newUser);

  //Edit one user
  router.put(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    UserController.editUser
  );

  //Delete one user
  router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["OWNER"])],
    UserController.deleteUser
  );

  export default router;