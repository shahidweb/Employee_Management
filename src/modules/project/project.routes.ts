

import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { PermissionRole } from '../../types/constant';
import { createProject, deleteProjectById, getAllProject, getProjectById, updateProject } from "./project.controller";

const router = Router();
router.use(authenticate);

router.post('/', authorize(PermissionRole.ADMIN, PermissionRole.HR), createProject);
router.get('/', authorize(PermissionRole.ADMIN, PermissionRole.HR), getAllProject)
router.get('/:id', authorize(PermissionRole.ADMIN, PermissionRole.HR), getProjectById)
router.put('/:id', authorize(PermissionRole.ADMIN, PermissionRole.HR), updateProject)
router.delete('/:id', authorize(PermissionRole.ADMIN), deleteProjectById)

export default router;