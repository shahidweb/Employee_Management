import { Router } from "express";
import { createEmployee } from "./employee.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, authorize("Admin", "HR"), createEmployee)

export default router;