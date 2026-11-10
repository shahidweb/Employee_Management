import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { PermissionRole } from "../../types/constant";
import { createEmployee, deleteEmployee, getAllEmployees, getEmployeeById, updateEmployee } from "./employee.controller";

const router = Router();
router.use(authenticate);

router.post("/", authorize(PermissionRole.ADMIN, PermissionRole.HR), createEmployee)
router.get("/", authorize(PermissionRole.ADMIN, PermissionRole.HR), getAllEmployees)
router.get("/:id", authorize(PermissionRole.ADMIN, PermissionRole.HR), getEmployeeById)
router.put("/:id", authorize(PermissionRole.ADMIN, PermissionRole.HR), updateEmployee);
router.delete("/:id", authorize(PermissionRole.ADMIN), deleteEmployee);

export default router;