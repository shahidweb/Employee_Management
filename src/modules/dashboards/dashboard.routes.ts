import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { PermissionRole } from "../../types/constant";
import { getDashboard, getEmployeeLeaveDashboard, getHRDashboard } from "./dashboard.controller";


const  router = Router();
router.use(authenticate)

router.get("/Admin", authorize(PermissionRole.ADMIN), getDashboard);
router.get("/HR", authorize(PermissionRole.ADMIN, PermissionRole.HR), getHRDashboard);
router.get("/emp/:id", authorize(PermissionRole.EMPLOYEE), getEmployeeLeaveDashboard);


export default router;