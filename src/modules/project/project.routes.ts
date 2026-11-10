

import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { PermissionRole } from '../../types/constant';
import { createProject } from "./project.controller";

const router = Router();
router.use(authenticate);

router.post('/', authorize(PermissionRole.ADMIN, PermissionRole.HR), createProject);

export default router;