import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { PermissionRole } from "../../types/constant";
import { createEarnedLeave, deleteEarnedLeaveById, getAllEarnedLeave, getEarnedLeaveByEmpId } from "./earnedLeave.controller";



const router = Router();
router.use(authenticate);

router.post("/", authorize(PermissionRole.ADMIN, PermissionRole.HR), createEarnedLeave);
router.get("/", authorize(PermissionRole.ADMIN, PermissionRole.HR), getAllEarnedLeave);
router.get("/:id", authorize(PermissionRole.ADMIN, PermissionRole.HR), getEarnedLeaveByEmpId);
router.delete("/:id", authorize(PermissionRole.ADMIN, PermissionRole.HR), deleteEarnedLeaveById);


export default router;