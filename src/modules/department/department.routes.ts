import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { PermissionRole } from "../../types/constant";
import { createBulkDepartment, createDepartment, deleteDepartment, getAllDepartment, updateDepartment } from "./department.controller";


const router = Router();

router.use(authenticate);
router.post("/", authorize(PermissionRole.ADMIN, PermissionRole.HR), createDepartment);
router.post("/bulk", authorize(PermissionRole.ADMIN, PermissionRole.HR), createBulkDepartment);
router.get("/", authorize(PermissionRole.ADMIN, PermissionRole.HR), getAllDepartment);
router.put("/:id", authorize(PermissionRole.ADMIN, PermissionRole.HR), updateDepartment);
router.delete("/:id", authorize(PermissionRole.ADMIN, PermissionRole.HR), deleteDepartment);

export default router;