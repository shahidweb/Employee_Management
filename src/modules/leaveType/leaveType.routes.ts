import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { PermissionRole } from "../../types/constant";
import { createLeaveType, getLeaveType } from "./leaveType.controller";


const router = Router()
router.use(authenticate);

router.post("/", authorize(PermissionRole.ADMIN, PermissionRole.HR), createLeaveType);
router.get("/", authorize(PermissionRole.ADMIN, PermissionRole.HR), getLeaveType);

export default router;