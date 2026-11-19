import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { PermissionRole } from "../../types/constant";
import { createChildDepartment, deleteChildDepartmentById, getAllChildDepartment, getChildDepartmentByParentId } from "./childDepartment.controller";

const router = Router();

router.use(authenticate);

router.post("/", authorize(PermissionRole.ADMIN, PermissionRole.HR), createChildDepartment);
router.get("/", authorize(PermissionRole.ADMIN, PermissionRole.HR), getAllChildDepartment);
router.get("/:id", authorize(PermissionRole.ADMIN, PermissionRole.HR), getChildDepartmentByParentId);
router.delete("/:id", authorize(PermissionRole.ADMIN, PermissionRole.HR), deleteChildDepartmentById);

export default router;