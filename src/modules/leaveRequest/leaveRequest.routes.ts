import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { PermissionRole } from "../../types/constant";
import { changeLeaveRequestStatus, createLeaveRequest, deleteLeaveRequest, getAllLeaveRequest, getLeaveRequestByEmpId } from "./leaveRequest.controller";


const router = Router();
router.use(authenticate);

router.post("/", authorize(PermissionRole.ADMIN, PermissionRole.HR), createLeaveRequest);
router.get("/", authorize(PermissionRole.ADMIN, PermissionRole.HR), getAllLeaveRequest);
router.get("/:id", authorize(PermissionRole.ADMIN, PermissionRole.HR), getLeaveRequestByEmpId);
router.put("/:id", authorize(PermissionRole.ADMIN, PermissionRole.HR), changeLeaveRequestStatus);
router.delete("/:id", authorize(PermissionRole.ADMIN, PermissionRole.HR), deleteLeaveRequest);

export default router;