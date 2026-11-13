import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { PermissionRole } from "../../types/constant";
import { createProjectEmployee, deleteProjectEmployeeById, getAllProjectEmployee, getProjectEmployeeById, updateProjectEmployeeById } from "./projectEmployee.controller";

const router = Router();

router.use(authenticate);

router.post("/", authorize(PermissionRole.ADMIN, PermissionRole.HR), createProjectEmployee);
router.get("/", authorize(PermissionRole.ADMIN, PermissionRole.HR), getAllProjectEmployee);
router.get("/:id", authorize(PermissionRole.ADMIN, PermissionRole.HR), getProjectEmployeeById);
router.put("/:id", authorize(PermissionRole.ADMIN, PermissionRole.HR), updateProjectEmployeeById);
router.delete("/:id", authorize(PermissionRole.ADMIN, PermissionRole.HR), deleteProjectEmployeeById);

export default router;