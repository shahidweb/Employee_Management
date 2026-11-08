import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { createEmployee, deleteEmployee, getAllEmployees, getEmployeeById, updateEmployee } from "./employee.controller";

const router = Router();
router.use(authenticate);

router.post("/", authorize("Admin", "HR"), createEmployee)
router.get("/", authorize("Admin", "HR"), getAllEmployees)
router.get("/:id", authorize("Admin", "HR"), getEmployeeById)
router.put("/:id", authorize("Admin", "HR"), updateEmployee);
router.delete("/:id", authorize("Admin"), deleteEmployee
);
export default router;