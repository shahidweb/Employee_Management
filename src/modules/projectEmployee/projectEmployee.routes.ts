import { Router } from "express";
import { createProjectEmployee } from "./projectEmployee.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { PermissionRole } from "../../types/constant";

const router = Router();

router.use(authenticate);

router.post("/", authorize(PermissionRole.ADMIN, PermissionRole.HR), createProjectEmployee);

export default router;